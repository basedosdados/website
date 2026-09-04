import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function handler(req, res) {
  const { amount, apiKey } = req.body;
  const token = req.cookies.token;

  try {
    const response = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query: `
          mutation {
            createApiCreditPaymentIntent(
              amount: ${amount},
              apiKey: "${apiKey}"
            ) {
              clientSecret
            }
          }
        `
      }
    });

    res.status(200).json({
      clientSecret: response.data.data.createApiCreditPaymentIntent.clientSecret
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment intent" });
  }
} 