const API_BASE = 'https://script.google.com/macros/s/AKfycbwKhkZF8rZagzw4zBozhOrGJkHQCBZm_KzE7VAbaRGSN7Zvd7v9gfRdhjfIWVBZSxMe5w/exec';
const DEFAULT_LOCATION = 'Redeemer Church';
const DEFAULT_DESCRIPTION = 'Voluteering opportunity at Redeemer Church 1-4th grade Sunday school service/Wednesday night middle school assistant small group leader, Chicago missions hamburger fundraiser';

const hourButtons = Array.from(document.querySelectorAll('.hour-chip'));
const activityButtons = Array.from(document.querySelectorAll('.activity-chip'));

const els = {
  appCard: document.getElementById('appCard'),
  monthTotal: document.getElementById('monthTotal'),
  monthLabel: document.getElementById('monthLabel'),
  overallTotal: document.getElementById('overallTotal'),
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
  plusBtn: document.getElementById('plusBtn')
};

function init() {
  wireButtons();
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

  els.minusBtn.addEventListener('click', () => adjustHours(-0.5));
  els.plusBtn.addEventListener('click', () => adjustHours(0.5));
  els.saveProfileBtn.addEventListener('click', saveProfile);
  els.saveEntryBtn.addEventListener('click', addEntry);
  els.resetBtn.addEventListener('click', resetEntry);
  els.redeemerBtn.addEventListener('click', () => {
    applyRedeemer();
    saveProfile();
  });
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
  els.monthTotal.textContent = formatHours(state.monthTotal || 0) + ' hrs';
  els.monthLabel.textContent = state.monthLabel || '';
  els.overallTotal.textContent = formatHours(state.overallTotal || 0) + ' hrs';
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

function apiRequest(action, params) {
  const callbackName = '__dsgCallback_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
  const query = new URLSearchParams({ action: action, callback: callbackName });
  const extra = params || {};
  Object.keys(extra).forEach((key) => query.set(key, extra[key]));

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      delete window[callbackName];
      if (script.parentNode) {
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

    const script = document.createElement('script');
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

