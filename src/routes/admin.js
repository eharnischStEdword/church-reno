const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { generateCompositeReport } = require('../ai');

function requireAuth(req, res, next) {
  const password = req.headers['x-admin-password'] || req.query.password;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.use(requireAuth);

router.get('/respondents', (req, res) => {
  const db = getDb();
  const respondents = db.prepare(
    'SELECT id, name, created_at, completed_at FROM respondents ORDER BY created_at DESC'
  ).all();
  res.json(respondents);
});

router.get('/respondents/:id/responses', (req, res) => {
  const db = getDb();
  const responses = db.prepare(
    'SELECT question_id, answer, section FROM responses WHERE respondent_id = ? ORDER BY section, question_id'
  ).all(req.params.id);
  res.json(responses);
});

router.get('/composite', async (req, res) => {
  const db = getDb();

  // Check for cached composite
  const cached = db.prepare(
    "SELECT content FROM ai_results WHERE result_type = 'composite' ORDER BY created_at DESC LIMIT 1"
  ).get();
  if (cached && !req.query.refresh) {
    return res.json(JSON.parse(cached.content));
  }

  // Get all completed respondents and their responses
  const respondents = db.prepare(
    'SELECT id, name FROM respondents WHERE completed_at IS NOT NULL'
  ).all();

  if (respondents.length < 2) {
    return res.status(400).json({ error: 'Need at least 2 completed responses for a composite.' });
  }

  const allData = respondents.map(r => {
    const responses = db.prepare(
      'SELECT question_id, answer, section FROM responses WHERE respondent_id = ? ORDER BY section, question_id'
    ).all(r.id);
    return { name: r.name, responses };
  });

  try {
    const result = await generateCompositeReport(allData);
    db.prepare(
      "INSERT INTO ai_results (result_type, content) VALUES ('composite', ?)"
    ).run(JSON.stringify(result));
    res.json(result);
  } catch (err) {
    console.error('Composite generation error:', err);
    res.status(500).json({ error: 'Failed to generate composite report.' });
  }
});

// Regenerate individual result
router.post('/regenerate/:respondentId', async (req, res) => {
  const db = getDb();
  const { respondentId } = req.params;
  
  // Delete cached result
  db.prepare("DELETE FROM ai_results WHERE respondent_id = ? AND result_type = 'individual'").run(respondentId);

  // Redirect to the normal results endpoint logic
  const responses = db.prepare(
    'SELECT question_id, answer, section FROM responses WHERE respondent_id = ? ORDER BY section, question_id'
  ).all(respondentId);
  const respondent = db.prepare('SELECT name FROM respondents WHERE id = ?').get(respondentId);

  if (!respondent || responses.length === 0) {
    return res.status(404).json({ error: 'No responses found' });
  }

  try {
    const { generateIndividualReport } = require('../ai');
    const result = await generateIndividualReport(respondent.name, responses);
    db.prepare(
      "INSERT INTO ai_results (respondent_id, result_type, content) VALUES (?, 'individual', ?)"
    ).run(respondentId, JSON.stringify(result));
    res.json(result);
  } catch (err) {
    console.error('Regeneration error:', err);
    res.status(500).json({ error: 'Failed to regenerate results.' });
  }
});

module.exports = router;
