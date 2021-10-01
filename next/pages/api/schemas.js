import { axiosInstance } from "../../axios";

export function getBdmTableSchema() {
  return axiosInstance
    .get(`/bd_bdm_table_schema`)
    .then(({ data }) => {
      const schema = data.result;

      delete schema.properties.created;
      delete schema.properties.last_modified;
      delete schema.properties.metadata_modified;
      delete schema.properties.last_updated;
      delete schema.properties.cache_last_updated;

      return schema;
    })
    .catch(() => ({}));
}

export function getExternalLinkSchema() {
  return axiosInstance
    .get(`/bd_external_link_schema`)
    .then(({ data }) => {
      const schema = data.result;

      delete schema.properties.created;
      delete schema.properties.last_modified;
      delete schema.properties.metadata_modified;
      delete schema.properties.last_updated;
      delete schema.properties.cache_last_updated;

      return schema;
    })
    .catch(() => ({}));
}

export function getDatasetSchema() {
  return axiosInstance
    .get(`/bd_dataset_schema`)
    .then(({ data }) => {
      const schema = data.result;

      delete schema.properties.resources;
      delete schema.properties.metadata_created;
      delete schema.properties.metadata_modified;
      delete schema.properties.cache_last_updated;
      delete schema?.properties?.spatial_coverage;
      delete schema?.properties?.temporal_coverage;

      return schema;
    })
    .catch(() => ({}));
}
