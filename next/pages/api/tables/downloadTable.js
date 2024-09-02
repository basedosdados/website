import axios from "axios";

const API_URL= `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`

async function validateToken(token) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: { query: ` mutation { verifyToken ( token: "${token}" ) { payload } }`
      }
    })
    const data = res.data?.data?.verifyToken?.payload
    return data
  } catch (error) {
    console.error(error)
    return "err"
  }
}

async function downloadTable(url, datasetID, tableId, token, res) {
  let payloadToken
  if(token !== null) payloadToken = await validateToken(token)

  const urlDownloadOpen = process.env.URL_DOWNLOAD_OPEN.replace("gs://", "")
  const urlDownloadClosed = process.env.URL_DOWNLOAD_CLOSED.replace("gs://", "")

  const prefixUrl = "https://storage.googleapis.com/"

  let fileUrl = ""

  if(payloadToken?.is_subscription_active === true) {
    fileUrl = `${prefixUrl}${urlDownloadClosed}${datasetID}/${tableId}/${tableId}_bdpro.csv.gz`
  }else if(url === "free") {
    fileUrl =`${prefixUrl}${urlDownloadOpen}${datasetID}/${tableId}/${tableId}.csv.gz`
  }

  try {
    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream'
    })

    res.setHeader('Content-Disposition', `attachment; filename=${datasetID}_${tableId}.csv.gz`)
    res.setHeader('Content-Type', 'application/gzip')

    response.data.pipe(res)
  } catch (error) {
    try {
      const response = await axios({
        url: `${prefixUrl}${urlDownloadOpen}${datasetID}/${tableId}/${tableId}.csv.gz`,
        method: 'GET',
        responseType: 'stream'
    })

      res.setHeader('Content-Disposition', `attachment; filename=${datasetID}_${tableId}.csv.gz`)
      res.setHeader('Content-Type', 'application/gzip')

      response.data.pipe(res)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error downloading the file' })
    }
  }
}

export default async function handler(req, res) {
  const token = req.cookies.token || null

  if(atob(req.query.d) === "false") return res.status(500).json({error: "Você não tem permissão para fazer esse download"})

  return downloadTable(atob(req.query.s), atob(req.query.p), atob(req.query.q), token, res)
}