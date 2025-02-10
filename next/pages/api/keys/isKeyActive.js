import axios from "axios";
import { cleanGraphQLResponse } from "../../../utils";
import crypto from "crypto";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function isKeyActive(id) {
  try {
    // Hash the API key
    const hash = crypto
      .createHash('sha256')
      .update(id)
      .digest('hex');

    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allDataapikey (hash: "${hash}") {
            edges {
              node {
                isActive
                createdAt
                expiresAt
              }
            }
          }
        }
        `,
        variables: {
          hash: hash
        }
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errors: error.response?.data?.errors?.map(e => e.message)
    });
    return "err";
  }
}

export default async function handler(req, res) {
  const { id } = req.query;
  const result = await isKeyActive(id);

  if (result.errors) return res.status(500).json({ error: result.errors, success: false });
  if (result === "err") return res.status(500).json({ error: "err", success: false });

  return res.status(200).json({ resource: cleanGraphQLResponse(result?.data?.allDataapikey?.edges[0]?.node), success: true });
}
