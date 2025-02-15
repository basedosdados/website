import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

export default async function getBigTableQuery(
  id,
  columns,
  includeTranslation,
) {
  try {
    const res = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
          query {
            getTableOneBigTableQuery (tableId: "${id}", columns: [${columns.map((item) => `"${item}"`).join(", ")}], includeTableTranslation: ${includeTranslation})
          }
        `,
        variables: null,
      },
    });
    const data = res.data.data.getTableOneBigTableQuery;
    return data;
  } catch (error) {
    console.error(error);
    return "err";
  }
}
