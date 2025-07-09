const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/applepay/charge", async (req, res) => {
  const { checkoutId, token } = req.body;

  try {
    const formData = new URLSearchParams();
    formData.append("entityId", process.env.ENTITY_ID);
    formData.append("paymentBrand", "APPLEPAY");
    formData.append("paymentType", "DB");
    formData.append("token", JSON.stringify(token));
    formData.append("checkoutId", checkoutId);

    const response = await axios.post(
      "https://eu-prod.oppwa.com/v1/payments",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error sending payment:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process Apple Pay" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});