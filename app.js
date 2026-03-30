const API_BASE = 'https://script.google.com/macros/s/AKfycbyJrzcWmHTWTXPVxjrs20zQBTGNvZgouxGfQl7HNP0ViDSlV7W3WE54m7yEUSUxQUyFBA/exec';
const DEFAULT_LOCATION = 'Redeemer Church';
const DEFAULT_DESCRIPTION = 'Voluteering opportunity at Redeemer Church 1-4th grade Sunday school service/Wednesday night middle school assistant small group leader, Chicago missions hamburger fundraiser';
const CANVAS_SETTINGS_KEY = 'manage-my-life-canvas-settings';
const CANVAS_ASSIGNMENTS_KEY = 'manage-my-life-canvas-assignments';

const hourButtons = Array.from(document.querySelectorAll('.hour-chip'));
const activityButtons = Array.from(document.querySelectorAll('.activity-chip'));
const dashboardTiles = Array.from(document.querySelectorAll('.dashboard-tile'));

const els = {
  appCard: document.getElementById('appCard'),
  monthTotal: document.getElementById('monthTotal'),
  monthLabel: document.getElementById('monthLabel'),
  overallTotal: document.getElementById('overallTotal'),
  dashboardMonthTotal: document.getElementById('dashboardMonthTotal'),
  dashboardOverallTotal: document.getElementById('dashboardOverallTotal'),
  location: document.getElementById('location'),
  organization: document.getElementById('organization'),
  description: document.getElementById('description'),
  date: document.getElementById('date'),
  hours: document.getElementById('hours'),
  activity: document.getElementById('activity'),
  entries: document.getElementById('entries'),
  errorBox: document.getElementById('errorBox'),
  statusBox: document.getElementById('statusBox'),
  workingDocLink: document.getElementById('workingDocLink'),
  redeemerBtn: document.getElementById('redeemerBtn'),
  saveProfileBtn: document.getElementById('saveProfileBtn'),
  saveEntryBtn: document.getElementById('saveEntryBtn'),
  resetBtn: document.getElementById('resetBtn'),
  minusBtn: document.getElementById('minusBtn'),
  plusBtn: document.getElementById('plusBtn'),
  canvasBaseUrl: document.getElementById('canvasBaseUrl'),
  canvasToken: document.getElementById('canvasToken'),
  saveCanvasSettingsBtn: document.getElementById('saveCanvasSettingsBtn'),
  syncCanvasBtn: document.getElementById('syncCanvasBtn'),
  schoolErrorBox: document.getElementById('schoolErrorBox'),
  schoolStatusBox: document.getElementById('schoolStatusBox'),
  canvasAssignments: document.getElementById('canvasAssignments'),
  canvasAssignmentCount: document.getElementById('canvasAssignmentCount'),
  canvasClassCount: document.getElementById('canvasClassCount'),
  schoolSection: document.getElementById('schoolSection')
};

const canvasState = {
  settings: loadCanvasSettings(),
  assignments: loadCanvasAssignments()
};

function init() {
  wireButtons();
  fillCanvasSettings();
  renderCanvasAssignments();
  els.date.value = todayValue();
  setHours(1);
  setActivity('Sunday school service');
  fetchState();
}

function wireButtons() {
  hourButtons.forEach((button) => {
    button.addEventListener('click', () => setHours(button.getAttribute('data-hours')));
  });

  activityButtons.forEach((button) => {
    button.addEventListener('click', () => setActivity(button.getAttribute('data-activity')));
  });

  dashboardTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const targetId = tile.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  els.minusBtn.addEventListener('click', () => adjustHours(-0.5));
  els.plusBtn.addEventListener('click', () => adjustHours(0.5));
  els.saveProfileBtn.addEventListener('click', saveProfile);
  els.saveEntryBtn.addEventListener('click', addEntry);
  els.resetBtn.addEventListener('click', resetEntry);
  els.redeemerBtn.addEventListener('click', () => {
    applyRedeemer();
    saveProfile();
  });
  els.saveCanvasSettingsBtn.addEventListener('click', saveCanvasSettings);
  els.syncCanvasBtn.addEventListener('click', syncCanvasAssignments);
}

function fetchState() {
  setLoading(true);
  showStatus('Loading...');
  apiRequest('state').then((state) => {
    render(state);
    showStatus('');
  }).catch(showError);
}

function saveProfile() {
  setLoading(true);
  showStatus('Saving project info...');
  apiRequest('saveProfile', {
    location: els.location.value,
    organization: els.organization.value,
    description: els.description.value
  }).then((state) => {
    render(state);
    showStatus('Project info saved.');
  }).catch(showError);
}

function addEntry() {
  const payload = {
    date: els.date.value,
    hours: Number(els.hours.value),
    activity: els.activity.value
  };

  if (!payload.date || !payload.hours || !payload.activity) {
    showError('Pick a date, hours, and activity first.');
    return;
  }

  setLoading(true);
  showStatus('Saving hours...');
  apiRequest('addEntry', payload).then((state) => {
    render(state);
    els.date.value = todayValue();
    setHours(1);
    showStatus('Saved ' + formatShortDate(payload.date) + ' for ' + formatHours(payload.hours) + ' hours.');
  }).catch(showError);
}

function deleteEntry(entryId) {
  setLoading(true);
  showStatus('Deleting entry...');
  apiRequest('deleteEntry', { entryId: entryId }).then((state) => {
    render(state);
    showStatus('Entry deleted.');
  }).catch(showError);
}

function render(state) {
  clearMessages();
  const monthTotal = formatHours(state.monthTotal || 0) + ' hrs';
  const overallTotal = formatHours(state.overallTotal || 0) + ' hrs';
  els.monthTotal.textContent = monthTotal;
  els.monthLabel.textContent = state.monthLabel || '';
  els.overallTotal.textContent = overallTotal;
  els.dashboardMonthTotal.textContent = monthTotal;
  els.dashboardOverallTotal.textContent = overallTotal;
  els.location.value = state.profile && state.profile.location ? state.profile.location : DEFAULT_LOCATION;
  els.organization.value = state.profile && state.profile.organization ? state.profile.organization : DEFAULT_LOCATION;
  els.description.value = state.profile && state.profile.description ? state.profile.description : DEFAULT_DESCRIPTION;
  els.workingDocLink.href = state.workingDocUrl || '#';
  renderEntries(state.entries || []);
  if (!els.activity.value) {
    setActivity('Sunday school service');
  }
}

function renderEntries(entries) {
  els.entries.innerHTML = '';
  if (!entries.length) {
    els.entries.innerHTML = '<div class="entry"><div class="entry-top"><strong>No entries yet</strong><span class="mini">Add your first one above.</span></div></div>';
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('div');
    card.className = 'entry';
    card.innerHTML = '<div class="entry-top"><strong>' + escapeHtml(entry.activity) + '</strong><span class="mini">' + formatShortDate(entry.date) + ' • ' + formatHours(entry.hours) + ' hrs</span></div>';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn ghost';
    button.textContent = 'Delete';
    button.addEventListener('click', () => deleteEntry(entry.id));
    card.appendChild(button);
    els.entries.appendChild(card);
  });
}

function fillCanvasSettings() {
  els.canvasBaseUrl.value = canvasState.settings.baseUrl || '';
  els.canvasToken.value = canvasState.settings.token || '';
}

function saveCanvasSettings() {
  const baseUrl = sanitizeCanvasBaseUrl(els.canvasBaseUrl.value);
  const token = String(els.canvasToken.value || '').trim();

  if (!baseUrl || !token) {
    showSchoolError('Add both your Canvas base URL and token first.');
    return;
  }

  canvasState.settings = { baseUrl: baseUrl, token: token };
  localStorage.setItem(CANVAS_SETTINGS_KEY, JSON.stringify(canvasState.settings));
  showSchoolStatus('Canvas settings saved on this device.');
}

async function syncCanvasAssignments() {
  const baseUrl = sanitizeCanvasBaseUrl(els.canvasBaseUrl.value);
  const token = String(els.canvasToken.value || '').trim();

  if (!baseUrl || !token) {
    showSchoolError('Add both your Canvas base URL and token first.');
    return;
  }

  canvasState.settings = { baseUrl: baseUrl, token: token };
  localStorage.setItem(CANVAS_SETTINGS_KEY, JSON.stringify(canvasState.settings));

  showSchoolStatus('Syncing Canvas assignments...');
  setSchoolLoading(true);

  try {
    const result = await apiRequest('syncCanvas', {
      baseUrl: baseUrl,
      token: token
    });
    canvasState.assignments = Array.isArray(result.assignments) ? result.assignments : [];
    localStorage.setItem(CANVAS_ASSIGNMENTS_KEY, JSON.stringify(canvasState.assignments));
    renderCanvasAssignments();
    showSchoolStatus('Canvas assignments synced.');
  } catch (error) {
    showSchoolError(error && error.message ? error.message : String(error));
  } finally {
    setSchoolLoading(false);
  }
}

function renderCanvasAssignments() {
  const assignments = Array.isArray(canvasState.assignments) ? canvasState.assignments : [];
  const courseNames = new Set(assignments.map((item) => item.courseName).filter(Boolean));
  els.canvasAssignmentCount.textContent = assignments.length + (assignments.length === 1 ? ' assignment' : ' assignments');
  els.canvasClassCount.textContent = courseNames.size + (courseNames.size === 1 ? ' class' : ' classes');
  els.canvasAssignments.innerHTML = '';

  if (!assignments.length) {
    els.canvasAssignments.innerHTML = '<div class="entry assignment-card"><div class="entry-top"><strong>No Canvas assignments synced yet</strong><span class="mini">Save your Canvas settings and tap sync.</span></div></div>';
    return;
  }

  assignments.forEach((assignment) => {
    const card = document.createElement('div');
    card.className = 'entry assignment-card';
    let linkHtml = '';
    if (assignment.htmlUrl) {
      linkHtml = '<a class="btn ghost" href="' + escapeHtml(assignment.htmlUrl) + '" target="_blank" rel="noopener noreferrer">Open in Canvas</a>';
    }
    card.innerHTML = '<div class="assignment-row"><strong>' + escapeHtml(assignment.name) + '</strong><span class="assignment-meta">' + escapeHtml(assignment.courseName) + '</span><span class="assignment-meta">Due ' + escapeHtml(formatDueDate(assignment.dueAt)) + (assignment.pointsPossible != null ? ' • ' + escapeHtml(String(assignment.pointsPossible)) + ' pts' : '') + '</span></div>' + linkHtml;
    els.canvasAssignments.appendChild(card);
  });
}

function loadCanvasSettings() {
  try {
    return JSON.parse(localStorage.getItem(CANVAS_SETTINGS_KEY) || 'null') || { baseUrl: '', token: '' };
  } catch (error) {
    return { baseUrl: '', token: '' };
  }
}

function loadCanvasAssignments() {
  try {
    return JSON.parse(localStorage.getItem(CANVAS_ASSIGNMENTS_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function sanitizeCanvasBaseUrl(value) {
  const text = String(value || '').trim().replace(/\/$/, '');
  if (!text) {
    return '';
  }
  if (/^https:\/\//i.test(text)) {
    return text;
  }
  return 'https://' + text;
}

function showSchoolError(message) {
  setSchoolLoading(false);
  els.schoolStatusBox.style.display = 'none';
  els.schoolStatusBox.textContent = '';
  els.schoolErrorBox.textContent = message;
  els.schoolErrorBox.style.display = 'block';
}

function showSchoolStatus(message) {
  if (!message) {
    els.schoolStatusBox.style.display = 'none';
    els.schoolStatusBox.textContent = '';
    setSchoolLoading(false);
    return;
  }
  els.schoolErrorBox.style.display = 'none';
  els.schoolErrorBox.textContent = '';
  els.schoolStatusBox.textContent = message;
  els.schoolStatusBox.style.display = 'block';
}

function setSchoolLoading(on) {
  els.schoolSection.classList.toggle('loading', !!on);
}

function apiRequest(action, params) {
  const callbackName = '__dsgCallback_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
  const query = new URLSearchParams({ action: action, callback: callbackName });
  const extra = params || {};
  Object.keys(extra).forEach((key) => query.set(key, extra[key]));

  return new Promise((resolve, reject) => {
    let script = null;

    const cleanup = () => {
      delete window[callbackName];
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    window[callbackName] = (response) => {
      cleanup();
      if (!response || !response.ok) {
        reject((response && response.data && response.data.message) ? response.data.message : 'Request failed.');
        return;
      }
      resolve(response.data);
    };

    script = document.createElement('script');
    script.src = API_BASE + '?' + query.toString();
    script.onerror = () => {
      cleanup();
      reject('Could not reach the Google backend.');
    };
    document.body.appendChild(script);
  });
}

function applyRedeemer() {
  els.location.value = DEFAULT_LOCATION;
  els.organization.value = DEFAULT_LOCATION;
  els.description.value = DEFAULT_DESCRIPTION;
}

function resetEntry() {
  els.date.value = todayValue();
  setHours(1);
  setActivity('Sunday school service');
}

function setHours(value) {
  const rounded = Math.round(Number(value) * 2) / 2;
  els.hours.value = formatHours(rounded);
  hourButtons.forEach((button) => {
    button.classList.toggle('active', Number(button.getAttribute('data-hours')) === rounded);
  });
}

function adjustHours(delta) {
  setHours(Math.max(0, Number(els.hours.value || 0) + delta));
}

function setActivity(value) {
  els.activity.value = value;
  activityButtons.forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-activity') === value);
  });
}

function todayValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function formatHours(value) {
  return Number(value).toFixed(2).replace(/\.00$/, '.0').replace(/(\.\d)0$/, '$1');
}

function formatShortDate(iso) {
  const date = new Date(iso + 'T00:00:00');
  return (date.getMonth() + 1) + '/' + date.getDate();
}

function formatDueDate(iso) {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setLoading(on) {
  els.appCard.classList.toggle('loading', !!on);
}

function clearMessages() {
  els.errorBox.style.display = 'none';
  els.errorBox.textContent = '';
  els.statusBox.style.display = 'none';
  els.statusBox.textContent = '';
  setLoading(false);
}

function showError(message) {
  setLoading(false);
  els.statusBox.style.display = 'none';
  els.statusBox.textContent = '';
  els.errorBox.textContent = message;
  els.errorBox.style.display = 'block';
}

function showStatus(message) {
  if (!message) {
    els.statusBox.style.display = 'none';
    els.statusBox.textContent = '';
    setLoading(false);
    return;
  }
  els.errorBox.style.display = 'none';
  els.errorBox.textContent = '';
  els.statusBox.textContent = message;
  els.statusBox.style.display = 'block';
}

init();

