import axios from "axios";
import cookies from "js-cookie";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function updatePictureProfile(id, file) {
  let token = cookies.get("token") || "";

  const formData = new FormData();

  formData.append(
    "operations",
    JSON.stringify({
      query: `
    mutation ($file: Upload!) {
      CreateUpdateAccount(input: {id: ${id} , picture: $file}) {
        account {
          email
        }
      }
    }
    `,
      variables: {
        file: null,
      },
    }),
  );
  formData.append(
    "map",
    JSON.stringify({
      0: ["variables.file"],
    }),
  );
  formData.append("0", file);

  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    const data = res;
    return data;
  } catch (error) {
    return error;
  }
}
