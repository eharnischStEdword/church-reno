const app = {
  respondentId: null,
  currentSection: 0,
  answers: {},

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + id).classList.add('active');
    window.scrollTo(0, 0);
  },

  async startQuiz() {
    try {
      const res = await fetch('/api/respondents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      this.respondentId = data.id;
      this.currentSection = 0;
      this.renderSection();
      this.showScreen('quiz');
    } catch (err) {
      alert('Failed to connect. Please try again.');
    }
  },

  renderSection() {
    const section = QUIZ_SECTIONS[this.currentSection];
    document.getElementById('section-title').textContent =
      'Section ' + section.id + ': ' + section.title;
    document.getElementById('section-description').textContent = section.description;

    const pct = ((this.currentSection) / QUIZ_SECTIONS.length) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-label').textContent =
      'Section ' + (this.currentSection + 1) + ' of ' + QUIZ_SECTIONS.length;

    document.getElementById('btn-prev').style.visibility =
      this.currentSection === 0 ? 'hidden' : 'visible';
    const isLast = this.currentSection === QUIZ_SECTIONS.length - 1;
    document.getElementById('btn-next').textContent = isLast ? 'Submit' : 'Continue';

    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    section.questions.forEach(q => {
      const block = document.createElement('div');
      block.className = 'question-block';

      const text = document.createElement('div');
      text.className = 'question-text';
      text.textContent = q.text;
      block.appendChild(text);

      const saved = this.answers[q.id];

      if (q.type === 'multi_select') {
        this.renderMultiSelect(block, q, saved);
      } else if (q.type === 'single_choice') {
        this.renderSingleChoice(block, q, saved);
      } else if (q.type === 'scale') {
        this.renderScale(block, q, saved);
      } else if (q.type === 'open_text') {
        this.renderOpenText(block, q, saved);
      }

      container.appendChild(block);
    });
  },

  renderMultiSelect(block, q, saved) {
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    q.options.forEach(opt => {
      const chip = document.createElement('button');
      chip.className = 'option-chip';
      chip.textContent = opt;
      if (saved && saved.includes(opt)) chip.classList.add('selected');
      chip.onclick = () => {
        chip.classList.toggle('selected');
        const selected = [...grid.querySelectorAll('.selected')].map(c => c.textContent);
        this.answers[q.id] = selected;
      };
      grid.appendChild(chip);
    });
    block.appendChild(grid);
  },

  renderSingleChoice(block, q, saved) {
    const useCards = q.options.some(o => o.length > 30);
    const wrapper = document.createElement('div');
    wrapper.className = useCards ? 'options-list' : 'options-grid';

    q.options.forEach(opt => {
      const el = document.createElement('button');
      el.className = useCards ? 'option-card' : 'option-chip';
      el.textContent = opt;
      if (saved === opt) el.classList.add('selected');
      el.onclick = () => {
        wrapper.querySelectorAll(useCards ? '.option-card' : '.option-chip')
          .forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        this.answers[q.id] = opt;
      };
      wrapper.appendChild(el);
    });
    block.appendChild(wrapper);
  },

  renderScale(block, q, saved) {
    const wrap = document.createElement('div');
    wrap.className = 'scale-wrap';

    const labels = document.createElement('div');
    labels.className = 'scale-labels';
    const lowSpan = document.createElement('span');
    lowSpan.textContent = q.low_label;
    const highSpan = document.createElement('span');
    highSpan.style.textAlign = 'right';
    highSpan.textContent = q.high_label;
    labels.appendChild(lowSpan);
    labels.appendChild(highSpan);
    wrap.appendChild(labels);

    const dots = document.createElement('div');
    dots.className = 'scale-dots';
    for (let i = 1; i <= 5; i++) {
      const dot = document.createElement('button');
      dot.className = 'scale-dot';
      dot.textContent = i;
      if (saved === i) dot.classList.add('selected');
      dot.onclick = () => {
        dots.querySelectorAll('.scale-dot').forEach(d => d.classList.remove('selected'));
        dot.classList.add('selected');
        this.answers[q.id] = i;
      };
      dots.appendChild(dot);
    }
    wrap.appendChild(dots);
    block.appendChild(wrap);
  },

  renderOpenText(block, q, saved) {
    const textarea = document.createElement('textarea');
    textarea.className = 'open-text';
    textarea.placeholder = 'Your thoughts...';
    if (saved) textarea.value = saved;
    textarea.oninput = () => { this.answers[q.id] = textarea.value; };
    block.appendChild(textarea);
  },

  async saveCurrentSection() {
    const section = QUIZ_SECTIONS[this.currentSection];
    const answers = section.questions.map(q => ({
      questionId: q.id,
      answer: this.answers[q.id] || null
    })).filter(a => a.answer !== null && a.answer !== '' &&
      !(Array.isArray(a.answer) && a.answer.length === 0));

    if (answers.length > 0) {
      await fetch('/api/responses/' + this.respondentId + '/section/' + section.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
    }
  },

  async nextSection() {
    await this.saveCurrentSection();
    if (this.currentSection < QUIZ_SECTIONS.length - 1) {
      this.currentSection++;
      this.renderSection();
    } else {
      await this.submitQuiz();
    }
  },

  prevSection() {
    if (this.currentSection > 0) {
      this.saveCurrentSection();
      this.currentSection--;
      this.renderSection();
    }
  },

  async submitQuiz() {
    this.showScreen('submitting');
    try {
      await fetch('/api/respondents/' + this.respondentId + '/complete', { method: 'POST' });
      const res = await fetch('/api/results/' + this.respondentId);
      const data = await res.json();
      if (res.ok) {
        this.renderResults(data);
      } else {
        this.renderResultsError(data.error || 'Something went wrong.');
      }
      this.showScreen('results');
    } catch (err) {
      this.renderResultsError('Failed to generate results. Please let the administrator know.');
      this.showScreen('results');
    }
  },

  renderResults(data) {
    const el = document.getElementById('results-content');
    let html = '';
    html += '<div class="result-profile-title">' + this.esc(data.profileTitle) + '</div>';
    html += '<div class="result-section"><h3>Your Aesthetic Profile</h3><p>' + this.esc(data.profileDescription) + '</p></div>';
    html += '<div class="result-section"><h3>Reference Churches</h3><ul class="reference-churches"></ul></div>';
    html += '<div class="result-section"><h3>Sanctuary Vision</h3><p>' + this.esc(data.sanctuaryVision) + '</p></div>';
    html += '<div class="result-section"><h3>Light &amp; Materials</h3><p>' + this.esc(data.lightAndMaterials) + '</p></div>';
    html += '<div class="result-section"><h3>Sacred Art Direction</h3><p>' + this.esc(data.sacredArtDirection) + '</p></div>';
    html += '<div class="result-section"><h3>When You Walk In</h3><p><em>' + this.esc(data.atmosphereSummary) + '</em></p></div>';

    if (data.contradictions && data.contradictions.length > 0) {
      html += '<div class="result-section"><h3>Tensions to Consider</h3>';
      data.contradictions.forEach(c => { html += '<div class="contradiction-card">' + this.esc(c) + '</div>'; });
      html += '</div>';
    }

    html += '<div class="result-section"><h3>Design Brief</h3><p>' + this.esc(data.designBrief) + '</p></div>';

    if (data.keyDecisions && data.keyDecisions.length > 0) {
      html += '<div class="result-section"><h3>Decisions to Consider</h3><ul class="reference-churches">';
      data.keyDecisions.forEach(d => { html += '<li>' + this.esc(d) + '</li>'; });
      html += '</ul></div>';
    }

    html += '<div style="text-align: center; padding: 2rem 0; color: var(--text-light); font-size: 0.85rem;">';
    html += 'Your responses have been saved. The admin will use these along with everyone else\'s to generate a group composite report.</div>';
    el.innerHTML = html;
    const refList = el.querySelector('.reference-churches');
    if (refList) {
      (data.referenceChurches || []).forEach(c => {
        const name = typeof c === 'string' ? c : (c && c.name) || '';
        const url = typeof c === 'object' && c && c.url && (String(c.url).startsWith('http://') || String(c.url).startsWith('https://')) ? c.url : null;
        const li = document.createElement('li');
        if (url) {
          const a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = name;
          li.appendChild(a);
          const urlSpan = document.createElement('span');
          urlSpan.className = 'reference-church-url';
          urlSpan.textContent = ' ' + url;
          li.appendChild(urlSpan);
        } else {
          li.textContent = name;
        }
        refList.appendChild(li);
      });
    }
  },

  renderResultsError(msg) {
    document.getElementById('results-content').innerHTML =
      '<div style="text-align: center; padding: 3rem 0;">' +
      '<p style="color: var(--error); margin-bottom: 1rem;">' + this.esc(msg) + '</p>' +
      '<p style="color: var(--text-light); font-size: 0.9rem;">Your answers have been saved. Results can be generated later from the admin dashboard.</p></div>';
  },

  esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => {});
