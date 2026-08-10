import axios from "axios";
import { validate as isUuid } from "uuid";

const GRAPHQL_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/graphql`;

async function getTableColumns(id) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tables/${id}/columns/`;

  const res = await axios({
    url: API_URL,
    method: "GET",
  });
  return res?.data;
}

async function getLocalizedColumns(id) {
  const res = await axios({
    url: GRAPHQL_URL,
    method: "POST",
    data: {
      query: `
      query {
        allColumn(table_Id: "${id}", first: 1000) {
          edges {
            node {
              _id
              name
              descriptionPt
              descriptionEn
              descriptionEs
              observationsPt
              observationsEn
              observationsEs
            }
          }
        }
      }
      `,
    },
  });
  return res?.data?.data?.allColumn?.edges?.map((edge) => edge.node) || [];
}

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || !isUuid(id)) {
    return res.status(400).json({ error: "Invalid or missing ID", success: false });
  }

  const [columnsResult, localizedResult] = await Promise.allSettled([
    getTableColumns(id),
    getLocalizedColumns(id),
  ]);

  if (columnsResult.status !== "fulfilled" || !columnsResult.value) {
    console.error(columnsResult.reason);
    return res.status(500).json({ error: "err", success: false });
  }

  let resource = columnsResult.value;

  if (localizedResult.status === "fulfilled" && Array.isArray(resource)) {
    const localizedById = {};
    const localizedByName = {};
    localizedResult.value.forEach((node) => {
      if (node?._id) localizedById[node._id] = node;
      if (node?.name) localizedByName[node.name] = node;
    });

    resource = resource.map((column) => {
      const localized = localizedById[column.id] || localizedByName[column.name];
      if (!localized) return column;

      return {
        ...column,
        descriptionPt: localized.descriptionPt ?? column.description,
        descriptionEn: localized.descriptionEn,
        descriptionEs: localized.descriptionEs,
        observationsPt: localized.observationsPt ?? column.observations,
        observationsEn: localized.observationsEn,
        observationsEs: localized.observationsEs,
      };
    });
  } else if (localizedResult.status === "rejected") {
    console.error("Failed to fetch localized column fields:", localizedResult.reason);
  }

  return res.status(200).json({ resource, success: true });
}
