/* eslint-disable */
var START_ROW = 2;
var START_COL = 1;
var NUM_COLS = 3;
var SHEET_NAME = 'Hello Expense Tracker Data';

function doGet() {
    return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setTitle('Simple Expense Tracker')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1') // Mobile compatibility
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function loadSheet() {
    var userProperties = PropertiesService.getUserProperties();
    var sheetId = userProperties.getProperty('sheetId');
    var spreadsheet;

    if (sheetId) {
        Logger.log('loaded spreadsheet ' + sheetId);
        spreadsheet = SpreadsheetApp.openById(sheetId);
    } else {
        spreadsheet = SpreadsheetApp.create(SHEET_NAME);
        Logger.log('created spreadsheet ' + spreadsheet.getId());
        spreadsheet.getSheets()[0].appendRow(['Date', 'Expenses', 'Amount']);
        userProperties.setProperty('sheetId', spreadsheet.getId());
    }

    return spreadsheet.getSheets()[0];
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
    if (typeof row[0] !== 'object' || typeof row[1] !== 'string' || typeof row[2] !== 'number') {
        return null;
    }

    var rowObj = {
        date: Utilities.formatDate(row[0], 'PST', 'MM/dd/yyyy'),
        name: row[1],
        amount: row[2]
    };

    return rowObj;
}

/* Interact with Spreadsheet functions */

function addEntry(entry) {
    Logger.log(entry);

    var sheet = loadSheet();

    var today = Utilities.formatDate(new Date(), 'PST', 'MM/dd/yyyy');

    sheet.appendRow([today, entry['entry-name'], entry['entry-amount']]);
    entry['date'] = today;

    return entry;
}

function getEntries() {
    var sheet = loadSheet();
    var startRow = START_ROW;
    var startCol = START_COL;
    var lastRow = sheet.getLastRow();
    var numCols = NUM_COLS;

    function compareDesc(a, b) {
        if (a > b) {
            return -1;
        } else {
            return 1;
        }
    }

    if (lastRow < startRow) {
        return null;
    }

    var data = sheet.getSheetValues(startRow, startCol, lastRow - 1, numCols);
    data = data
        .reduce(function(acc, row, index) {
            var rowObj = parseRow(row);
            if (rowObj) {
                rowObj['index'] = index + 2;
                acc.push(rowObj);
            }
            return acc;
        }, [])
        .sort(function(a, b) {
            return compareDesc(a['index'], b['index']);
        });

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

    sheet.deleteRow(entryNum);

    Logger.log(rowObj);
    return rowObj;
}
