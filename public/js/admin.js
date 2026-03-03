const admin = {
  password: null,
  showAuthError(msg) {
    const el = document.getElementById('auth-error');
    if (!el) return;
    el.textContent = msg || '';
    el.style.display = msg ? 'block' : 'none';
  },
  login() {
    const input = document.getElementById('admin-password');
    const btn = document.getElementById('admin-login-btn');
    this.password = (input && input.value || '').trim();
    this.showAuthError('');
    if (!this.password) {
      this.showAuthError('Please enter the password.');
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = 'Checking…'; }
    this.loadDashboard();
  },
  headers() {
    return { 'Content-Type': 'application/json', 'X-Admin-Password': this.password };
  },
  async loadDashboard() {
    const btn = document.getElementById('admin-login-btn');
    try {
      const res = await fetch('/admin/respondents', { headers: this.headers() });
      if (btn) { btn.disabled = false; btn.textContent = 'Enter'; }
      if (res.status === 401) {
        this.showAuthError('Invalid password. If you copied from Render, make sure there are no extra spaces or line breaks—try typing it once by hand.');
        return;
      }
      if (res.status === 503) {
        const data = await res.json().catch(() => ({}));
        this.showAuthError(data.error || 'Admin password not configured on server.');
        return;
      }
      this.showAuthError('');
      const respondents = await res.json();
      document.getElementById('auth-screen').style.display = 'none';
      document.getElementById('dashboard-screen').style.display = 'block';
      const list = document.getElementById('respondents-list');
      if (respondents.length === 0) {
        list.innerHTML = '<p style="color:var(--text-light)">No responses yet.</p>';
        return;
      }
      list.innerHTML = respondents.map(r => {
        let btns = '';
        if (r.completed_at) {
          btns = '<button class="btn btn-secondary admin-btn" data-action="view-results" data-id="' + this.esc(r.id) + '" data-name="' + this.esc(r.name) + '">View Results</button> ';
          btns += '<button class="btn btn-secondary admin-btn" data-action="view-raw" data-id="' + this.esc(r.id) + '" data-name="' + this.esc(r.name) + '">Raw Data</button> ';
        }
        btns += '<button class="btn btn-danger admin-btn" data-action="delete" data-id="' + this.esc(r.id) + '" data-name="' + this.esc(r.name) + '">Delete</button>';
        return '<div class="respondent-card" data-respondent-id="' + this.esc(r.id) + '"><div><span class="name">' + this.esc(r.name) + '</span> <span class="status ' + (r.completed_at ? 'complete' : '') + '">' + (r.completed_at ? 'Completed' : 'In progress') + '</span></div><div class="card-actions">' + btns + '</div></div>';
      }).join('');
      list.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const name = btn.getAttribute('data-name');
          const action = btn.getAttribute('data-action');
          if (action === 'view-results') admin.viewResults(id, name);
          else if (action === 'view-raw') admin.viewRaw(id, name);
          else if (action === 'delete') admin.deleteRespondent(id, name);
        });
      });
    } catch (err) {
      if (document.getElementById('admin-login-btn')) {
        document.getElementById('admin-login-btn').disabled = false;
        document.getElementById('admin-login-btn').textContent = 'Enter';
      }
      this.showAuthError('Could not reach the server. Check your connection and try again.');
    }
  },
  async viewResults(id, name) {
    const detail = document.getElementById('admin-detail');
    detail.innerHTML = '<div class="results-loading"><div class="spinner"></div><p>Loading...</p></div>';
    try {
      const res = await fetch('/api/results/' + id);
      const data = await res.json();
      if (data.error) { detail.innerHTML = '<p>' + this.esc(data.error) + '</p>'; return; }
      let h = '<h2 style="color:var(--green)">' + this.esc(name) + '</h2>';
      h += '<div class="result-profile-title">' + this.esc(data.profileTitle) + '</div>';
      h += '<div class="result-section"><h3>Profile</h3><p>' + this.esc(data.profileDescription) + '</p></div>';
      h += '<div class="result-section"><h3>Reference Churches</h3><ul class="reference-churches"></ul></div>';
      h += '<div class="result-section"><h3>Sanctuary</h3><p>' + this.esc(data.sanctuaryVision) + '</p></div>';
      h += '<div class="result-section"><h3>Light/Materials</h3><p>' + this.esc(data.lightAndMaterials) + '</p></div>';
      h += '<div class="result-section"><h3>Sacred Art</h3><p>' + this.esc(data.sacredArtDirection) + '</p></div>';
      h += '<div class="result-section"><h3>Atmosphere</h3><p><em>' + this.esc(data.atmosphereSummary) + '</em></p></div>';
      if (data.contradictions && data.contradictions.length) { h += '<div class="result-section"><h3>Tensions</h3>'; data.contradictions.forEach(c=>{h+='<div class="contradiction-card">'+this.esc(c)+'</div>';}); h+='</div>'; }
      h += '<div class="result-section"><h3>Design Brief</h3><p>' + this.esc(data.designBrief) + '</p></div>';
      h += '<button class="btn btn-secondary admin-btn" onclick="admin.regenerate(\'' + id + '\',\'' + name + '\')">Regenerate</button>';
      detail.innerHTML = h;
      const refList = detail.querySelector('.reference-churches');
      if (refList && (data.referenceChurches || []).length) {
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
    } catch (err) { detail.innerHTML = '<p>Failed to load.</p>'; }
  },
  async viewRaw(id, name) {
    const detail = document.getElementById('admin-detail');
    detail.innerHTML = '<div class="results-loading"><div class="spinner"></div></div>';
    try {
      const res = await fetch('/admin/respondents/' + id + '/responses', { headers: this.headers() });
      const data = await res.json();
      detail.innerHTML = '<h2>' + this.esc(name) + ' Raw</h2><pre style="background:#fff;border:1px solid #ddd;padding:1rem;border-radius:6px;overflow-x:auto;font-size:0.8rem">' + this.esc(JSON.stringify(data,null,2)) + '</pre>';
    } catch (err) { detail.innerHTML = '<p>Failed.</p>'; }
  },
  async regenerate(id, name) {
    const detail = document.getElementById('admin-detail');
    detail.innerHTML = '<div class="results-loading"><div class="spinner"></div><p>Regenerating...</p></div>';
    try {
      await fetch('/admin/regenerate/' + id, { method: 'POST', headers: this.headers() });
      this.viewResults(id, name);
    } catch (err) { detail.innerHTML = '<p>Failed.</p>'; }
  },
  async deleteRespondent(id, nameAttr) {
    const nameDisplay = (() => { const d = document.createElement('div'); d.innerHTML = nameAttr || ''; return d.textContent || 'this entry'; })();
    if (!confirm('Permanently delete all responses and results for “‘ + nameDisplay + '”? This cannot be undone.')) return;
    try {
      const res = await fetch('/admin/respondents/' + encodeURIComponent(id), { method: 'DELETE', headers: this.headers() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Delete failed.');
        return;
      }
      document.getElementById('admin-detail').innerHTML = '';
      this.loadDashboard();
    } catch (err) {
      alert('Failed to delete.');
    }
  },
  async generateComposite() {
    const detail = document.getElementById('admin-detail');
    detail.innerHTML = '<div class="results-loading"><div class="spinner"></div><p>Generating composite... 30-60 sec.</p></div>';
    try {
      const res = await fetch('/admin/composite?refresh=true', { headers: this.headers() });
      const data = await res.json();
      if (data.error) { detail.innerHTML = '<p>' + this.esc(data.error) + '</p>'; return; }
      let h = '<h2 style="color:var(--green)">Composite Report</h2>';
      if (data.consensusItems) { h += '<div class="result-section"><h3>Consensus</h3>'; data.consensusItems.forEach(i=>{h+='<div style="margin-bottom:0.75rem"><strong>'+this.esc(i.topic)+'</strong> ('+this.esc(i.strength)+')<br><span style="color:#666;font-size:0.9rem">'+this.esc(i.description)+'</span></div>';}); h+='</div>'; }
      if (data.divergenceItems) { h += '<div class="result-section"><h3>Divergence</h3>'; data.divergenceItems.forEach(i=>{h+='<div class="contradiction-card"><strong>'+this.esc(i.topic)+'</strong><br>'; if(i.camps){i.camps.forEach(c=>{h+='<div style="margin-top:0.5rem;font-size:0.85rem"><em>'+this.esc(c.position)+'</em>: '+(c.members||[]).join(', ')+'</div>';});} h+='</div>';}); h+='</div>'; }
      if (data.designBrief) { h += '<div class="result-section"><h3>Design Brief</h3><p>' + this.esc(data.designBrief) + '</p></div>'; }
      if (data.decisionsNeeded) { h += '<div class="result-section"><h3>Decisions Needed</h3>'; data.decisionsNeeded.forEach(d=>{h+='<div style="margin-bottom:0.75rem"><strong>'+this.esc(d.topic)+'</strong><br><span style="color:#666;font-size:0.9rem">'+this.esc(d.description)+'</span></div>';}); h+='</div>'; }
      if (data.scaleAverages) { h += '<div class="result-section"><h3>Scale Averages</h3><table style="width:100%;font-size:0.85rem;border-collapse:collapse"><tr><th style="text-align:left;padding:0.5rem">Q</th><th>Mean</th><th>SD</th><th style="text-align:left">Note</th></tr>'; data.scaleAverages.forEach(s=>{h+='<tr><td style="padding:0.5rem">'+this.esc(s.question)+'</td><td style="text-align:center">'+(s.mean||0).toFixed(1)+'</td><td style="text-align:center">'+(s.stdDev||0).toFixed(1)+'</td><td>'+this.esc(s.interpretation)+'</td></tr>';}); h+='</table></div>'; }
      detail.innerHTML = h;
    } catch (err) { detail.innerHTML = '<p>Failed.</p>'; }
  },
  esc(str) { if(!str)return''; const d=document.createElement('div'); d.textContent=String(str); return d.innerHTML; }
};
document.addEventListener('DOMContentLoaded', () => { document.getElementById('admin-password').addEventListener('keydown', e => { if(e.key==='Enter') admin.login(); }); });
