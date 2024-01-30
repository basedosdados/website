import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/account/account_activate_confirm`

export default async function activeAccount(
  id,
  token
) {
  try {
    const res = await axios.post(`${API_URL}/${id}/${token}/`)
    return res
  } catch (error) {
    console.error(error)
  }
}
