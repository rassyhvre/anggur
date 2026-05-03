const axios = require("axios");
const fs = require("fs");
// form-data tersedia sebagai sub-dependency dari axios
const FormData = require("form-data");
require("dotenv").config();

const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

const predictImage = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    console.log(`[AI Service] Sending image to ${AI_URL}/predict`);

    const response = await axios.post(
      `${AI_URL}/predict`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000, // 30 detik timeout
        maxContentLength: 10 * 1024 * 1024, // 10MB max
      }
    );

    console.log(`[AI Service] Response:`, JSON.stringify(response.data).substring(0, 200));
    return response.data;

  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.error(`[AI Service] AI server tidak bisa dihubungi di ${AI_URL}. Pastikan AI server berjalan.`);
      throw new Error("AI server tidak tersedia. Pastikan AI server berjalan di " + AI_URL);
    }
    if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      console.error("[AI Service] Timeout menghubungi AI server");
      throw new Error("AI server timeout. Coba lagi nanti.");
    }
    console.error("[AI Service] Error:", error.message);
    throw error;
  }
};

module.exports = {
  predictImage,
};