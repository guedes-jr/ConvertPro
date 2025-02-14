import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { convertPDFtoDOCX, convertDOCXtoPDF, convertTXTtoDOCX, convertDOCXtoTXT, convertHTMLtoPDF, convertPDFtoHTML } from './converters/document.js';
import { convertImage } from './converters/image.js';
import { convertSpreadsheet } from './converters/spreadsheet.js';
import { convertPresentation } from './converters/presentation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Rota para conversão de arquivos
app.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { from, to } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    let convertedFilePath;
    const convertedFileName = `${uuidv4()}.${to.toLowerCase()}`;

    switch (`${from}_${to}`.toLowerCase()) {
      case 'pdf_docx':
        convertedFilePath = await convertPDFtoDOCX(file.path, convertedFileName);
        break;
      case 'docx_pdf':
        convertedFilePath = await convertDOCXtoPDF(file.path, convertedFileName);
        break;
      case 'txt_docx':
        convertedFilePath = await convertTXTtoDOCX(file.path, convertedFileName);
        break;
      case 'docx_txt':
        convertedFilePath = await convertDOCXtoTXT(file.path, convertedFileName);
        break;
      case 'html_pdf':
        convertedFilePath = await convertHTMLtoPDF(file.path, convertedFileName);
        break;
      case 'pdf_html':
        convertedFilePath = await convertPDFtoHTML(file.path, convertedFileName);
        break;
      case 'jpg_png':
      case 'png_jpg':
        convertedFilePath = await convertImage(file.path, to.toLowerCase(), convertedFileName);
        break;
      case 'xlsx_csv':
        convertedFilePath = await convertSpreadsheet(file.path, convertedFileName);
        break;
      case 'ppt_pdf':
        convertedFilePath = await convertPresentation(file.path, convertedFileName);
        break;
      default:
        return res.status(400).json({ error: 'Conversão não suportada' });
    }

    res.download(convertedFilePath);
  } catch (error) {
    console.error('Erro na conversão:', error);
    res.status(500).json({ error: 'Erro ao converter arquivo' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});