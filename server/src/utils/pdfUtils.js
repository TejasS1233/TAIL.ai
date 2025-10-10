import fs from "fs";
import { PDFDocument } from "pdf-lib";

export const getPdfPageCount = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBuffer);
  return pdfDoc.getPageCount();
};
