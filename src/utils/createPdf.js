// generate-pdfs.js
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

async function createPdf(title, user) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const content = `
${title}

Name: ${user.firstName} ${user.middleName} ${user.lastName}
DOB: ${user.dateOfBirth}
Gender: ${user.gender}
Phone: ${user.phone}
Employee Series: ${user.employeeSeries}
Joining Date: ${user.joiningDate}
`;

  page.drawText(content, {
    x: 50,
    y: 750,
    size: 12,
    font,
    maxWidth: 500,
  });

  return await pdfDoc.save();
}

async function generateAllPdfs(user, pdfNames) {
  const outputDir = path.join(process.cwd(), "generated-pdfs");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const name of pdfNames) {
    const pdfBytes = await createPdf(name, user);
    const fileName = `${name.replace(/\s+/g, "_")}.pdf`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`✔ Created: ${fileName}`);
  }
  console.log("\n🎉 All PDFs generated successfully!");
}

// --------------------
// Example usage
// --------------------

const user = {
  firstName: "Rohan",
  middleName: "Pratap",
  lastName: "Negi",
  dateOfBirth: "1997-11-22",
  gender: "Male",
  phone: "9123456780",
  employeeSeries: "ES-105",
  joiningDate: "2026-04-24",
};

const pdfNames = [
  "Personal Details",
  "Employment Record",
  "HR Summary",
  "Offer Letter",
  "ID Card",
];

generateAllPdfs(user, pdfNames);