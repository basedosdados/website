import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function getTableEdit(id) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allTable (id: "${id}") {
            edges {
              node {
                _id
                slug
                name
                description
                status {
                  _id
                  name
                  slug
                }
                license {
                  _id
                  slug
                }
                partnerOrganization {
                  _id
                  slug
                  name
                }
                pipeline {
                  _id
                  githubUrl
                }
                isDirectory
                publishedBy {
                  id
                  email
                }
                dataCleanedBy {
                  id
                  email
                }
                dataCleaningDescription
                dataCleaningCodeUrl
                rawDataUrl
                auxiliaryFilesUrl
                architectureUrl
                sourceBucketName
                uncompressedFileSize
                compressedFileSize
                numberRows
                numberColumns
                isClosed
              }
            }
          }
        }
        `,
        variables: null,
      },
    });
    const data = res?.data?.data?.allTable?.edges[0]?.node;
    return data;
  } catch (error) {
    console.error(error);
  }
}
