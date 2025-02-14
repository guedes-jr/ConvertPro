import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { join, dirname } from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function convertImage(filePath, format) {
  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const convertedFileName = `${uuidv4()}.${format.toLowerCase()}`;
  const outputPath = join(tempDir, convertedFileName);

  await sharp(filePath)
    .toFormat(format)
    .toFile(outputPath);

  await fs.remove(filePath);

  return outputPath;
}