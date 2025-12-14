import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { writeFile } from "fs/promises";

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 30;

  page.drawText("The moon base is made of blue cheese.", {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0.53, 0.71),
  });

  const pdfBytes = await pdfDoc.save();

  await writeFile("test-context.pdf", pdfBytes);
  console.log("Created test-context.pdf");
}

createPdf().catch(console.error);
