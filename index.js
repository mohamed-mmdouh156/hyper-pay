const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/applepay/charge", async (req, res) => {
  const { checkoutId, token } = req.body;
  const paymentData = token.paymentData;

  const formData = new URLSearchParams({
    entityId: "8ac9a4cc975e0e500197a11dc5f0124d",
    paymentType: "DB",
    checkoutId,
    "applePay.tokenVersion": paymentData.version,
    "applePay.data": paymentData.data,
    "applePay.signature": paymentData.signature,
    "applePay.header.ephemeralPublicKey": paymentData.header.ephemeralPublicKey,
    "applePay.header.publicKeyHash": paymentData.header.publicKeyHash,
    "applePay.header.transactionId": paymentData.header.transactionId,
  });

  try {
    const response = await axios.post(
      "https://eu-prod.oppwa.com/v1/payments",
      formData,
      {
        headers: {
          Authorization: "Bearer OGFjZGE0Y2E5NmZjZmU0MzAxOTcxNjVhMGE2YzY0ZDd8cWRuOVIzekxiWFFvY0JScks5Kzo=",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Payment failed", details: error.message });
  }
});

app.get("/", (_, res) => res.send("🟢 Server working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
