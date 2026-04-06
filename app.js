const API_BASE = 'https://script.google.com/macros/s/AKfycbyJrzcWmHTWTXPVxjrs20zQBTGNvZgouxGfQl7HNP0ViDSlV7W3WE54m7yEUSUxQUyFBA/exec';
const DEFAULT_LOCATION = 'Redeemer Church';
const DEFAULT_DESCRIPTION = 'Voluteering opportunity at Redeemer Church 1-4th grade Sunday school service/Wednesday night middle school assistant small group leader, Chicago missions hamburger fundraiser';
const CANVAS_SETTINGS_KEY = 'manage-my-life-canvas-settings';
const CANVAS_ASSIGNMENTS_KEY = 'manage-my-life-canvas-assignments';
const EDGENUITY_SETTINGS_KEY = 'manage-my-life-edgenuity-settings';
const EDGENUITY_ASSIGNMENTS_KEY = 'manage-my-life-edgenuity-assignments';
const EDGENUITY_DEFAULT_API_BASE = 'https://r07.core.learn.edgenuity.com';
const GOOGLE_CALENDAR_EVENTS_KEY = 'manage-my-life-google-calendar-events';
const GOOGLE_CALENDAR_NAME_KEY = 'manage-my-life-google-calendar-name';

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
  canvasAssignmentCount: document.getElementById('canvasAssignmentCount'),
  canvasClassCount: document.getElementById('canvasClassCount'),
  canvasOverdueCount: document.getElementById('canvasOverdueCount'),
  canvasTodayCount: document.getElementById('canvasTodayCount'),
  canvasWeekCount: document.getElementById('canvasWeekCount'),
  canvasNextDue: document.getElementById('canvasNextDue'),
  canvasDueToday: document.getElementById('canvasDueToday'),
  canvasDueThisWeek: document.getElementById('canvasDueThisWeek'),
  canvasByClass: document.getElementById('canvasByClass'),
  edgenuityApiBaseUrl: document.getElementById('edgenuityApiBaseUrl'),
  edgenuityEnrollmentId: document.getElementById('edgenuityEnrollmentId'),
  edgenuityToken: document.getElementById('edgenuityToken'),
  saveEdgenuitySettingsBtn: document.getElementById('saveEdgenuitySettingsBtn'),
  syncEdgenuityBtn: document.getElementById('syncEdgenuityBtn'),
  edgenuityAssignmentCount: document.getElementById('edgenuityAssignmentCount'),
  edgenuityCourseName: document.getElementById('edgenuityCourseName'),
  edgenuityOverdueCount: document.getElementById('edgenuityOverdueCount'),
  edgenuityTodayCount: document.getElementById('edgenuityTodayCount'),
  edgenuityWeekCount: document.getElementById('edgenuityWeekCount'),
  edgenuityNextDue: document.getElementById('edgenuityNextDue'),
  edgenuityDueToday: document.getElementById('edgenuityDueToday'),
  edgenuityDueThisWeek: document.getElementById('edgenuityDueThisWeek'),
  edgenuityByUnit: document.getElementById('edgenuityByUnit'),
  rebuildCalendarBtn: document.getElementById('rebuildCalendarBtn'),
  syncGoogleCalendarBtn: document.getElementById('syncGoogleCalendarBtn'),
  calendarErrorBox: document.getElementById('calendarErrorBox'),
  calendarStatusBox: document.getElementById('calendarStatusBox'),
  calendarItemCount: document.getElementById('calendarItemCount'),
  calendarNextItem: document.getElementById('calendarNextItem'),
  googleCalendarPreview: document.getElementById('googleCalendarPreview'),
  openGoogleCalendarLink: document.getElementById('openGoogleCalendarLink'),
  calendarToday: document.getElementById('calendarToday'),
  calendarWeek: document.getElementById('calendarWeek'),
  schoolSection: document.getElementById('schoolSection'),
  calendarSection: document.getElementById('calendarSection')
};

const canvasState = {
  settings: loadCanvasSettings(),
  assignments: loadCanvasAssignments()
};

const edgenuityState = {
  settings: loadEdgenuitySettings(),
  assignments: loadEdgenuityAssignments(),
  courseName: loadEdgenuityCourseName()
};

const googleCalendarState = {
  events: loadGoogleCalendarEvents(),
  calendarName: loadGoogleCalendarName()
};

function init() {
  wireButtons();
  fillCanvasSettings();
  fillEdgenuitySettings();
  renderCanvasAssignments();
  renderEdgenuityAssignments();
  renderCalendarView();
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
  els.saveEdgenuitySettingsBtn.addEventListener('click', saveEdgenuitySettings);
  els.syncEdgenuityBtn.addEventListener('click', syncEdgenuityAssignments);
  els.rebuildCalendarBtn.addEventListener('click', () => { renderCalendarView(); showCalendarStatus('School calendar refreshed.'); });
  els.syncGoogleCalendarBtn.addEventListener('click', syncGoogleCalendarEvents);
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
    renderCalendarView();
    showSchoolStatus('Canvas assignments synced.');
  } catch (error) {
    showSchoolError(error && error.message ? error.message : String(error));
  } finally {
    setSchoolLoading(false);
  }
}

function fillEdgenuitySettings() {
  els.edgenuityApiBaseUrl.value = edgenuityState.settings.apiBaseUrl || EDGENUITY_DEFAULT_API_BASE;
  els.edgenuityEnrollmentId.value = edgenuityState.settings.enrollmentId || '';
  els.edgenuityToken.value = edgenuityState.settings.token || '';
}

function saveEdgenuitySettings() {
  const apiBaseUrl = sanitizeEdgenuityBaseUrl(els.edgenuityApiBaseUrl.value);
  const enrollmentId = String(els.edgenuityEnrollmentId.value || '').trim();
  const token = String(els.edgenuityToken.value || '').trim();

  if (!apiBaseUrl || !enrollmentId || !token) {
    showSchoolError('Add your Edgenuity API base URL, enrollment ID, and token first.');
    return;
  }

  edgenuityState.settings = { apiBaseUrl: apiBaseUrl, enrollmentId: enrollmentId, token: token };
  localStorage.setItem(EDGENUITY_SETTINGS_KEY, JSON.stringify(edgenuityState.settings));
  showSchoolStatus('Edgenuity settings saved on this device.');
}

async function syncEdgenuityAssignments() {
  const apiBaseUrl = sanitizeEdgenuityBaseUrl(els.edgenuityApiBaseUrl.value);
  const enrollmentId = String(els.edgenuityEnrollmentId.value || '').trim();
  const token = String(els.edgenuityToken.value || '').trim();

  if (!apiBaseUrl || !enrollmentId || !token) {
    showSchoolError('Add your Edgenuity API base URL, enrollment ID, and token first.');
    return;
  }

  edgenuityState.settings = { apiBaseUrl: apiBaseUrl, enrollmentId: enrollmentId, token: token };
  localStorage.setItem(EDGENUITY_SETTINGS_KEY, JSON.stringify(edgenuityState.settings));

  showSchoolStatus('Syncing Edgenuity assignments...');
  setSchoolLoading(true);

  try {
    const result = await apiRequest('syncEdgenuity', {
      apiBaseUrl: apiBaseUrl,
      enrollmentId: enrollmentId,
      token: token
    });
    edgenuityState.assignments = Array.isArray(result.assignments) ? result.assignments : [];
    edgenuityState.courseName = result.courseName || 'Edgenuity course';
    localStorage.setItem(EDGENUITY_ASSIGNMENTS_KEY, JSON.stringify(edgenuityState.assignments));
    localStorage.setItem('manage-my-life-edgenuity-course-name', edgenuityState.courseName);
    renderEdgenuityAssignments();
    renderCalendarView();
    showSchoolStatus('Edgenuity assignments synced.');
  } catch (error) {
    showSchoolError(error && error.message ? error.message : String(error));
  } finally {
    setSchoolLoading(false);
  }
}


async function syncGoogleCalendarEvents() {
  showCalendarStatus('Syncing Google Calendar...');
  setCalendarLoading(true);

  try {
    const result = await apiRequest('syncGoogleCalendar', { days: 14 });
    googleCalendarState.events = Array.isArray(result.events) ? result.events : [];
    googleCalendarState.calendarName = result.calendarName || 'Google Calendar';
    localStorage.setItem(GOOGLE_CALENDAR_EVENTS_KEY, JSON.stringify(googleCalendarState.events));
    localStorage.setItem(GOOGLE_CALENDAR_NAME_KEY, googleCalendarState.calendarName);
    renderCalendarView();
    showCalendarStatus('Google Calendar synced.');
  } catch (error) {
    showCalendarError(error && error.message ? error.message : String(error));
  } finally {
    setCalendarLoading(false);
  }
}

function renderCalendarView() {
  const items = collectCalendarItems();
  const googleItems = (googleCalendarState.events || []).map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end,
    source: 'google-calendar',
    courseName: googleCalendarState.calendarName || 'Google Calendar',
    unitName: event.location || '',
    lessonName: '',
    itemType: event.allDay ? 'All day' : '',
    htmlUrl: event.htmlUrl || 'https://calendar.google.com/calendar/u/0/r',
    openLabel: event.openLabel || 'Open Google Calendar'
  }));

  els.calendarItemCount.textContent = items.length + (items.length === 1 ? ' item' : ' items');
  els.calendarNextItem.textContent = items.length ? buildCalendarHeadline(items[0]) : 'Nothing scheduled yet';
  if (els.openGoogleCalendarLink) {
    els.openGoogleCalendarLink.href = 'https://calendar.google.com/calendar/u/0/r';
  }

  renderCalendarList(els.googleCalendarPreview, googleItems.slice(0, 3), 'Sync Google Calendar to see events here.');
  const todayItems = items.filter((item) => isSameDay(item.start, new Date()));
  renderCalendarList(els.calendarToday, todayItems, 'Nothing on the calendar today.');
  renderCalendarDays(els.calendarWeek, items, 7);
}

function collectCalendarItems() {
  const canvasItems = (canvasState.assignments || []).map((assignment) => ({
    title: assignment.name,
    start: assignment.dueAt,
    source: 'canvas',
    courseName: assignment.courseName,
    unitName: assignment.unitName || '',
    lessonName: assignment.lessonName || '',
    itemType: assignment.pointsPossible != null ? String(assignment.pointsPossible) + ' pts' : '',
    htmlUrl: assignment.htmlUrl || '',
    openLabel: assignment.openLabel || 'Open in Canvas'
  }));

  const edgenuityItems = (edgenuityState.assignments || []).map((assignment) => ({
    title: assignment.name,
    start: assignment.dueAt,
    source: 'edgenuity',
    courseName: assignment.courseName,
    unitName: assignment.unitName || '',
    lessonName: assignment.lessonName || '',
    itemType: assignment.itemType || '',
    htmlUrl: assignment.htmlUrl || '',
    openLabel: assignment.openLabel || 'Open in Edgenuity'
  }));

  const googleItems = (googleCalendarState.events || []).map((event) => ({
    title: event.title,
    start: event.start,
    end: event.end,
    source: 'google-calendar',
    courseName: googleCalendarState.calendarName || 'Google Calendar',
    unitName: event.location || '',
    lessonName: '',
    itemType: event.allDay ? 'All day' : '',
    htmlUrl: event.htmlUrl || '',
    openLabel: event.openLabel || 'Open Google Calendar'
  }));

  return canvasItems.concat(edgenuityItems, googleItems)
    .filter((item) => item.start)
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

function renderCalendarList(container, items, emptyMessage) {
  container.innerHTML = '';
  if (!items.length) {
    container.innerHTML = '<div class="entry assignment-card"><div class="entry-top"><strong>' + escapeHtml(emptyMessage) + '</strong><span class="mini">You are clear here.</span></div></div>';
    return;
  }
  items.forEach((item) => {
    container.appendChild(buildAssignmentCard(item));
  });
}

function renderCalendarDays(container, items, limitDays) {
  container.innerHTML = '';
  if (!items.length) {
    container.innerHTML = '<div class="calendar-day"><div class="calendar-day-head"><strong>No upcoming items</strong><span class="mini">Sync Google Calendar or refresh school items.</span></div></div>';
    return;
  }

  const grouped = {};
  items.forEach((item) => {
    const key = toLocalDayKey(item.start);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  Object.keys(grouped).sort().slice(0, limitDays).forEach((dayKey) => {
    const card = document.createElement('div');
    card.className = 'calendar-day';
    const head = document.createElement('div');
    head.className = 'calendar-day-head';
    head.innerHTML = '<strong>' + escapeHtml(formatCalendarDayLabel(dayKey)) + '</strong><span class="mini">' + grouped[dayKey].length + (grouped[dayKey].length === 1 ? ' item' : ' items') + '</span>';
    card.appendChild(head);

    grouped[dayKey].forEach((item) => {
      card.appendChild(buildAssignmentCard(item));
    });

    container.appendChild(card);
  });
}

function buildCalendarHeadline(item) {
  return item.title + ' on ' + formatDueDate(item.start);
}

function renderCanvasAssignments() {
  const assignments = Array.isArray(canvasState.assignments) ? canvasState.assignments : [];
  const courseNames = new Set(assignments.map((item) => item.courseName).filter(Boolean));
  const overdue = assignments.filter((item) => getAssignmentBucket(item) === 'overdue');
  const dueToday = assignments.filter((item) => getAssignmentBucket(item) === 'today');
  const dueThisWeek = assignments.filter((item) => {
    const bucket = getAssignmentBucket(item);
    return bucket === 'today' || bucket === 'week';
  });

  els.canvasAssignmentCount.textContent = assignments.length + (assignments.length === 1 ? ' assignment' : ' assignments');
  els.canvasClassCount.textContent = courseNames.size + (courseNames.size === 1 ? ' class' : ' classes');
  els.canvasOverdueCount.textContent = overdue.length + (overdue.length === 1 ? ' overdue' : ' overdue');
  els.canvasTodayCount.textContent = dueToday.length + (dueToday.length === 1 ? ' due today' : ' due today');
  els.canvasWeekCount.textContent = dueThisWeek.length + (dueThisWeek.length === 1 ? ' due this week' : ' due this week');
  els.canvasNextDue.textContent = assignments.length ? formatDueDate(assignments[0].dueAt) : 'No due date yet';

  renderAssignmentList(els.canvasDueToday, dueToday, 'Nothing due today.');
  renderAssignmentList(els.canvasDueThisWeek, dueThisWeek, 'Nothing due this week.');
  renderAssignmentsByClass(assignments);
}

function renderEdgenuityAssignments() {
  const assignments = Array.isArray(edgenuityState.assignments) ? edgenuityState.assignments : [];
  const overdue = assignments.filter((item) => getAssignmentBucket(item) === 'overdue');
  const dueToday = assignments.filter((item) => getAssignmentBucket(item) === 'today');
  const dueThisWeek = assignments.filter((item) => {
    const bucket = getAssignmentBucket(item);
    return bucket === 'today' || bucket === 'week';
  });

  els.edgenuityAssignmentCount.textContent = assignments.length + (assignments.length === 1 ? ' open item' : ' open items');
  els.edgenuityCourseName.textContent = edgenuityState.courseName || 'Edgenuity course';
  els.edgenuityOverdueCount.textContent = overdue.length + ' overdue';
  els.edgenuityTodayCount.textContent = dueToday.length + ' due today';
  els.edgenuityWeekCount.textContent = dueThisWeek.length + ' due this week';
  els.edgenuityNextDue.textContent = assignments.length ? formatDueDate(assignments[0].dueAt) : 'No due date yet';

  renderAssignmentList(els.edgenuityDueToday, dueToday, 'Nothing due today.');
  renderAssignmentList(els.edgenuityDueThisWeek, dueThisWeek, 'Nothing due this week.');
  renderAssignmentsByGroup(els.edgenuityByUnit, assignments, (assignment) => assignment.unitName || assignment.lessonName || 'Other work', 'No Edgenuity groups yet', 'Sync Edgenuity to fill this area.');
}

function renderAssignmentList(container, assignments, emptyMessage) {
  container.innerHTML = '';
  if (!assignments.length) {
    container.innerHTML = '<div class="entry assignment-card"><div class="entry-top"><strong>' + escapeHtml(emptyMessage) + '</strong><span class="mini">You are clear for this section.</span></div></div>';
    return;
  }

  assignments.forEach((assignment) => {
    container.appendChild(buildAssignmentCard(assignment));
  });
}

function renderAssignmentsByClass(assignments) {
  renderAssignmentsByGroup(els.canvasByClass, assignments, (assignment) => assignment.courseName || 'Canvas course', 'No class groups yet', 'Sync Canvas assignments to fill this area.');
}

function renderAssignmentsByGroup(container, assignments, keyFn, emptyTitle, emptyText) {
  container.innerHTML = '';
  if (!assignments.length) {
    container.innerHTML = '<div class="class-card"><strong>' + escapeHtml(emptyTitle) + '</strong><span class="mini">' + escapeHtml(emptyText) + '</span></div>';
    return;
  }

  const grouped = {};
  assignments.forEach((assignment) => {
    const key = keyFn(assignment);
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(assignment);
  });

  Object.keys(grouped).sort().forEach((groupName) => {
    const wrap = document.createElement('div');
    wrap.className = 'class-card';
    const title = document.createElement('strong');
    title.textContent = groupName;
    wrap.appendChild(title);

    grouped[groupName].slice(0, 6).forEach((assignment) => {
      wrap.appendChild(buildAssignmentCard(assignment));
    });

    container.appendChild(wrap);
  });
}

function buildAssignmentCard(assignment) {
  const bucket = getAssignmentBucket(assignment);
  const card = document.createElement('div');
  card.className = 'entry assignment-card' + (bucket === 'overdue' ? ' overdue' : bucket === 'today' ? ' today' : '');

  let buttonHtml = '';
  if (assignment.htmlUrl) {
    buttonHtml = '<a class="btn ghost" href="' + escapeHtml(assignment.htmlUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(assignment.openLabel || 'Open') + '</a>';
  }

  let sourceHtml = '';
  if (assignment.source) {
    sourceHtml = '<span class="calendar-source ' + escapeHtml(assignment.source) + '">' + escapeHtml(formatSourceLabel(assignment.source)) + '</span>';
  }

  const contextBits = [assignment.courseName];
  if (assignment.unitName) {
    contextBits.push(assignment.unitName);
  }
  if (assignment.lessonName) {
    contextBits.push(assignment.lessonName);
  }

  const title = assignment.name || assignment.title || 'Untitled item';
  const dueValue = assignment.dueAt || assignment.start;
  card.innerHTML = '<div class="assignment-row">' + sourceHtml + '<span class="assignment-tag ' + bucket + '">' + escapeHtml(getBucketLabel(bucket)) + '</span><strong>' + escapeHtml(title) + '</strong><span class="assignment-meta">' + escapeHtml(contextBits.filter(Boolean).join(' | ')) + '</span><span class="assignment-meta">' + (assignment.source === 'google-calendar' ? 'Starts ' : 'Due ') + escapeHtml(formatDueDate(dueValue)) + (assignment.pointsPossible != null ? ' | ' + escapeHtml(String(assignment.pointsPossible)) + ' pts' : '') + (assignment.itemType ? ' | ' + escapeHtml(String(assignment.itemType)) : '') + '</span></div>' + buttonHtml;
  return card;
}

function getAssignmentBucket(assignment) {
  const due = new Date(assignment.dueAt);
  const dueDayStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const weekEnd = new Date(todayStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  if (dueDayStart < todayStart) {
    return 'overdue';
  }
  if (dueDayStart >= todayStart && dueDayStart < tomorrowStart) {
    return 'today';
  }
  if (dueDayStart < weekEnd) {
    return 'week';
  }
  return 'later';
}

function getBucketLabel(bucket) {
  if (bucket === 'overdue') return 'Overdue';
  if (bucket === 'today') return 'Today';
  if (bucket === 'week') return 'This week';
  return 'Later';
}

function formatSourceLabel(source) {
  if (source === 'google-calendar') return 'Google';
  if (source === 'canvas') return 'Canvas';
  if (source === 'edgenuity') return 'Edgenuity';
  return 'Item';
}

function loadGoogleCalendarEvents() {
  try {
    return JSON.parse(localStorage.getItem(GOOGLE_CALENDAR_EVENTS_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function loadGoogleCalendarName() {
  return localStorage.getItem(GOOGLE_CALENDAR_NAME_KEY) || 'Google Calendar';
}

function toLocalDayKey(value) {
  const date = new Date(value);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function isSameDay(value, compareDate) {
  const date = new Date(value);
  return date.getFullYear() === compareDate.getFullYear() && date.getMonth() === compareDate.getMonth() && date.getDate() === compareDate.getDate();
}

function formatCalendarDayLabel(dayKey) {
  const date = new Date(dayKey + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function showCalendarError(message) {
  setCalendarLoading(false);
  els.calendarStatusBox.style.display = 'none';
  els.calendarStatusBox.textContent = '';
  els.calendarErrorBox.textContent = message;
  els.calendarErrorBox.style.display = 'block';
}

function showCalendarStatus(message) {
  if (!message) {
    els.calendarStatusBox.style.display = 'none';
    els.calendarStatusBox.textContent = '';
    setCalendarLoading(false);
    return;
  }
  els.calendarErrorBox.style.display = 'none';
  els.calendarErrorBox.textContent = '';
  els.calendarStatusBox.textContent = message;
  els.calendarStatusBox.style.display = 'block';
}

function setCalendarLoading(on) {
  els.calendarSection.classList.toggle('loading', !!on);
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

function loadEdgenuitySettings() {
  try {
    return JSON.parse(localStorage.getItem(EDGENUITY_SETTINGS_KEY) || 'null') || { apiBaseUrl: EDGENUITY_DEFAULT_API_BASE, enrollmentId: '', token: '' };
  } catch (error) {
    return { apiBaseUrl: EDGENUITY_DEFAULT_API_BASE, enrollmentId: '', token: '' };
  }
}

function loadEdgenuityAssignments() {
  try {
    return JSON.parse(localStorage.getItem(EDGENUITY_ASSIGNMENTS_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function loadEdgenuityCourseName() {
  return localStorage.getItem('manage-my-life-edgenuity-course-name') || 'Edgenuity course';
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

function sanitizeEdgenuityBaseUrl(value) {
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
