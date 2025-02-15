import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function createSubscription({ id, coupon, token }) {
  const query =
    coupon !== ""
      ? `
      mutation {
        createStripeSubscription (priceId: ${id}, coupon: "${coupon}") {
          clientSecret
        }
      }
    `
      : `
      mutation {
        createStripeSubscription (priceId: ${id}) {
          clientSecret
        }
      }
    `;

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        query: query,
      },
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token;
  const result = await createSubscription({
    id: atob(req.query.p),
    coupon: atob(req.query.c),
    token: token,
  });

  if (result.errors) return res.status(500).json({ error: result.errors });
  if (result === "err") return res.status(500).json({ error: "err" });

  res.status(200).json(result?.data?.createStripeSubscription?.clientSecret);
}
