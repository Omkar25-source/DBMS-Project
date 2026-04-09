const BASE = 'http://127.0.0.1:5000';

const api = {
  async get(path) {
    const res = await fetch(BASE + path);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async put(path, body) {
    const res = await fetch(BASE + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  async delete(path) {
    const res = await fetch(BASE + path, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

// ── Toast ──────────────────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 350); }, 3200);
}

// ── Modal helpers ──────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  const form = document.querySelector(`#${id} form`);
  if (form) form.reset();
}

// ── Loading ────────────────────────────────────────────────────────────────
function loadingHTML() {
  return `<div class="loader"><div class="spinner"></div><span>Loading…</span></div>`;
}

// ── Tag helpers ────────────────────────────────────────────────────────────
function levelTag(l) {
  const m = { BEGINNER:'tag-green', INTERMEDIATE:'tag-yellow', ADVANCED:'tag-red' };
  return `<span class="tag ${m[l]||'tag-purple'}">${l}</span>`;
}
function difficultyTag(d) {
  const m = { EASY:'tag-green', MEDIUM:'tag-yellow', HARD:'tag-red' };
  return `<span class="tag ${m[d]||'tag-purple'}">${d}</span>`;
}
function statusTag(s) {
  const m = { 'NOT STARTED':'tag-red', 'IN PROGRESS':'tag-yellow', COMPLETED:'tag-green' };
  return `<span class="tag ${m[s]||'tag-purple'}">${s}</span>`;
}

// ── API health ─────────────────────────────────────────────────────────────
async function checkApiHealth() {
  const dot  = document.getElementById('apiDot');
  const text = document.getElementById('apiStatus');
  try {
    await api.get('/');
    dot.className  = 'status-dot online';
    text.textContent = 'Connected';
  } catch {
    dot.className  = 'status-dot offline';
    text.textContent = 'Offline';
  }
}
