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

// ── Toast ──────────────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 350); }, 3000);
}

// ── Modal helpers ─────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  // Reset form inside
  const form = document.querySelector(`#${id} form`);
  if (form) form.reset();
}

// ── Loading state ─────────────────────────────────────────────────
function loadingHTML() {
  return `<div class="loader"><div class="spinner"></div> Loading…</div>`;
}

// ── Tag helpers ───────────────────────────────────────────────────
function levelTag(level) {
  const map = { BEGINNER: 'tag-green', INTERMEDIATE: 'tag-yellow', ADVANCED: 'tag-red' };
  return `<span class="tag ${map[level] || 'tag-purple'}">${level}</span>`;
}
function difficultyTag(d) {
  const map = { EASY: 'tag-green', MEDIUM: 'tag-yellow', HARD: 'tag-red' };
  return `<span class="tag ${map[d] || 'tag-purple'}">${d}</span>`;
}
function statusTag(s) {
  const map = { 'NOT STARTED': 'tag-red', 'IN PROGRESS': 'tag-yellow', COMPLETED: 'tag-green' };
  return `<span class="tag ${map[s] || 'tag-purple'}">${s}</span>`;
}
