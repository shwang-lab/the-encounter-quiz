/**
 * The Encounter — Listening Quiz — Google Sheets backend
 *
 * SETUP: see README.md in the project root for step-by-step
 * instructions on where to paste this and how to deploy it.
 *
 * This script expects to live inside the Google Sheet that will
 * store submissions (Extensions > Apps Script from within the Sheet).
 * It auto-creates two tabs the first time it runs:
 *   - "Config"      (A1: label, B1: today's class code)
 *   - "Submissions" (header row + one row per student submission)
 */

var INSTRUCTOR_PASSWORD = "EngthruFilms100"; // keep in sync with js/config.js

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "getCode") {
    var configSheet = getOrCreateConfigSheet(ss);
    var code = configSheet.getRange("B1").getValue();
    return jsonResponse({ code: String(code) });
  }

  if (action === "getResults") {
    if (e.parameter.password !== INSTRUCTOR_PASSWORD) {
      return jsonResponse({ error: "unauthorized" });
    }
    var dataSheet = getOrCreateSubmissionsSheet(ss);
    var values = dataSheet.getDataRange().getValues();
    var headers = values.shift();
    var results = values
      .filter(function (row) { return row[1] !== ""; }) // skip blank rows
      .map(function (row) {
        var obj = {};
        headers.forEach(function (h, i) { obj[h] = row[i]; });
        return obj;
      });
    return jsonResponse({ results: results });
  }

  return jsonResponse({ error: "unknown action" });
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  if (data.action === "setCode") {
    if (data.password !== INSTRUCTOR_PASSWORD) {
      return jsonResponse({ error: "unauthorized" });
    }
    var configSheet = getOrCreateConfigSheet(ss);
    configSheet.getRange("B1").setValue(data.code);
    return jsonResponse({ ok: true });
  }

  if (data.action === "submit") {
    var dataSheet = getOrCreateSubmissionsSheet(ss);
    dataSheet.appendRow([
      new Date(),
      data.name,
      data.score,
      data.total,
      JSON.stringify(data.answers || {})
    ]);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "unknown action" });
}

function getOrCreateConfigSheet(ss) {
  var s = ss.getSheetByName("Config");
  if (!s) {
    s = ss.insertSheet("Config");
    s.getRange("A1").setValue("ClassCode");
    s.getRange("B1").setValue("0000");
  }
  // Force plain-text formatting so codes like "0716" keep their
  // leading zero instead of being auto-converted to a number.
  s.getRange("B1").setNumberFormat("@");
  return s;
}

function getOrCreateSubmissionsSheet(ss) {
  var s = ss.getSheetByName("Submissions");
  if (!s) {
    s = ss.insertSheet("Submissions");
    s.appendRow(["Timestamp", "Name", "Score", "Total", "AnswersJSON"]);
  }
  return s;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
