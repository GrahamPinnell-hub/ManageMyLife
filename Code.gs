const CONFIG = {
  spreadsheetId: '1IdgQY_qiYsc5w2diMLQPYiPTd6scO-OGkhjqtZPyw-s',
  templateDocId: '1zQo975SHx4z-7qMVfFw53sBAyb1cyGNRFfQxBVwIprg',
  studentName: 'Graham Pinnell',
  studentId: '97277',
  defaultProject: {
    location: 'Redeemer Church',
    organization: 'Redeemer Church',
    description: 'Voluteering opportunity at Redeemer Church 1-4th grade Sunday school service/Wednesday night middle school assistant small group leader, Chicago missions hamburger fundraiser'
  },
  activityPresets: [
    'Sunday school service',
    'Middle school assistant small group leader',
    'Chicago missions hamburger fundraiser',
    'Church volunteering'
  ],
  hourPresets: [0.5, 1, 1.5, 2, 2.5, 3]
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('DSG Hours')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getAppState() {
  const profile = getProfile();
  const entries = getCurrentMonthEntries_();
  const allEntries = getAllEntries_();
  const workingDoc = ensureWorkingDoc_();
  return {
    config: {
      studentName: CONFIG.studentName,
      studentId: CONFIG.studentId,
      activityPresets: CONFIG.activityPresets,
      hourPresets: CONFIG.hourPresets,
    },
    profile: profile,
    entries: entries,
    workingDocUrl: workingDoc.getUrl(),
    monthLabel: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM yyyy'),
    monthTotal: entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0),
    overallTotal: allEntries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0),
  };
}

function saveProfile(profile) {
  const clean = {
    location: String(profile.location || CONFIG.defaultProject.location).trim(),
    organization: String(profile.organization || CONFIG.defaultProject.organization).trim(),
    description: String(profile.description || CONFIG.defaultProject.description).trim(),
  };

  const sheet = getOrCreateSheet_('Profile');
  sheet.clearContents();
  sheet.getRange(1, 1, 1, 3).setValues([['location', 'organization', 'description']]);
  sheet.getRange(2, 1, 1, 3).setValues([[clean.location, clean.organization, clean.description]]);
  regenerateWorkingDoc_();
  return getAppState();
}

function addEntry(payload) {
  const date = normalizeEntryDate_(payload.date);
  const hours = Number(payload.hours || 0);
  const activity = String(payload.activity || '').trim();

  if (!date || !hours || !activity) {
    throw new Error('Date, hours, and activity are required.');
  }

  const sheet = getOrCreateSheet_('Entries');
  ensureEntriesHeader_(sheet);
  const nextRow = sheet.getLastRow() + 1;
  const rowRange = sheet.getRange(nextRow, 1, 1, 5);
  rowRange.setNumberFormats([['m/d/yyyy h:mm:ss', '@', '@', '0.0', '@']]);
  rowRange.setValues([[
    new Date(),
    Utilities.getUuid(),
    date,
    hours,
    activity,
  ]]);
  SpreadsheetApp.flush();

  regenerateWorkingDoc_();
  return getAppState();
}

function deleteEntry(entryId) {
  const sheet = getOrCreateSheet_('Entries');
  const values = sheet.getDataRange().getValues();
  for (let row = values.length; row >= 2; row -= 1) {
    if (values[row - 1][1] === entryId) {
      sheet.deleteRow(row);
      break;
    }
  }
  regenerateWorkingDoc_();
  return getAppState();
}

function regenerateWorkingDoc_() {
  const doc = ensureWorkingDoc_();
  const body = doc.getBody();
  const profile = getProfile();
  const entries = getCurrentMonthEntries_().sort((a, b) => a.date.localeCompare(b.date));
  const total = entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);

  replaceParagraphContaining_(body, 'b) ID#:', `a) Grade (circle):       9th       10th       11th  12th       b) ID#: ___${CONFIG.studentId}____`);
  replaceParagraphContaining_(body, 'c) Name:', `c) Name: ____${CONFIG.studentName}_____________________________________________`);
  replaceParagraphContaining_(body, 'a) Location:', `a) Location: __${profile.location}_____________________________________________`);
  replaceParagraphContaining_(body, 'b) Name or Organization:', `b) Name or Organization: _______${profile.organization}________________________`);
  replaceParagraphContaining_(body, 'd) Description of the Service Project:', `d) Description of the Service Project: _____${profile.description}_________`);

  const table = findHoursTable_(body);
  const tableLayout = getHoursTableLayout_();
  if (table) {
    fillHoursTable_(table, entries, total, tableLayout);
  }

  doc.saveAndClose();
  return doc;
}

function ensureWorkingDoc_() {
  const props = PropertiesService.getScriptProperties();
  const existingId = props.getProperty('WORKING_DOC_ID');
  if (existingId) {
    try {
      return DocumentApp.openById(existingId);
    } catch (error) {}
  }

  const copy = DriveApp.getFileById(CONFIG.templateDocId).makeCopy(`Graham DSG Working Form - ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM')}`);
  props.setProperty('WORKING_DOC_ID', copy.getId());
  return DocumentApp.openById(copy.getId());
}

function getProfile() {
  const sheet = getOrCreateSheet_('Profile');
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    const profile = { ...CONFIG.defaultProject };
    sheet.clearContents();
    sheet.getRange(1, 1, 1, 3).setValues([['location', 'organization', 'description']]);
    sheet.getRange(2, 1, 1, 3).setValues([[profile.location, profile.organization, profile.description]]);
    return profile;
  }

  return {
    location: values[1][0] || CONFIG.defaultProject.location,
    organization: values[1][1] || CONFIG.defaultProject.organization,
    description: values[1][2] || CONFIG.defaultProject.description,
  };
}

function getAllEntries_() {
  const sheet = getOrCreateSheet_('Entries');
  ensureEntriesHeader_(sheet);
  const values = sheet.getDataRange().getValues();
  const displayValues = sheet.getDataRange().getDisplayValues();
  return values.slice(1)
    .map((row, index) => {
      const displayRow = displayValues[index + 1] || [];
      const normalizedDate = normalizeEntryDate_(displayRow[2] || row[2]);
      return {
        id: String(row[1] || displayRow[1] || ''),
        date: normalizedDate,
        hours: Number(row[3] || displayRow[3] || 0),
        activity: row[4] || displayRow[4] || '',
      };
    })
    .filter((entry) => entry.date);
}
function getCurrentMonthEntries_() {
  const sheet = getOrCreateSheet_('Entries');
  ensureEntriesHeader_(sheet);
  const values = sheet.getDataRange().getValues();
  const displayValues = sheet.getDataRange().getDisplayValues();
  const monthKey = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
  return values.slice(1)
    .map((row, index) => {
      const displayRow = displayValues[index + 1] || [];
      const normalizedDate = normalizeEntryDate_(displayRow[2] || row[2]);
      return {
        id: String(row[1] || displayRow[1] || ''),
        date: normalizedDate,
        hours: Number(row[3] || displayRow[3] || 0),
        activity: row[4] || displayRow[4] || '',
      };
    })
    .filter((entry) => entry.date && entry.date.slice(0, 7) === monthKey);
}

function ensureEntriesHeader_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['createdAt', 'id', 'date', 'hours', 'activity']);
  }
}

function getOrCreateSheet_(name) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function replaceParagraphContaining_(body, needle, replacement) {
  const paragraphs = body.getParagraphs();
  for (let i = 0; i < paragraphs.length; i += 1) {
    const text = paragraphs[i].getText();
    if (text.indexOf(needle) !== -1) {
      paragraphs[i].setText(replacement);
      return true;
    }
  }
  return false;
}

function findHoursTable_(body) {
  const tables = body.getTables();
  return tables.length ? tables[tables.length - 1] : null;
}
function getHoursTableLayout_() {
  try {
    const templateDoc = DocumentApp.openById(CONFIG.templateDocId);
    const templateTable = findHoursTable_(templateDoc.getBody());
    if (!templateTable) {
      return null;
    }

    const dateRow = templateTable.getRow(0);
    const hourRow = templateTable.getRow(1);
    const columnCount = Math.min(dateRow.getNumCells(), hourRow.getNumCells());
    let totalColumnIndex = columnCount - 1;

    for (let i = 0; i < columnCount; i += 1) {
      const text = String(dateRow.getCell(i).getText() || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (text.indexOf('total hours') !== -1) {
        totalColumnIndex = i;
        break;
      }
    }

    return {
      totalColumnIndex: totalColumnIndex,
    };
  } catch (error) {
    return null;
  }
}

function fillHoursTable_(table, entries, total, layout) {
  const dateRow = table.getRow(0);
  const hourRow = table.getRow(1);
  const columnCount = Math.min(dateRow.getNumCells(), hourRow.getNumCells());
  const totalColumnIndex = layout && layout.totalColumnIndex >= 0
    ? Math.min(layout.totalColumnIndex, columnCount - 1)
    : Math.max(0, columnCount - 1);
  const entrySlots = Math.max(0, totalColumnIndex);
  const visible = entries.slice(0, entrySlots);

  clearTableRow_(dateRow);
  clearTableRow_(hourRow);

  for (let i = 0; i < entrySlots; i += 1) {
    const entry = visible[i];
    dateRow.getCell(i).setText(entry ? formatShortDate_(entry.date) : '');
    hourRow.getCell(i).setText(entry ? formatHours_(entry.hours) : '');
  }

  dateRow.getCell(totalColumnIndex).setText('Total Hours');
  hourRow.getCell(totalColumnIndex).setText(formatHours_(total));
}

function clearTableRow_(row) {
  for (let i = 0; i < row.getNumCells(); i += 1) {
    row.getCell(i).setText('');
  }
}

function formatShortDate_(isoDate) {
  const normalized = normalizeEntryDate_(isoDate);
  if (!normalized) {
    return '';
  }
  const date = new Date(normalized + 'T00:00:00');
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'M/d');
}

function normalizeEntryDate_(value) {
  if (!value) {
    return '';
  }

  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const parsed = new Date(text);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return text;
}

function formatHours_(hours) {
  return Number(hours).toFixed(2).replace(/\.00$/, '.0').replace(/(\.\d)0$/, '$1');
}










