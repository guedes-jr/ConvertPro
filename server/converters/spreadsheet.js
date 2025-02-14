import XLSX from 'xlsx';
import { join, dirname } from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function convertSpreadsheet(filePath, convertedFileName) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const csv = XLSX.utils.sheet_to_csv(sheet);

  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const outputPath = join(tempDir, convertedFileName);
  await fs.writeFile(outputPath, csv);

  await fs.remove(filePath);

  return outputPath;
}