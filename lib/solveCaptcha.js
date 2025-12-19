import { createWorker } from "tesseract.js";
import sharp from "sharp";
import { evaluate } from "mathjs";

/**
 * Solves the captcha detected in the data URI.
 *
 * @param {string} dataUri - The data URI of the captcha image.
 * @returns {number} The result of the calculation in the image.
 */
async function solveCaptcha(dataUri) {
  // Configure text detection
  const worker = await createWorker("eng");
  await worker.setParameters({
    tessedit_char_whitelist: "0123456789+-=?",
  });

  // Get the equation
  const imageBuffer = await processImage(dataUri);
  let {
    data: { text },
  } = await worker.recognize(imageBuffer);
  text = text.split("=")[0];

  // Calculate
  const result = evaluate(text);
  return result;
}

/**
 * Applies filters to the captcha image.
 *
 * @param {string} dataUri - The data URI of the captcha image.
 * @returns {Buffer} The output buffer of the processed image.
 */
async function processImage(dataUri) {
  // Split the string and get the base64 part
  const base64String = dataUri.split(",")[1];

  // Convert the base64 string to a Buffer
  const input = Buffer.from(base64String, "base64");

  // Modify the image
  const output = await sharp(input).blur().median().toBuffer();

  return output;
}

export default solveCaptcha;
