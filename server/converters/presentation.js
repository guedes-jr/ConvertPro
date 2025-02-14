import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';

export async function convertPresentation(filePath) {
  // Cria um novo documento PDF
  const pdfDoc = await PDFDocument.create();
  
  // Adiciona uma página de exemplo
  const page = pdfDoc.addPage();
  
  // Adiciona texto básico
  page.drawText('Apresentação convertida para PDF', {
    x: 50,
    y: page.getHeight() - 50,
    size: 24,
    color: rgb(0, 0, 0),
  });

  // Salva o PDF
  const outputPath = filePath.replace('.ppt', '.pdf');
  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, pdfBytes);

  return outputPath;
}