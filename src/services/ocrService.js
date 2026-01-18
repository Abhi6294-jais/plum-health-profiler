const Tesseract = require('tesseract.js');
const fs = require('fs');

async function extractTextFromImage(filePath) {
  try {
    console.log(`[OCR] Processing image: ${filePath}`);
    const result = await Tesseract.recognize(filePath, 'eng');
    
    // Delete the file after reading to keep folder clean
    fs.unlinkSync(filePath);

    return result.data.text.trim();
  } catch (error) {
    console.error("[OCR] Error:", error);
    throw new Error("Failed to extract text from image.");
  }
}

module.exports = { extractTextFromImage };