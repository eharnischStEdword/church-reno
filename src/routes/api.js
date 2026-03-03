const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../database');
const { generateIndividualReport } = require('../ai');

router.post('/respondents', (req, res) => {
  const { name } = req.body || {};
  const label = (name && String(name).trim()) ? String(name).trim() : new Date().toLocaleString();
  const id = uuidv4();
  const db = getDb();
  db.prepare('INSERT INTO respondents (id, name) VALUES (?, ?)').run(id, label);
  res.json({ id, name: label });
});

router.post('/responses/:respondentId/section/:section', (req, res) => {
  const { respondentId, section } = req.params;
  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Answers array required' });
  }
  const db = getDb();
  const respondent = db.prepare('SELECT id FROM respondents WHERE id = ?').get(respondentId);
  if (!respondent) return res.status(404).json({ error: 'Respondent not found' });

  const upsert = db.prepare(
    'INSERT INTO responses (respondent_id, section, question_id, answer) VALUES (?, ?, ?, ?) ON CONFLICT(respondent_id, question_id) DO UPDATE SET answer = excluded.answer'
  );
  const saveAll = db.transaction((items) => {
    for (const item of items) {
      upsert.run(respondentId, parseInt(section), item.questionId, JSON.stringify(item.answer));
    }
  });
  saveAll(answers);
  res.json({ saved: answers.length });
});

router.post('/respondents/:id/complete', (req, res) => {
  const db = getDb();
  db.prepare("UPDATE respondents SET completed_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

router.get('/results/:respondentId', async (req, res) => {
  const db = getDb();
  const { respondentId } = req.params;
  const cached = db.prepare(
    "SELECT content FROM ai_results WHERE respondent_id = ? AND result_type = 'individual' ORDER BY created_at DESC LIMIT 1"
  ).get(respondentId);
  if (cached) return res.json(JSON.parse(cached.content));

  const responses = db.prepare(
    'SELECT question_id, answer, section FROM responses WHERE respondent_id = ? ORDER BY section, question_id'
  ).all(respondentId);
  const respondent = db.prepare('SELECT name FROM respondents WHERE id = ?').get(respondentId);
  if (!respondent || responses.length === 0) {
    return res.status(404).json({ error: 'No responses found' });
  }

  try {
    const result = await generateIndividualReport(respondent.name, responses);
    db.prepare(
      "INSERT INTO ai_results (respondent_id, result_type, content) VALUES (?, 'individual', ?)"
    ).run(respondentId, JSON.stringify(result));
    res.json(result);
  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: 'Failed to generate results.' });
  }
});

module.exports = router;
