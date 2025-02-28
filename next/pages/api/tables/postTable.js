import axios from "axios";
import cookies from "js-cookie";

const token = cookies.get("token");
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function postTable(
  {
    slug,
    name,
    description,
    status,
    license,
    partnerOrganization,
    pipeline,
    isDirectory,
    publishedBy,
    dataCleanedBy,
    dataCleaningDescription,
    dataCleaningCodeUrl,
    rawDataUrl,
    auxiliaryFilesUrl,
    architectureUrl,
    sourceBucketName,
    uncompressedFileSize,
    compressedFileSize,
    numberRows,
    numberColumns,
    isClosed,
  },
  dataset,
  id,
) {
  try {
    const newDescription = description.replaceAll("\n", "\\n");
    const newDataCleaningDescription = dataCleaningDescription.replaceAll(
      "\n",
      "\\n",
    );

    const res = await axios({
      method: "POST",
      url: API_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        query: `
        mutation {
          CreateUpdateTable (input:
            {
              ${id ? `id: "${id}"` : ""}
              dataset: "${dataset}",
              slug: "${slug}"
              name: "${name}"
              namePt: "${name}"
              description: "${newDescription}"
              descriptionPt: "${newDescription}"
              status: "${status}",
              license: "${license}",
              partnerOrganization: "${partnerOrganization}",
              pipeline: "${pipeline}",
              isDirectory: ${isDirectory},
              publishedBy: "${publishedBy}",
              dataCleanedBy: "${dataCleanedBy}",
              dataCleaningDescription: "${newDataCleaningDescription}",
              dataCleaningCodeUrl: "${dataCleaningCodeUrl}",
              rawDataUrl: "${rawDataUrl}",
              auxiliaryFilesUrl: "${auxiliaryFilesUrl}",
              architectureUrl: "${architectureUrl}",
              sourceBucketName: "${sourceBucketName}",
              uncompressedFileSize: ${uncompressedFileSize},
              compressedFileSize: ${compressedFileSize},
              numberRows: ${numberRows},
              numberColumns: ${numberColumns},
              isClosed: ${isClosed},
            }
          )
          {
            table {
              _id
            }
            errors {
              messages
            }
          }
        }
        `,
      },
    });

    const data = res.data.data.CreateUpdateTable.table._id;
    return data;
  } catch (error) {
    console.error(error);
  }
}
