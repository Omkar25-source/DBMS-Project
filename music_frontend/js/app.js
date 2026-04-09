// =====================================================================
//  USERS MODULE
// =====================================================================
async function renderUsers() {
  document.getElementById('content').innerHTML = `
    <p class="page-title">👤 Users</p>
    <p class="page-subtitle">Manage learner accounts — Create, View, Update &amp; Delete</p>
    <div class="panel">
      <div class="panel-header">
        <h3>All Users</h3>
        <button class="btn btn-primary" onclick="openModal('addUserModal')">＋ Add User</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Actions</th></tr></thead>
          <tbody id="usersTable">${loadingHTML()}</tbody>
        </table>
      </div>
    </div>

    <!-- ADD USER MODAL -->
    <div class="modal-overlay" id="addUserModal">
      <div class="modal">
        <div class="modal-header">
          <h3>➕ Add New User</h3>
          <button class="modal-close" onclick="closeModal('addUserModal')">✕</button>
        </div>
        <form id="addUserForm">
          <div class="form-grid">
            <div class="form-group"><label>First Name</label><input id="u_fname" placeholder="Alice" required></div>
            <div class="form-group"><label>Last Name</label><input id="u_lname" placeholder="Smith" required></div>
            <div class="form-group"><label>Email</label><input id="u_email" type="email" placeholder="alice@mail.com" required></div>
            <div class="form-group"><label>Password</label><input id="u_pass" type="password" placeholder="••••••••" required></div>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Save User</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('addUserModal')">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- EDIT USER MODAL -->
    <div class="modal-overlay" id="editUserModal">
      <div class="modal">
        <div class="modal-header">
          <h3>✏️ Edit User</h3>
          <button class="modal-close" onclick="closeModal('editUserModal')">✕</button>
        </div>
        <form id="editUserForm">
          <input type="hidden" id="edit_u_id">
          <div class="form-grid">
            <div class="form-group"><label>First Name</label><input id="edit_u_fname" required></div>
            <div class="form-group"><label>Last Name</label><input id="edit_u_lname" required></div>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Update</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('editUserModal')">Cancel</button>
          </div>
        </form>
      </div>
    </div>`;

  await loadUsers();

  document.getElementById('addUserForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/add_user', {
        f_name: document.getElementById('u_fname').value,
        l_name: document.getElementById('u_lname').value,
        email:  document.getElementById('u_email').value,
        password: document.getElementById('u_pass').value
      });
      toast('User added!', 'success');
      closeModal('addUserModal');
      await loadUsers();
    } catch(err) { toast(err.message, 'error'); }
  };

  document.getElementById('editUserForm').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit_u_id').value;
    try {
      await api.put(`/update_user/${id}`, {
        f_name: document.getElementById('edit_u_fname').value,
        l_name: document.getElementById('edit_u_lname').value
      });
      toast('User updated!', 'success');
      closeModal('editUserModal');
      await loadUsers();
    } catch(err) { toast(err.message, 'error'); }
  };
}

async function loadUsers() {
  const tbody = document.getElementById('usersTable');
  if (!tbody) return;
  try {
    const users = await api.get('/users');
    if (!users.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No users found. Add one!</td></tr>`; return; }
    tbody.innerHTML = users.map(u => `
      <tr>
        <td><span class="tag tag-purple">#${u.USER_ID}</span></td>
        <td>${u.F_NAME}</td>
        <td>${u.L_NAME}</td>
        <td class="text-muted">${u.EMAIL_ID}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openEditUser(${u.USER_ID},'${u.F_NAME}','${u.L_NAME}')">✏️ Edit</button>
          <button class="btn btn-danger btn-sm"    onclick="deleteUser(${u.USER_ID})">🗑 Delete</button>
        </td>
      </tr>`).join('');
  } catch(err) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Error: ${err.message}</td></tr>`; }
}

function openEditUser(id, fname, lname) {
  document.getElementById('edit_u_id').value    = id;
  document.getElementById('edit_u_fname').value = fname;
  document.getElementById('edit_u_lname').value = lname;
  openModal('editUserModal');
}

async function deleteUser(id) {
  if (!confirm('Delete this user? This cannot be undone.')) return;
  try {
    await api.delete(`/delete_user/${id}`);
    toast('User deleted.', 'success');
    await loadUsers();
  } catch(err) { toast(err.message, 'error'); }
}


// =====================================================================
//  INSTRUMENTS MODULE
// =====================================================================
async function renderInstruments() {
  document.getElementById('content').innerHTML = `
    <p class="page-title">🎸 Instruments</p>
    <p class="page-subtitle">Manage instruments available in the system</p>

    <div class="panel">
      <div class="panel-header">
        <h3>All Instruments</h3>
        <button class="btn btn-primary" onclick="openModal('addInstrModal')">＋ Add Instrument</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Type</th></tr></thead>
          <tbody id="instrTable">${loadingHTML()}</tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>🔗 Assign Instrument to User</h3></div>
      <div class="form-grid">
        <div class="form-group"><label>User ID</label><input id="ai_user_id" type="number" placeholder="e.g. 1"></div>
        <div class="form-group"><label>Instrument</label><select id="ai_instr_id"><option value="">— pick —</option></select></div>
      </div>
      <div class="form-actions" style="margin-top:14px">
        <button class="btn btn-primary" onclick="assignInstrument()">Assign</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>🔍 Instruments for User</h3></div>
      <div class="form-grid">
        <div class="form-group"><label>User ID</label><input id="view_ui_id" type="number" placeholder="e.g. 1"></div>
      </div>
      <div class="form-actions" style="margin-top:14px">
        <button class="btn btn-secondary" onclick="loadUserInstruments()">View</button>
      </div>
      <div id="userInstrResult" style="margin-top:18px"></div>
    </div>

    <!-- ADD INSTRUMENT MODAL -->
    <div class="modal-overlay" id="addInstrModal">
      <div class="modal">
        <div class="modal-header">
          <h3>➕ Add Instrument</h3>
          <button class="modal-close" onclick="closeModal('addInstrModal')">✕</button>
        </div>
        <form id="addInstrForm">
          <div class="form-grid">
            <div class="form-group"><label>Name</label><input id="i_name" placeholder="Guitar" required></div>
            <div class="form-group"><label>Type</label><input id="i_type" placeholder="String" required></div>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('addInstrModal')">Cancel</button>
          </div>
        </form>
      </div>
    </div>`;

  await loadInstruments();

  document.getElementById('addInstrForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/add_instrument', {
        name: document.getElementById('i_name').value,
        type: document.getElementById('i_type').value
      });
      toast('Instrument added!', 'success');
      closeModal('addInstrModal');
      await loadInstruments();
    } catch(err) { toast(err.message, 'error'); }
  };
}

async function loadInstruments() {
  const tbody = document.getElementById('instrTable');
  if (!tbody) return;
  try {
    const list = await api.get('/instruments');
    const sel = document.getElementById('ai_instr_id');
    if (sel) sel.innerHTML = `<option value="">— pick —</option>` +
      list.map(i => `<option value="${i.INSTRUMENT_ID}">${i.INSTRUMENT_NAME}</option>`).join('');
    if (!list.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="3">No instruments yet.</td></tr>`; return; }
    tbody.innerHTML = list.map(i => `
      <tr>
        <td><span class="tag tag-purple">#${i.INSTRUMENT_ID}</span></td>
        <td>${i.INSTRUMENT_NAME}</td>
        <td><span class="tag tag-yellow">${i.INSTRUMENT_TYPE}</span></td>
      </tr>`).join('');
  } catch(err) { tbody.innerHTML = `<tr class="empty-row"><td colspan="3">${err.message}</td></tr>`; }
}

async function assignInstrument() {
  const uid = document.getElementById('ai_user_id').value;
  const iid = document.getElementById('ai_instr_id').value;
  if (!uid || !iid) { toast('Fill both fields.', 'error'); return; }
  try {
    await api.post('/assign_instrument', { user_id: +uid, instrument_id: +iid });
    toast('Instrument assigned!', 'success');
  } catch(err) { toast(err.message, 'error'); }
}

async function loadUserInstruments() {
  const id = document.getElementById('view_ui_id').value;
  const result = document.getElementById('userInstrResult');
  if (!id) { toast('Enter a User ID.', 'error'); return; }
  result.innerHTML = loadingHTML();
  try {
    const list = await api.get(`/user/${id}/instruments`);
    if (!list.length) { result.innerHTML = `<p class="text-muted">No instruments for user ${id}.</p>`; return; }
    result.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Name</th><th>Type</th></tr></thead>
      <tbody>${list.map(i => `<tr><td>${i.INSTRUMENT_ID}</td><td>${i.INSTRUMENT_NAME}</td><td>${i.INSTRUMENT_TYPE}</td></tr>`).join('')}</tbody>
    </table></div>`;
  } catch(err) { result.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}


// =====================================================================
//  COURSE MODULES MODULE
// =====================================================================
async function renderModules() {
  document.getElementById('content').innerHTML = `
    <p class="page-title">📘 Course Modules</p>
    <p class="page-subtitle">Structured lessons linked to instruments and music</p>
    <div class="panel">
      <div class="panel-header">
        <h3>All Modules</h3>
        <button class="btn btn-primary" onclick="openModal('addModModal')">＋ Add Module</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Title</th><th>Level</th><th>Instrument</th><th>Concepts</th></tr></thead>
          <tbody id="modTable">${loadingHTML()}</tbody>
        </table>
      </div>
    </div>

    <!-- ADD MODULE MODAL -->
    <div class="modal-overlay" id="addModModal">
      <div class="modal">
        <div class="modal-header">
          <h3>➕ Add Module</h3>
          <button class="modal-close" onclick="closeModal('addModModal')">✕</button>
        </div>
        <form id="addModForm">
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1"><label>Title</label><input id="m_title" placeholder="Basic Guitar Theory" required></div>
            <div class="form-group" style="grid-column:1/-1"><label>Description</label><textarea id="m_desc" placeholder="Brief description…"></textarea></div>
            <div class="form-group">
              <label>Level</label>
              <select id="m_level">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div class="form-group"><label>Instrument</label><select id="m_instr_id"><option value="">Loading…</option></select></div>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('addModModal')">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CONCEPTS PER MODULE MODAL -->
    <div class="modal-overlay" id="modConceptsModal">
      <div class="modal" style="max-width:560px">
        <div class="modal-header">
          <h3>🧠 Linked Concepts</h3>
          <button class="modal-close" onclick="closeModal('modConceptsModal')">✕</button>
        </div>
        <div id="modConceptsList">${loadingHTML()}</div>
      </div>
    </div>`;

  await loadModules();

  try {
    const instruments = await api.get('/instruments');
    const sel = document.getElementById('m_instr_id');
    if (sel) sel.innerHTML = instruments.map(i => `<option value="${i.INSTRUMENT_ID}">${i.INSTRUMENT_NAME}</option>`).join('');
  } catch(e) {}

  document.getElementById('addModForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/add_module', {
        title: document.getElementById('m_title').value,
        description: document.getElementById('m_desc').value,
        level: document.getElementById('m_level').value,
        instrument_id: +document.getElementById('m_instr_id').value
      });
      toast('Module added!', 'success');
      closeModal('addModModal');
      await loadModules();
    } catch(err) { toast(err.message, 'error'); }
  };
}

async function loadModules() {
  const tbody = document.getElementById('modTable');
  if (!tbody) return;
  try {
    const mods = await api.get('/modules');
    if (!mods.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No modules yet.</td></tr>`; return; }
    tbody.innerHTML = mods.map(m => `
      <tr>
        <td><span class="tag tag-purple">#${m.MODULE_ID}</span></td>
        <td><strong>${m.TITLE}</strong></td>
        <td>${levelTag(m.LEVEL)}</td>
        <td>${m.INSTRUMENT_NAME || m.INSTRUMENT_ID}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="viewModConcepts(${m.MODULE_ID})">🧠 View</button></td>
      </tr>`).join('');
  } catch(err) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5">${err.message}</td></tr>`; }
}

async function viewModConcepts(id) {
  openModal('modConceptsModal');
  document.getElementById('modConceptsList').innerHTML = loadingHTML();
  try {
    const list = await api.get(`/module/${id}/concepts`);
    if (!list.length) { document.getElementById('modConceptsList').innerHTML = `<p class="text-muted">No concepts linked to this module.</p>`; return; }
    document.getElementById('modConceptsList').innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Name</th><th>Difficulty</th></tr></thead>
      <tbody>${list.map(c => `<tr><td>${c.CONCEPT_ID}</td><td>${c.NAME}</td><td>${difficultyTag(c.DIFFICULTY)}</td></tr>`).join('')}</tbody>
    </table></div>`;
  } catch(err) { document.getElementById('modConceptsList').innerHTML = `<p class="text-muted">${err.message}</p>`; }
}


// =====================================================================
//  THEORY CONCEPTS MODULE
// =====================================================================
async function renderConcepts() {
  document.getElementById('content').innerHTML = `
    <p class="page-title">🧠 Theory Concepts</p>
    <p class="page-subtitle">Music theory topics with difficulty levels</p>
    <div class="panel">
      <div class="panel-header">
        <h3>All Concepts</h3>
        <button class="btn btn-primary" onclick="openModal('addConceptModal')">＋ Add Concept</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Difficulty</th><th>Description</th></tr></thead>
          <tbody id="conceptTable">${loadingHTML()}</tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>🔗 Link Concept to Module</h3></div>
      <div class="form-grid">
        <div class="form-group"><label>Module</label><select id="lnk_mod_id"><option value="">Loading…</option></select></div>
        <div class="form-group"><label>Concept</label><select id="lnk_concept_id"><option value="">Loading…</option></select></div>
      </div>
      <div class="form-actions" style="margin-top:14px">
        <button class="btn btn-primary" onclick="linkModConcept()">Link</button>
      </div>
    </div>

    <!-- ADD CONCEPT MODAL -->
    <div class="modal-overlay" id="addConceptModal">
      <div class="modal">
        <div class="modal-header">
          <h3>➕ Add Concept</h3>
          <button class="modal-close" onclick="closeModal('addConceptModal')">✕</button>
        </div>
        <form id="addConceptForm">
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1"><label>Name</label><input id="c_name" placeholder="Chords" required></div>
            <div class="form-group">
              <label>Difficulty</label>
              <select id="c_diff">
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div class="form-group" style="grid-column:1/-1">
              <label>Description</label>
              <textarea id="c_desc" placeholder="Brief description…"></textarea>
            </div>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('addConceptModal')">Cancel</button>
          </div>
        </form>
      </div>
    </div>`;

  await loadConcepts();

  try {
    const [mods, concepts] = await Promise.all([api.get('/modules'), api.get('/concepts')]);
    document.getElementById('lnk_mod_id').innerHTML = mods.map(m => `<option value="${m.MODULE_ID}">${m.TITLE}</option>`).join('');
    document.getElementById('lnk_concept_id').innerHTML = concepts.map(c => `<option value="${c.CONCEPT_ID}">${c.NAME}</option>`).join('');
  } catch(e) {}

  document.getElementById('addConceptForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/add_concept', {
        name:        document.getElementById('c_name').value,
        difficulty:  document.getElementById('c_diff').value,
        description: document.getElementById('c_desc').value
      });
      toast('Concept added!', 'success');
      closeModal('addConceptModal');
      await loadConcepts();
    } catch(err) { toast(err.message, 'error'); }
  };
}

async function loadConcepts() {
  const tbody = document.getElementById('conceptTable');
  if (!tbody) return;
  try {
    const list = await api.get('/concepts');
    if (!list.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No concepts yet.</td></tr>`; return; }
    tbody.innerHTML = list.map(c => `
      <tr>
        <td><span class="tag tag-purple">#${c.CONCEPT_ID}</span></td>
        <td>${c.NAME}</td>
        <td>${difficultyTag(c.DIFFICULTY)}</td>
        <td class="text-muted">${c.DESCRIPTION || '—'}</td>
      </tr>`).join('');
  } catch(err) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${err.message}</td></tr>`; }
}

async function linkModConcept() {
  const mid = document.getElementById('lnk_mod_id').value;
  const cid = document.getElementById('lnk_concept_id').value;
  if (!mid || !cid) { toast('Select both.', 'error'); return; }
  try {
    await api.post('/link_module_concept', { module_id: +mid, concept_id: +cid });
    toast('Linked successfully!', 'success');
  } catch(err) { toast(err.message, 'error'); }
}


// =====================================================================
//  EXERCISES MODULE
// =====================================================================
async function renderExercises() {
  document.getElementById('content').innerHTML = `
    <p class="page-title">📝 Exercises</p>
    <p class="page-subtitle">Practice questions linked to course modules</p>
    <div class="panel">
      <div class="panel-header">
        <h3>All Exercises</h3>
        <button class="btn btn-primary" onclick="openModal('addExModal')">＋ Add Exercise</button>
      </div>
      <div class="panel-header" style="margin-bottom:10px">
        <div class="form-group" style="min-width:220px">
          <label>Filter by Module</label>
          <select id="ex_filter_mod" onchange="filterExercises()">
            <option value="">— All Modules —</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Question</th><th>Answer</th><th>Module</th></tr></thead>
          <tbody id="exTable">${loadingHTML()}</tbody>
        </table>
      </div>
    </div>

    <!-- ADD EXERCISE MODAL -->
    <div class="modal-overlay" id="addExModal">
      <div class="modal">
        <div class="modal-header">
          <h3>➕ Add Exercise</h3>
          <button class="modal-close" onclick="closeModal('addExModal')">✕</button>
        </div>
        <form id="addExForm">
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1"><label>Question</label><textarea id="ex_q" placeholder="What is a chord?" required></textarea></div>
            <div class="form-group" style="grid-column:1/-1"><label>Correct Answer</label><input id="ex_a" placeholder="Combination of notes" required></div>
            <div class="form-group"><label>Module</label><select id="ex_module_id"><option value="">Loading…</option></select></div>
          </div>
          <div class="form-actions" style="margin-top:16px">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-secondary" onclick="closeModal('addExModal')">Cancel</button>
          </div>
        </form>
      </div>
    </div>`;

  await loadExercises();

  try {
    const mods = await api.get('/modules');
    const opts = mods.map(m => `<option value="${m.MODULE_ID}">${m.TITLE}</option>`).join('');
    document.getElementById('ex_module_id').innerHTML = opts;
    document.getElementById('ex_filter_mod').innerHTML = `<option value="">— All Modules —</option>` + opts;
  } catch(e) {}

  document.getElementById('addExForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/add_exercise', {
        question:  document.getElementById('ex_q').value,
        answer:    document.getElementById('ex_a').value,
        module_id: +document.getElementById('ex_module_id').value
      });
      toast('Exercise added!', 'success');
      closeModal('addExModal');
      await loadExercises();
    } catch(err) { toast(err.message, 'error'); }
  };
}

async function loadExercises() {
  const tbody = document.getElementById('exTable');
  if (!tbody) return;
  try {
    const list = await api.get('/exercises');
    renderExTable(list);
  } catch(err) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${err.message}</td></tr>`; }
}

async function filterExercises() {
  const id = document.getElementById('ex_filter_mod').value;
  if (!id) { loadExercises(); return; }
  const tbody = document.getElementById('exTable');
  tbody.innerHTML = loadingHTML();
  try {
    const list = await api.get(`/exercises/module/${id}`);
    renderExTable(list);
  } catch(err) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">${err.message}</td></tr>`; }
}

function renderExTable(list) {
  const tbody = document.getElementById('exTable');
  if (!list.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No exercises found.</td></tr>`; return; }
  tbody.innerHTML = list.map(e => `
    <tr>
      <td><span class="tag tag-purple">#${e.EXERCISE_ID}</span></td>
      <td>${e.QUESTION}</td>
      <td><span class="text-accent">${e.CORRECT_ANSWER}</span></td>
      <td><span class="tag tag-yellow">${e.MODULE_TITLE || e.MODULE_ID}</span></td>
    </tr>`).join('');
}


// =====================================================================
//  PROGRESS MODULE
// =====================================================================
async function renderProgress() {
  document.getElementById('content').innerHTML = `
    <p class="page-title">📊 Progress Tracker</p>
    <p class="page-subtitle">Track user learning progress per course module</p>
    <div class="panel">
      <div class="panel-header"><h3>➕ Log Progress Entry</h3></div>
      <form id="addProgressForm">
        <div class="form-grid">
          <div class="form-group"><label>User ID</label><input id="p_uid" type="number" placeholder="1" required></div>
          <div class="form-group"><label>Module</label><select id="p_mod_id"><option value="">Loading…</option></select></div>
          <div class="form-group"><label>Score (0–100)</label><input id="p_score" type="number" min="0" max="100" placeholder="85" required></div>
          <div class="form-group"><label>Progress %</label><input id="p_pct" type="number" min="0" max="100" placeholder="60" required></div>
          <div class="form-group">
            <label>Status</label>
            <select id="p_status">
              <option value="NOT STARTED">Not Started</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        <div class="form-actions" style="margin-top:14px">
          <button type="submit" class="btn btn-primary">Log Progress</button>
        </div>
      </form>
    </div>

    <div class="panel">
      <div class="panel-header"><h3>🔍 View Progress for User</h3></div>
      <div class="form-grid">
        <div class="form-group"><label>User ID</label><input id="view_p_uid" type="number" placeholder="1"></div>
      </div>
      <div class="form-actions" style="margin-top:14px">
        <button class="btn btn-secondary" onclick="loadProgress()">View Progress</button>
      </div>
      <div id="progressResult" style="margin-top:20px"></div>
    </div>`;

  try {
    const mods = await api.get('/modules');
    document.getElementById('p_mod_id').innerHTML = mods.map(m => `<option value="${m.MODULE_ID}">${m.TITLE}</option>`).join('');
  } catch(e) {}

  document.getElementById('addProgressForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/add_progress', {
        user_id:             +document.getElementById('p_uid').value,
        module_id:           +document.getElementById('p_mod_id').value,
        score:               +document.getElementById('p_score').value,
        progress_percentage: +document.getElementById('p_pct').value,
        status:               document.getElementById('p_status').value
      });
      toast('Progress logged!', 'success');
      document.getElementById('addProgressForm').reset();
    } catch(err) { toast(err.message, 'error'); }
  };
}

async function loadProgress() {
  const id = document.getElementById('view_p_uid').value;
  const result = document.getElementById('progressResult');
  if (!id) { toast('Enter a User ID.', 'error'); return; }
  result.innerHTML = loadingHTML();
  try {
    const list = await api.get(`/progress/${id}`);
    if (!list.length) { result.innerHTML = `<p class="text-muted">No progress records for user ${id}.</p>`; return; }
    result.innerHTML = `<div class="table-wrap"><table>
      <thead><tr><th>Progress ID</th><th>Module</th><th>Score</th><th>Progress</th><th>Status</th></tr></thead>
      <tbody>${list.map(r => `
        <tr>
          <td><span class="tag tag-purple">#${r.PROGRESS_ID}</span></td>
          <td>${r.MODULE_TITLE || r.MODULE_ID}</td>
          <td><strong>${r.SCORE ?? '—'}</strong></td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${r.PROGRESS_PERCENTAGE||0}%"></div></div>
              <span>${r.PROGRESS_PERCENTAGE||0}%</span>
            </div>
          </td>
          <td>${statusTag(r.COMPLETION_STATUS||'NOT STARTED')}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
  } catch(err) { result.innerHTML = `<p class="text-muted">${err.message}</p>`; }
}


// =====================================================================
//  DASHBOARD
// =====================================================================
async function renderDashboard() {
  document.getElementById('content').innerHTML = `
    <p class="page-title">🎵 Dashboard</p>
    <p class="page-subtitle">Overview of your Music Theory Learning System</p>
    <div class="stats-grid">
      ${[
        { key:'users',       icon:'👤', label:'Users' },
        { key:'instruments', icon:'🎸', label:'Instruments' },
        { key:'modules',     icon:'📘', label:'Modules' },
        { key:'concepts',    icon:'🧠', label:'Concepts' },
        { key:'exercises',   icon:'📝', label:'Exercises' }
      ].map(s => `<div class="stat-card" id="stat_${s.key}">
        <div class="s-icon">${s.icon}</div>
        <div class="s-value">…</div>
        <div class="s-label">${s.label}</div>
      </div>`).join('')}
    </div>

    <div class="panel">
      <div class="panel-header"><h3>🚀 Quick Actions</h3></div>
      <div class="quick-actions">
        <button class="btn btn-primary"   onclick="navigate('users')">👤 Users</button>
        <button class="btn btn-secondary" onclick="navigate('instruments')">🎸 Instruments</button>
        <button class="btn btn-secondary" onclick="navigate('modules')">📘 Modules</button>
        <button class="btn btn-secondary" onclick="navigate('concepts')">🧠 Concepts</button>
        <button class="btn btn-secondary" onclick="navigate('exercises')">📝 Exercises</button>
        <button class="btn btn-secondary" onclick="navigate('progress')">📊 Progress</button>
      </div>
    </div>`;

  const endpoints = { users:'/users', instruments:'/instruments', modules:'/modules', concepts:'/concepts', exercises:'/exercises' };
  for (const [key, path] of Object.entries(endpoints)) {
    try {
      const data = await api.get(path);
      const el = document.querySelector(`#stat_${key} .s-value`);
      if (el) el.textContent = data.length;
    } catch {
      const el = document.querySelector(`#stat_${key} .s-value`);
      if (el) el.textContent = '—';
    }
  }
}


// =====================================================================
//  ROUTER
// =====================================================================
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  const titles = {
    dashboard:'🏠 Dashboard', users:'👤 Users', instruments:'🎸 Instruments',
    modules:'📘 Modules', concepts:'🧠 Concepts', exercises:'📝 Exercises', progress:'📊 Progress'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;

  const pages = {
    dashboard: renderDashboard, users: renderUsers, instruments: renderInstruments,
    modules: renderModules, concepts: renderConcepts, exercises: renderExercises, progress: renderProgress
  };
  if (pages[page]) pages[page]();
}

let currentPage = 'dashboard';
window.addEventListener('DOMContentLoaded', () => {
  checkApiHealth();
  navigate('dashboard');
});
