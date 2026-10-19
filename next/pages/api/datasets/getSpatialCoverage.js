import axios from "axios";
import { capitalize } from "lodash";
import { validate as isUuid } from "uuid";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;
const LOCALES = ["pt", "en", "es"];

export default async function getSpatialCoverage(req, res) {
  const { id, locale = "pt" } = req.query || {};
  const safeLocale = LOCALES.includes(locale) ? locale : "pt";

  if (!id || !isUuid(id)) {
    return res.status(400).json({ spatialCoverage: null });
  }

  const field = `spatialCoverageName${capitalize(safeLocale)}`;

  try {
    const response = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: `
        query {
          allDataset (id: "${id}") {
            edges {
              node {
                _id
                ${field}
              }
            }
          }
        }
        `,
        variables: null,
      },
    });

    const node = response?.data?.data?.allDataset?.edges?.[0]?.node;
    return res.status(200).json({ spatialCoverage: node?.[field] || null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ spatialCoverage: null });
  }
}
