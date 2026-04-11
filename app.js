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
const DISMISSED_ASSIGNMENTS_KEY = 'manage-my-life-dismissed-assignments';
const FITNESS_PROFILE_KEY = 'manage-my-life-fitness-profile';
const FITNESS_DAYS_KEY = 'manage-my-life-fitness-days';
const FITNESS_FIXED_PROFILE = {
  height: "6'1",
  displayHeight: "6'3 with 2-inch sole shoes",
  startingWeight: 200.2,
  age: 17,
  sex: 'male',
  goal: 'maintain',
  activityLevel: 'moderate',
  proteinGoal: 150,
  calorieGoal: 2850,
  waterGoal: 12,
  stepGoal: 10000,
  sleepGoal: 9,
  workoutGoal: 4,
  restrictions: "Measured 6'3 with 2-inch sole shoes, so goal estimates use about 6'1 actual height."
};

const hourButtons = Array.from(document.querySelectorAll('.hour-chip'));
const activityButtons = Array.from(document.querySelectorAll('.activity-chip'));
const dashboardTiles = Array.from(document.querySelectorAll('.dashboard-tile'));
const fitnessTabs = Array.from(document.querySelectorAll('.fitness-tab'));
const foodPresetButtons = Array.from(document.querySelectorAll('.food-preset'));

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
  calendarSection: document.getElementById('calendarSection'),
  fitnessStatusBox: document.getElementById('fitnessStatusBox'),
  fitnessDate: document.getElementById('fitnessDate'),
  fitnessWeight: document.getElementById('fitnessWeight'),
  fitnessWater: document.getElementById('fitnessWater'),
  fitnessSteps: document.getElementById('fitnessSteps'),
  fitnessActiveMinutes: document.getElementById('fitnessActiveMinutes'),
  fitnessRestingHr: document.getElementById('fitnessRestingHr'),
  fitnessAvgHr: document.getElementById('fitnessAvgHr'),
  fitnessSleep: document.getElementById('fitnessSleep'),
  fitnessMood: document.getElementById('fitnessMood'),
  fitnessNotes: document.getElementById('fitnessNotes'),
  fitnessWorkoutDone: document.getElementById('fitnessWorkoutDone'),
  saveFitnessDayBtn: document.getElementById('saveFitnessDayBtn'),
  foodName: document.getElementById('foodName'),
  foodMeal: document.getElementById('foodMeal'),
  foodCalories: document.getElementById('foodCalories'),
  foodProtein: document.getElementById('foodProtein'),
  addFoodBtn: document.getElementById('addFoodBtn'),
  fitnessFoodList: document.getElementById('fitnessFoodList'),
  fitnessHeight: document.getElementById('fitnessHeight'),
  fitnessAge: document.getElementById('fitnessAge'),
  fitnessSex: document.getElementById('fitnessSex'),
  fitnessGoal: document.getElementById('fitnessGoal'),
  fitnessActivityLevel: document.getElementById('fitnessActivityLevel'),
  fitnessProteinGoal: document.getElementById('fitnessProteinGoal'),
  fitnessCalorieGoal: document.getElementById('fitnessCalorieGoal'),
  fitnessWaterGoal: document.getElementById('fitnessWaterGoal'),
  fitnessStepGoal: document.getElementById('fitnessStepGoal'),
  fitnessSleepGoal: document.getElementById('fitnessSleepGoal'),
  fitnessWorkoutGoal: document.getElementById('fitnessWorkoutGoal'),
  fitnessRestrictions: document.getElementById('fitnessRestrictions'),
  saveFitnessProfileBtn: document.getElementById('saveFitnessProfileBtn'),
  suggestFitnessGoalsBtn: document.getElementById('suggestFitnessGoalsBtn'),
  fitnessWaterTarget: document.getElementById('fitnessWaterTarget'),
  fitnessSleepTarget: document.getElementById('fitnessSleepTarget'),
  fitnessWorkoutTarget: document.getElementById('fitnessWorkoutTarget'),
  fitnessReadinessScore: document.getElementById('fitnessReadinessScore'),
  fitnessProteinProgress: document.getElementById('fitnessProteinProgress'),
  fitnessCaloriesProgress: document.getElementById('fitnessCaloriesProgress'),
  fitnessStepsProgress: document.getElementById('fitnessStepsProgress'),
  fitnessWeightTrend: document.getElementById('fitnessWeightTrend'),
  fitnessWorkoutStreak: document.getElementById('fitnessWorkoutStreak'),
  fitnessAvgSteps: document.getElementById('fitnessAvgSteps'),
  fitnessAvgSleep: document.getElementById('fitnessAvgSleep'),
  fitnessHistoryList: document.getElementById('fitnessHistoryList'),
  fitnessTodayPanel: document.getElementById('fitnessTodayPanel'),
  fitnessProfilePanel: document.getElementById('fitnessProfilePanel'),
  fitnessHistoryPanel: document.getElementById('fitnessHistoryPanel')
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

const dismissedAssignments = loadDismissedAssignments();
const fitnessState = {
  profile: loadFitnessProfile(),
  days: loadFitnessDays()
};

function init() {
  wireButtons();
  fillCanvasSettings();
  fillEdgenuitySettings();
  renderCanvasAssignments();
  renderEdgenuityAssignments();
  renderCalendarView();
  initFitness();
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
  if (els.saveFitnessDayBtn) els.saveFitnessDayBtn.addEventListener('click', saveFitnessDay);
  if (els.saveFitnessProfileBtn) els.saveFitnessProfileBtn.addEventListener('click', saveFitnessProfile);
  if (els.suggestFitnessGoalsBtn) els.suggestFitnessGoalsBtn.addEventListener('click', suggestFitnessGoals);
  if (els.addFoodBtn) els.addFoodBtn.addEventListener('click', addFitnessFood);
  fitnessTabs.forEach((button) => button.addEventListener('click', () => showFitnessTab(button.getAttribute('data-fitness-tab'))));
  foodPresetButtons.forEach((button) => button.addEventListener('click', () => applyFoodPreset(button)));
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
  const canvasItems = (canvasState.assignments || []).filter((assignment) => !isDismissedAssignment(assignment)).map((assignment) => ({
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

  const edgenuityItems = (edgenuityState.assignments || []).filter((assignment) => !isDismissedAssignment(assignment)).map((assignment) => ({
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


function dismissAssignment(assignment) {
  const assignmentId = getDismissKey(assignment);
  if (!assignmentId) {
    return;
  }

  const label = assignment.name || assignment.title || 'this item';
  const ok = window.confirm('Dismiss "' + label + '" from the app? You can bring it back later by clearing dismissed items in browser storage if needed.');
  if (!ok) {
    return;
  }

  dismissedAssignments[assignmentId] = {
    dismissedAt: new Date().toISOString(),
    title: label
  };
  localStorage.setItem(DISMISSED_ASSIGNMENTS_KEY, JSON.stringify(dismissedAssignments));
  renderCanvasAssignments();
  renderEdgenuityAssignments();
  renderCalendarView();
  showSchoolStatus('Assignment dismissed on this device.');
}

function isDismissedAssignment(assignment) {
  const key = getDismissKey(assignment);
  return !!(key && dismissedAssignments[key]);
}

function getDismissKey(assignment) {
  const baseId = assignment.id || assignment.htmlUrl || ((assignment.courseName || '') + '|' + (assignment.name || assignment.title || '') + '|' + (assignment.dueAt || assignment.start || ''));
  if (!baseId) {
    return '';
  }
  return String(assignment.source || 'assignment') + '::' + String(baseId);
}

function renderCanvasAssignments() {
  const assignments = (Array.isArray(canvasState.assignments) ? canvasState.assignments : [])
    .map((item) => ({ ...item, source: item.source || 'canvas', openLabel: item.openLabel || 'Open in Canvas' }))
    .filter((item) => !isDismissedAssignment(item));
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
  const assignments = (Array.isArray(edgenuityState.assignments) ? edgenuityState.assignments : [])
    .map((item) => ({ ...item, source: item.source || 'edgenuity', openLabel: item.openLabel || 'Open in Edgenuity' }))
    .filter((item) => !isDismissedAssignment(item));
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

  const row = document.createElement('div');
  row.className = 'assignment-row';

  if (assignment.source) {
    const source = document.createElement('span');
    source.className = 'calendar-source ' + assignment.source;
    source.textContent = formatSourceLabel(assignment.source);
    row.appendChild(source);
  }

  const tag = document.createElement('span');
  tag.className = 'assignment-tag ' + bucket;
  tag.textContent = getBucketLabel(bucket);
  row.appendChild(tag);

  const title = document.createElement('strong');
  title.textContent = assignment.name || assignment.title || 'Untitled item';
  row.appendChild(title);

  const contextBits = [assignment.courseName];
  if (assignment.unitName) {
    contextBits.push(assignment.unitName);
  }
  if (assignment.lessonName) {
    contextBits.push(assignment.lessonName);
  }

  const context = document.createElement('span');
  context.className = 'assignment-meta';
  context.textContent = contextBits.filter(Boolean).join(' | ');
  row.appendChild(context);

  const dueValue = assignment.dueAt || assignment.start;
  const due = document.createElement('span');
  due.className = 'assignment-meta';
  due.textContent = (assignment.source === 'google-calendar' ? 'Starts ' : 'Due ') + formatDueDate(dueValue)
    + (assignment.pointsPossible != null ? ' | ' + String(assignment.pointsPossible) + ' pts' : '')
    + (assignment.itemType ? ' | ' + String(assignment.itemType) : '');
  row.appendChild(due);
  card.appendChild(row);

  const actionRow = document.createElement('div');
  actionRow.className = 'assignment-actions';

  if (assignment.htmlUrl) {
    const openLink = document.createElement('a');
    openLink.className = 'btn ghost';
    openLink.href = assignment.htmlUrl;
    openLink.target = '_blank';
    openLink.rel = 'noopener noreferrer';
    openLink.textContent = assignment.openLabel || 'Open';
    actionRow.appendChild(openLink);
  }

  if (assignment.source === 'canvas' || assignment.source === 'edgenuity') {
    const dismissButton = document.createElement('button');
    dismissButton.type = 'button';
    dismissButton.className = 'btn ghost dismiss-btn';
    dismissButton.textContent = 'Dismiss';
    dismissButton.addEventListener('click', () => dismissAssignment(assignment));
    actionRow.appendChild(dismissButton);
  }

  if (actionRow.children.length) {
    card.appendChild(actionRow);
  }
  return card;
}

function getAssignmentBucket(assignment) {
  const due = new Date(assignment.dueAt || assignment.start);
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


function loadDismissedAssignments() {
  try {
    return JSON.parse(localStorage.getItem(DISMISSED_ASSIGNMENTS_KEY) || '{}');
  } catch (error) {
    return {};
  }
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


function initFitness() {
  if (!els.fitnessDate) {
    return;
  }
  els.fitnessDate.value = todayValue();
  fillFitnessProfile();
  fillFitnessDay(todayValue());
  els.fitnessDate.addEventListener('change', () => fillFitnessDay(els.fitnessDate.value));
  renderFitness();
}

function showFitnessTab(tabName) {
  fitnessTabs.forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-fitness-tab') === tabName);
  });
  if (els.fitnessTodayPanel) els.fitnessTodayPanel.classList.toggle('hidden', tabName !== 'today');
  if (els.fitnessProfilePanel) els.fitnessProfilePanel.classList.toggle('hidden', tabName !== 'profile');
  if (els.fitnessHistoryPanel && els.fitnessHistoryPanel.classList) {
    els.fitnessHistoryPanel.classList.toggle('hidden', tabName !== 'history');
  }
}

function fillFitnessProfile() {
  const profile = fitnessState.profile;
  if (els.fitnessHeight) els.fitnessHeight.value = profile.height || '';
  if (els.fitnessAge) els.fitnessAge.value = profile.age || '';
  if (els.fitnessSex) els.fitnessSex.value = profile.sex || 'male';
  if (els.fitnessGoal) els.fitnessGoal.value = profile.goal || 'maintain';
  if (els.fitnessActivityLevel) els.fitnessActivityLevel.value = profile.activityLevel || 'moderate';
  if (els.fitnessProteinGoal) els.fitnessProteinGoal.value = profile.proteinGoal || '';
  if (els.fitnessCalorieGoal) els.fitnessCalorieGoal.value = profile.calorieGoal || '';
  if (els.fitnessWaterGoal) els.fitnessWaterGoal.value = profile.waterGoal || '';
  if (els.fitnessStepGoal) els.fitnessStepGoal.value = profile.stepGoal || '';
  if (els.fitnessSleepGoal) els.fitnessSleepGoal.value = profile.sleepGoal || '';
  if (els.fitnessWorkoutGoal) els.fitnessWorkoutGoal.value = profile.workoutGoal || '';
  if (els.fitnessRestrictions) els.fitnessRestrictions.value = profile.restrictions || '';
}

function readFitnessProfileForm() {
  const current = { ...FITNESS_FIXED_PROFILE, ...fitnessState.profile };
  return {
    height: els.fitnessHeight ? els.fitnessHeight.value.trim() : current.height,
    age: els.fitnessAge ? Number(els.fitnessAge.value || 0) : current.age,
    sex: els.fitnessSex ? els.fitnessSex.value : current.sex,
    goal: els.fitnessGoal ? els.fitnessGoal.value : current.goal,
    activityLevel: els.fitnessActivityLevel ? els.fitnessActivityLevel.value : current.activityLevel,
    proteinGoal: els.fitnessProteinGoal ? Number(els.fitnessProteinGoal.value || 0) : current.proteinGoal,
    calorieGoal: els.fitnessCalorieGoal ? Number(els.fitnessCalorieGoal.value || 0) : current.calorieGoal,
    waterGoal: els.fitnessWaterGoal ? Number(els.fitnessWaterGoal.value || 0) : current.waterGoal,
    stepGoal: els.fitnessStepGoal ? Number(els.fitnessStepGoal.value || 0) : current.stepGoal,
    sleepGoal: els.fitnessSleepGoal ? Number(els.fitnessSleepGoal.value || 0) : current.sleepGoal,
    workoutGoal: els.fitnessWorkoutGoal ? Number(els.fitnessWorkoutGoal.value || 0) : current.workoutGoal,
    restrictions: els.fitnessRestrictions ? els.fitnessRestrictions.value.trim() : current.restrictions
  };
}

function saveFitnessProfile() {
  fitnessState.profile = readFitnessProfileForm();
  localStorage.setItem(FITNESS_PROFILE_KEY, JSON.stringify(fitnessState.profile));
  renderFitness();
  showFitnessStatus('Fitness profile saved.');
}


function suggestFitnessGoals() {
  const currentDate = els.fitnessDate.value || todayValue();
  const currentDay = readFitnessDayForm();
  fitnessState.days[currentDate] = currentDay;

  const weightLb = currentDay.weight || getLatestFitnessValue('weight');
  const profile = readFitnessProfileForm();
  const age = Number(profile.age || 0);
  const heightIn = parseHeightInches(profile.height);
  const sex = profile.sex || 'male';

  if (!weightLb || !heightIn || !age) {
    showFitnessStatus('Add height, age, and today\'s weight first, then I can suggest goals.');
    return;
  }

  const recentDays = getRecentFitnessDays(7);
  const activityLevel = inferActivityLevel(recentDays, profile.activityLevel);
  const weightKg = weightLb / 2.20462;
  const heightCm = heightIn * 2.54;
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + (sex === 'female' ? -161 : 5);
  const multiplier = getActivityMultiplier(activityLevel);
  let calorieGoal = Math.round((bmr * multiplier) / 25) * 25;
  const goal = profile.goal;

  if (goal === 'lose-fat') {
    calorieGoal -= 250;
  } else if (goal === 'gain-muscle') {
    calorieGoal += 250;
  } else if (goal === 'performance') {
    calorieGoal += 100;
  }

  const proteinPerLb = goal === 'gain-muscle' ? 0.85 : goal === 'lose-fat' ? 0.75 : goal === 'performance' ? 0.8 : 0.7;
  const proteinGoal = Math.round(weightLb * proteinPerLb);
  const activeMinutes = Number(currentDay.activeMinutes || averageRecentValue(recentDays, 'activeMinutes') || 0);
  const waterBase = sex === 'female' ? 10 : 11;
  const waterGoal = Math.round(waterBase + Math.max(0, activeMinutes / 30));
  const stepGoal = activityLevel === 'athlete' ? 14000 : activityLevel === 'high' ? 12000 : activityLevel === 'moderate' ? 10000 : 8000;
  const sleepGoal = age && age < 18 ? 9 : 8;
  const workoutGoal = goal === 'maintain' ? 3 : 4;

  fitnessState.profile = {
    ...profile,
    activityLevel,
    proteinGoal,
    calorieGoal: Math.max(1200, calorieGoal),
    waterGoal,
    stepGoal,
    sleepGoal,
    workoutGoal
  };
  fillFitnessProfile();
  localStorage.setItem(FITNESS_PROFILE_KEY, JSON.stringify(fitnessState.profile));
  fitnessState.days[currentDate] = currentDay;
  persistFitnessDays();
  renderFitness();
  showFitnessStatus('Starter goals suggested from your stats and recent logs.');
}

function parseHeightInches(value) {
  const text = String(value || '').trim().toLowerCase();
  if (!text) {
    return 0;
  }
  const feetMatch = text.match(/^(\d+)\s*'?\s*(\d+)?/);
  if (feetMatch && text.includes("'")) {
    return (Number(feetMatch[1]) * 12) + Number(feetMatch[2] || 0);
  }
  if (text.includes('ft')) {
    const feet = Number((text.match(/(\d+(?:\.\d+)?)\s*ft/) || [])[1] || 0);
    const inches = Number((text.match(/(\d+(?:\.\d+)?)\s*in/) || [])[1] || 0);
    return (feet * 12) + inches;
  }
  return Number(text.replace(/[^\d.]/g, '')) || 0;
}

function inferActivityLevel(days, fallback) {
  const avgSteps = averageRecentValue(days, 'steps');
  const avgActive = averageRecentValue(days, 'activeMinutes');
  if (avgSteps >= 12000 || avgActive >= 75) return 'athlete';
  if (avgSteps >= 9000 || avgActive >= 45) return 'high';
  if (avgSteps >= 6000 || avgActive >= 25) return 'moderate';
  return fallback || 'light';
}

function getActivityMultiplier(level) {
  if (level === 'athlete') return 1.75;
  if (level === 'high') return 1.6;
  if (level === 'moderate') return 1.45;
  return 1.3;
}

function getRecentFitnessDays(count) {
  return Object.values(fitnessState.days)
    .filter((day) => day && day.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
}

function averageRecentValue(days, key) {
  const values = days.map((day) => Number(day[key] || 0)).filter(Boolean);
  if (!values.length) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getLatestFitnessValue(key) {
  const latest = getRecentFitnessDays(30).find((day) => Number(day[key] || 0));
  return latest ? Number(latest[key] || 0) : 0;
}

function getFitnessDay(dateKey) {
  if (!fitnessState.days[dateKey]) {
    fitnessState.days[dateKey] = {
      date: dateKey,
      weight: 0,
      water: 0,
      steps: 0,
      activeMinutes: 0,
      restingHr: 0,
      avgHr: 0,
      sleep: 0,
      mood: 0,
      notes: '',
      workoutDone: false,
      foods: []
    };
  }
  return fitnessState.days[dateKey];
}

function fillFitnessDay(dateKey) {
  const day = getFitnessDay(dateKey || todayValue());
  els.fitnessDate.value = day.date;
  els.fitnessWeight.value = day.weight || '';
  els.fitnessWater.value = day.water || '';
  els.fitnessSteps.value = day.steps || '';
  els.fitnessActiveMinutes.value = day.activeMinutes || '';
  els.fitnessRestingHr.value = day.restingHr || '';
  els.fitnessAvgHr.value = day.avgHr || '';
  els.fitnessSleep.value = day.sleep || '';
  els.fitnessMood.value = day.mood || '';
  els.fitnessNotes.value = day.notes || '';
  els.fitnessWorkoutDone.checked = !!day.workoutDone;
  renderFitness();
}

function readFitnessDayForm() {
  const dateKey = els.fitnessDate.value || todayValue();
  const day = getFitnessDay(dateKey);
  return {
    ...day,
    date: dateKey,
    weight: Number(els.fitnessWeight.value || 0),
    water: Number(els.fitnessWater.value || 0),
    steps: Number(els.fitnessSteps.value || 0),
    activeMinutes: Number(els.fitnessActiveMinutes.value || 0),
    restingHr: Number(els.fitnessRestingHr.value || 0),
    avgHr: Number(els.fitnessAvgHr.value || 0),
    sleep: Number(els.fitnessSleep.value || 0),
    mood: Number(els.fitnessMood.value || 0),
    notes: els.fitnessNotes.value.trim(),
    workoutDone: !!els.fitnessWorkoutDone.checked,
    foods: Array.isArray(day.foods) ? day.foods : []
  };
}

function saveFitnessDay() {
  const day = readFitnessDayForm();
  fitnessState.days[day.date] = day;
  persistFitnessDays();
  renderFitness();
  showFitnessStatus('Daily check-in saved.');
}

function addFitnessFood() {
  const dateKey = els.fitnessDate.value || todayValue();
  const day = readFitnessDayForm();
  const food = {
    id: Date.now().toString(),
    name: els.foodName.value.trim() || 'Food item',
    meal: els.foodMeal.value,
    calories: Number(els.foodCalories.value || 0),
    protein: Number(els.foodProtein.value || 0)
  };
  day.foods.push(food);
  fitnessState.days[dateKey] = day;
  persistFitnessDays();
  els.foodName.value = '';
  els.foodCalories.value = '';
  els.foodProtein.value = '';
  renderFitness();
  showFitnessStatus('Food added.');
}

function deleteFitnessFood(dateKey, foodId) {
  const day = getFitnessDay(dateKey);
  day.foods = (day.foods || []).filter((food) => food.id !== foodId);
  fitnessState.days[dateKey] = day;
  persistFitnessDays();
  renderFitness();
  showFitnessStatus('Food removed.');
}

function applyFoodPreset(button) {
  els.foodName.value = button.getAttribute('data-food-name') || '';
  els.foodCalories.value = button.getAttribute('data-calories') || '';
  els.foodProtein.value = button.getAttribute('data-protein') || '';
}

function renderFitness() {
  if (!els.fitnessDate) {
    return;
  }
  const dateKey = els.fitnessDate.value || todayValue();
  const day = getFitnessDay(dateKey);
  const totals = getFoodTotals(day);
  const profile = fitnessState.profile;
  els.fitnessProteinProgress.textContent = totals.protein + ' / ' + (profile.proteinGoal ? profile.proteinGoal + 'g' : 'set soon');
  els.fitnessCaloriesProgress.textContent = totals.calories + ' / ' + (profile.calorieGoal || 'set soon');
  els.fitnessStepsProgress.textContent = (day.steps || 0).toLocaleString() + ' / ' + (profile.stepGoal || 0).toLocaleString() + ' steps';
  els.fitnessReadinessScore.textContent = calculateReadiness(day, profile) + '/100';
  if (els.fitnessWaterTarget) els.fitnessWaterTarget.textContent = 'Water goal: ' + (profile.waterGoal || 0) + ' cups';
  if (els.fitnessSleepTarget) els.fitnessSleepTarget.textContent = 'Sleep goal: ' + (profile.sleepGoal || 0) + ' hrs';
  if (els.fitnessWorkoutTarget) els.fitnessWorkoutTarget.textContent = 'Workout goal: ' + (profile.workoutGoal || 0) + '/week';
  renderFitnessFoodList(day);
  renderFitnessHistory();
}

function renderFitnessFoodList(day) {
  els.fitnessFoodList.innerHTML = '';
  const foods = Array.isArray(day.foods) ? day.foods : [];
  if (!foods.length) {
    els.fitnessFoodList.innerHTML = '<div class="entry"><div class="entry-top"><strong>No food logged yet</strong><span class="mini">Add meals above to track calories and protein.</span></div></div>';
    return;
  }
  foods.forEach((food) => {
    const card = document.createElement('div');
    card.className = 'entry';
    card.innerHTML = '<div class="entry-top"><strong>' + escapeHtml(food.name) + '</strong><span class="mini">' + escapeHtml(food.meal) + ' | ' + Number(food.calories || 0) + ' cal | ' + Number(food.protein || 0) + 'g protein</span></div>';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn ghost dismiss-btn';
    button.textContent = 'Remove';
    button.addEventListener('click', () => deleteFitnessFood(day.date, food.id));
    card.appendChild(button);
    els.fitnessFoodList.appendChild(card);
  });
}

function renderFitnessHistory() {
  const days = Object.values(fitnessState.days).sort((a, b) => b.date.localeCompare(a.date));
  const last7 = days.slice(0, 7);
  els.fitnessWeightTrend.textContent = formatAverage(last7.map((day) => day.weight).filter(Boolean), ' lb');
  els.fitnessAvgSteps.textContent = formatAverage(last7.map((day) => day.steps).filter(Boolean), ' steps', true);
  els.fitnessAvgSleep.textContent = formatAverage(last7.map((day) => day.sleep).filter(Boolean), ' hrs');
  els.fitnessWorkoutStreak.textContent = calculateWorkoutStreak() + ' days';
  els.fitnessHistoryList.innerHTML = '';
  if (!days.length) {
    els.fitnessHistoryList.innerHTML = '<div class="entry"><div class="entry-top"><strong>No history yet</strong><span class="mini">Save your first daily check-in.</span></div></div>';
    return;
  }
  days.slice(0, 10).forEach((day) => {
    const totals = getFoodTotals(day);
    const card = document.createElement('div');
    card.className = 'entry';
    card.innerHTML = '<div class="entry-top"><strong>' + escapeHtml(formatShortDate(day.date)) + '</strong><span class="mini">' + Number(day.weight || 0) + ' lb | ' + totals.calories + ' cal | ' + totals.protein + 'g protein | ' + Number(day.steps || 0).toLocaleString() + ' steps | ' + Number(day.sleep || 0) + 'h sleep</span></div>';
    els.fitnessHistoryList.appendChild(card);
  });
}

function getFoodTotals(day) {
  return (day.foods || []).reduce((totals, food) => ({
    calories: totals.calories + Number(food.calories || 0),
    protein: totals.protein + Number(food.protein || 0)
  }), { calories: 0, protein: 0 });
}

function calculateReadiness(day, profile) {
  let score = 50;
  const sleepGoal = Number(profile.sleepGoal || 8);
  const stepGoal = Number(profile.stepGoal || 10000);
  if (day.sleep) score += Math.min(20, (day.sleep / sleepGoal) * 20);
  if (day.steps) score += Math.min(15, (day.steps / stepGoal) * 15);
  if (day.mood) score += Math.min(15, (day.mood / 10) * 15);
  if (day.restingHr && day.restingHr > 85) score -= 10;
  if (day.workoutDone) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateWorkoutStreak() {
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = new Date(cursor.getTime() - cursor.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (!fitnessState.days[key] || !fitnessState.days[key].workoutDone) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function formatAverage(values, suffix, roundWhole) {
  if (!values.length) {
    return '--';
  }
  const avg = values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length;
  return (roundWhole ? Math.round(avg).toLocaleString() : avg.toFixed(1)) + suffix;
}

function persistFitnessDays() {
  localStorage.setItem(FITNESS_DAYS_KEY, JSON.stringify(fitnessState.days));
}

function loadFitnessProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(FITNESS_PROFILE_KEY) || 'null') || {};
    return normalizeFitnessProfile({ ...FITNESS_FIXED_PROFILE, ...saved });
  } catch (error) {
    return { ...FITNESS_FIXED_PROFILE };
  }
}

function normalizeFitnessProfile(profile) {
  return {
    ...profile,
    height: profile.height || FITNESS_FIXED_PROFILE.height,
    displayHeight: profile.displayHeight || FITNESS_FIXED_PROFILE.displayHeight,
    startingWeight: Number(profile.startingWeight) || FITNESS_FIXED_PROFILE.startingWeight,
    age: Number(profile.age) || FITNESS_FIXED_PROFILE.age,
    sex: profile.sex || FITNESS_FIXED_PROFILE.sex,
    goal: profile.goal || FITNESS_FIXED_PROFILE.goal,
    activityLevel: profile.activityLevel || FITNESS_FIXED_PROFILE.activityLevel,
    proteinGoal: Number(profile.proteinGoal) || FITNESS_FIXED_PROFILE.proteinGoal,
    calorieGoal: Number(profile.calorieGoal) || FITNESS_FIXED_PROFILE.calorieGoal,
    waterGoal: Number(profile.waterGoal) || FITNESS_FIXED_PROFILE.waterGoal,
    stepGoal: Number(profile.stepGoal) || FITNESS_FIXED_PROFILE.stepGoal,
    sleepGoal: Number(profile.sleepGoal) || FITNESS_FIXED_PROFILE.sleepGoal,
    workoutGoal: Number(profile.workoutGoal) || FITNESS_FIXED_PROFILE.workoutGoal,
    restrictions: profile.restrictions || FITNESS_FIXED_PROFILE.restrictions
  };
}

function loadFitnessDays() {
  try {
    return JSON.parse(localStorage.getItem(FITNESS_DAYS_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function showFitnessStatus(message) {
  els.fitnessStatusBox.textContent = message;
  els.fitnessStatusBox.style.display = 'block';
  window.setTimeout(() => {
    els.fitnessStatusBox.style.display = 'none';
    els.fitnessStatusBox.textContent = '';
  }, 2500);
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
