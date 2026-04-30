const xlsx = require("xlsx");

function parseExcelToJSON(filePath) {
  const workbook = xlsx.readFile(filePath);

  // first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const raw = xlsx.utils.sheet_to_json(sheet, {
    defval: "" // keeps empty cells
  });

  return raw;
}

module.exports = { parseExcelToJSON };