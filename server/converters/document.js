import mammoth from 'mammoth';
import { Document, Packer, Paragraph } from 'docx';
import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function convertPDFtoDOCX(filePath, convertedFileName) {
  // Lê o arquivo PDF
  const pdfBytes = await fs.readFile(filePath);
  const data = await pdfParse(pdfBytes);
  
  // Extrai o texto do PDF
  const textContent = data.text.split('\n');

  // Cria um novo documento DOCX com o texto extraído
  const doc = new Document({
    sections: [{
      properties: {},
      children: textContent.map(text => new Paragraph(text))
    }]
  });

  // Salva o documento DOCX
  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const outputPath = join(tempDir, convertedFileName);
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);

  await fs.remove(filePath);

  return outputPath;
}

export async function convertDOCXtoPDF(filePath, convertedFileName) {
  // Lê o arquivo DOCX e converte para HTML
  const { value: html } = await mammoth.convertToHtml({ path: filePath });

  // Converte o HTML para PDF usando puppeteer
  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const outputPath = join(tempDir, convertedFileName);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();

  await fs.remove(filePath);

  return outputPath;
}

export async function convertTXTtoDOCX(filePath, convertedFileName) {
  // Lê o arquivo TXT
  const textContent = await fs.readFile(filePath, 'utf-8');
  
  // Cria um novo documento DOCX com o texto extraído
  const doc = new Document({
    sections: [{
      properties: {},
      children: textContent.split('\n').map(text => new Paragraph(text))
    }]
  });

  // Salva o documento DOCX
  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const outputPath = join(tempDir, convertedFileName);
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);

  await fs.remove(filePath);

  return outputPath;
}

export async function convertDOCXtoTXT(filePath, convertedFileName) {
  // Lê o arquivo DOCX e converte para texto
  const { value: text } = await mammoth.extractRawText({ path: filePath });

  // Salva o texto em um arquivo TXT
  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const outputPath = join(tempDir, convertedFileName);
  await fs.writeFile(outputPath, text);

  await fs.remove(filePath);

  return outputPath;
}

export async function convertHTMLtoPDF(filePath, convertedFileName) {
  // Lê o arquivo HTML
  const htmlContent = await fs.readFile(filePath, 'utf-8');

  // Converte o HTML para PDF usando puppeteer
  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const outputPath = join(tempDir, convertedFileName);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();

  await fs.remove(filePath);

  return outputPath;
}

export async function convertPDFtoHTML(filePath, convertedFileName) {
  // Lê o arquivo PDF
  const pdfBytes = await fs.readFile(filePath);
  const data = await pdfParse(pdfBytes);
  
  // Extrai o texto do PDF
  const textContent = data.text;

  // Salva o texto em um arquivo HTML simples
  const htmlContent = `<html><body>${textContent.replace(/\n/g, '<br>')}</body></html>`;
  const tempDir = join(__dirname, '..', 'temp');
  await fs.ensureDir(tempDir);

  const outputPath = join(tempDir, convertedFileName);
  await fs.writeFile(outputPath, htmlContent);

  await fs.remove(filePath);

  return outputPath;
}