import { getDocument } from 'pdfjs-dist';
import { AppError } from './error-handling';

export async function processPDF(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let textContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => 'str' in item ? item.str : '')
        .join(' ');
      textContent += text + '\n';
    }
    
    return textContent;
  } catch (error) {
    throw new AppError('Failed to process PDF', 400, 'PDF_PROCESSING_ERROR');
  }
}