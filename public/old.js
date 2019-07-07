/* eslint-disable */
var START_ROW = 2;
var START_COL = 1;
var NUM_COLS = 4;
var COLUMN_DESCRIPTIONS = ['Date', 'Name', 'Category', 'Amount'];
var COLUMN_TYPES = ['object', 'string', 'string', 'number'];
var DATA_DIRECTION = SpreadsheetApp.Dimension.ROWS;

// For user sheet
var SHEET_NAME = 'Hello Expense Tracker Data';

// For shared sheet
var SHARED_TRACKER_SHEET_ID = null; // bloop
var SHEET_NAME_IDENTIFIER = 'Hello Expense Tracker';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Hello Expense Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1') // Mobile compatibility
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function loadSheet() {
  var sheet;
  try {
    sheet = loadSharedSheet();
  } catch (err) {
    Logger.log('Unable to retrieve shared sheet: ' + err.message);
  }

  if (!sheet) {
    sheet = loadUserSheet();
  }

  return sheet;
}

function loadUserSheet() {
  var userProperties = PropertiesService.getUserProperties();
  var sheetId = userProperties.getProperty('sheetId');
  var spreadsheet;

  if (sheetId) {
    Logger.log('loaded spreadsheet ' + sheetId);
    spreadsheet = SpreadsheetApp.openById(sheetId);
  } else {
    spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    Logger.log('created spreadsheet ' + spreadsheet.getId());
    spreadsheet.getSheets()[0].appendRow(COLUMN_DESCRIPTIONS);
    userProperties.setProperty('sheetId', spreadsheet.getId());
  }

  return spreadsheet.getSheets()[0];
}

function loadSharedSheet() {
  var spreadsheet = SpreadsheetApp.openById(SHARED_TRACKER_SHEET_ID);
  var sheets = spreadsheet.getSheets();
  var sheet = null;

  for (var i = 0; i < sheets.length; i++) {
    if (~sheets[i].getSheetName().indexOf(SHEET_NAME_IDENTIFIER)) {
      sheet = sheets[i];
      break;
    }
  }

  if (!sheet) {
    Logger.log('Sheet not found - need to create sheet');
    // TODO: Implement this :/ create a sheet that matches. Probably will never need this.

    throw new Error('Sheet not found - need to implemenet');
  }

  return sheet;
}

function loadTemplate(name) {
  return HtmlService.createTemplateFromFile(name)
    .evaluate()
    .getContent();
}

function logUIEvent(eventStr) {
  Logger.log({ uiEvent: eventStr });
}

function parseRow(row) {
  if (
    row.some(function(cell, index) {
      return typeof cell !== COLUMN_TYPES[index];
    })
  ) {
    return null;
  }

  var rowObj = {
    date: Utilities.formatDate(row[0], 'PST', 'MM/dd/yyyy'),
    name: row[1],
    category: row[2],
    amount: row[3],
  };

  return rowObj;
}

/* Interact with Spreadsheet functions */

function addEntry(entry) {
  Logger.log(entry);

  var today = Utilities.formatDate(new Date(), 'PST', 'MM/dd/yyyy');
  var rangeData = [
    today,
    entry['entry-name'],
    entry['entry-category'],
    entry['entry-amount'],
  ];

  var sheet = loadSheet();
  var range = sheet.getRange(START_ROW, START_COL, 1, NUM_COLS);

  range.insertCells(DATA_DIRECTION);

  range.setValues([rangeData]);

  return entry;
}

function getEntries() {
  var sheet = loadSheet();
  var startRow = START_ROW;
  var startCol = START_COL;
  var lastRow = sheet.getLastRow();
  var numCols = NUM_COLS;

  if (lastRow < startRow) {
    return null;
  }

  var data = sheet.getSheetValues(startRow, startCol, lastRow - 1, numCols);
  data = data.reduce(function(acc, row, index) {
    var rowObj = parseRow(row);
    if (rowObj) {
      rowObj['index'] = index + START_ROW;
      acc.push(rowObj);
    }
    return acc;
  }, []);

  Logger.log(data);
  return data;
}

function deleteEntry(entryNum) {
  var startRow = START_ROW,
    startCol = START_COL,
    numCols = NUM_COLS;
  var sheet = loadSheet();

  var rows = sheet.getSheetValues(entryNum, startCol, 1, numCols);
  var rowObj = parseRow(rows[0]);
  rowObj['index'] = entryNum;

  var range = sheet.getRange(entryNum, START_COL, 1, NUM_COLS);

  range.deleteCells(DATA_DIRECTION);

  Logger.log(rowObj);
  return rowObj;
}
