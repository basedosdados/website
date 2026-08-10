import axios from 'axios'
import FormData from 'form-data'
import { getAuthorizationHeader } from '../../../lib/authCookie'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = getAuthorizationHeader(req)
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authentication token' })
  }

  const { id, fileBase64, fileName, contentType } = req.body || {}
  if (!id || !fileBase64) {
    return res.status(400).json({ error: 'Missing id or fileBase64' })
  }

  try {
    const buffer = Buffer.from(fileBase64, 'base64')
    const formData = new FormData()

    formData.append(
      'operations',
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
      })
    )
    formData.append('map', JSON.stringify({ '0': ['variables.file'] }))
    formData.append('0', buffer, {
      filename: fileName || 'profile.jpeg',
      contentType: contentType || 'image/jpeg',
    })

    const response = await axios({
      url: API_URL,
      method: 'POST',
      headers: {
        Authorization: authHeader,
        ...formData.getHeaders(),
      },
      data: formData,
      maxBodyLength: Infinity,
    })

    return res.status(200).json(response.data)
  } catch (error) {
    console.error('updatePictureProfile error:', error.response?.data || error.message)
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: 'Internal Server Error' })
  }
}
