import { axiosInstance } from "../../axios";

export function getSchema() {
  return axiosInstance
    .get(`/bd_dataset_schema`)
    .then(({ data }) => {
      const schema = data.result;

      schema.properties["bdm_tables"] = {
        default: [],
        title: "Tabelas BDM",
        type: "array",
        items: { $ref: "#/definitions/BdmTable" },
      };

      schema.properties["external_links"] = {
        default: [],
        title: "Links Externos",
        type: "array",
        items: { $ref: "#/definitions/ExternalLink" },
      };

      console.log(schema);

      delete schema.properties.resources;
      delete schema.properties.metadata_created;
      delete schema.properties.metadata_modified;
      delete schema.properties.cache_last_updated;
      delete schema.definitions.BdmTable.properties.created;
      delete schema.definitions.BdmTable.properties.last_modified;
      delete schema.definitions.BdmTable.properties.metadata_modified;
      delete schema.definitions.BdmTable.properties.last_updated;
      delete schema.definitions.BdmTable.properties.cache_last_updated;
      delete schema.definitions.ExternalLink.properties.created;
      delete schema.definitions.ExternalLink.properties.last_modified;
      delete schema.definitions.ExternalLink.properties.last_updated;
      delete schema.definitions.ExternalLink.properties.metadata_modified;
      delete schema.definitions.ExternalLink.properties.cache_last_updated;

      return schema;
    })
    .catch(() => ({}));
}
