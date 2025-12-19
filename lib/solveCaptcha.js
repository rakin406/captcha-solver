import { createWorker } from "tesseract.js";

/**
 * Solves the captcha detected in the data URI.
 *
 * @param {string} dataUri - The data URI of the captcha image.
 * @returns {number} The result of the calculation in the image.
 */
async function solveCaptcha(dataUri) {
  const worker = await createWorker("eng");
  await worker.setParameters({
    tessedit_char_whitelist: "0123456789+-",
  });
  const {
    data: { text },
  } = await worker.recognize(dataUri);
  return text;
}

export default solveCaptcha;
