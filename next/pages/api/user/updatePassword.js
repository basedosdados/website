import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function updatePassword({ id, password }, token) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        query: `
        mutation {
          CreateUpdateAccount (input:
            {
              id: "${id}"
              password: "${password}"
            }  
          ) {
            clientMutationId
          }
        }`,
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

  const object = {
    id: atob(req.query.b),
    password: atob(req.query.p),
  };
  const result = await updatePassword(object, token);

  if (result.errors) return res.status(500).json({ error: result.errors });
  if (result === "err") return res.status(500).json({ error: "err" });
  if (result.data.CreateUpdateAccount === null)
    return res.status(500).json({ error: "err" });

  res.status(200).json({ success: true });
}
