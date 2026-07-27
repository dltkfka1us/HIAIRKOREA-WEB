const xlsx = require('xlsx');
const fs = require('fs');

const FILE_PATH = './database.xlsx.xlsx';

function inspect() {
  const workbook = xlsx.readFile(FILE_PATH);
  const result = {};

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    // Get headers (first row)
    const json = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (json.length > 0) {
      result[sheetName] = {
        rowCount: json.length - 1,
        headers: json[0].filter(h => h), // remove empty headers
      };
    } else {
      result[sheetName] = { rowCount: 0, headers: [] };
    }
  }

  fs.writeFileSync('excel_schema.json', JSON.stringify(result, null, 2));
  console.log('Inspection complete. Output written to excel_schema.json');
}

inspect();
