import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const extractTextFromPDF = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    standardFontDataUrl: path.join(
      __dirname,
      "../../node_modules/pdfjs-dist/standard_fonts/"
    ) + "/",
  });

  const pdf = await loadingTask.promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    const strings = content.items.map((item) => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
};