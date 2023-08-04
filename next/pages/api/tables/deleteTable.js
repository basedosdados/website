import axios from "axios";
import cookies from 'js-cookie';

const token = cookies.get('token')
const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function deleteTable(id) {
  try {
    const res = await axios({
      method: 'POST',
      url: API_URL,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        query:`
        mutation {
          DeleteTable (id: "${id}")
          {
            ok
          }
        }
        `
      }
    })
    const data = res.data.data.DeleteTable.ok
    return data
  } catch (error) {
    console.error(error)
  }
}
