import axios from "axios";

async function downloadTable(datasetID, tableId, res) {
  try {
    const fileUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${datasetID}/${tableId}/${tableId}.csv.gz`
    const response = await axios({
        url: fileUrl,
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

export default async function handler(req, res) {
  return downloadTable(atob(req.query.p), atob(req.query.q), res)
}