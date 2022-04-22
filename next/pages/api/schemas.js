import { axiosInstance } from "../../axios";

export function getDatasetSchema() {
  return axiosInstance
    .get(`/bd_dataset_schema`)
    .then(({ data }) => {
      const schema = data.result;

      delete schema.properties.id;
      delete schema.properties.type;
      delete schema.properties.resources;
      delete schema.properties.author;
      delete schema.properties.author_email;
      delete schema.properties.maintainer;
      delete schema.properties.maintainer_email;
      delete schema.properties.state;
      delete schema.properties.license_id;
      delete schema.properties.url;
      delete schema.properties.version;
      delete schema.properties.creator_user_id;
      delete schema.properties.private;
      delete schema.properties.license_title;
      delete schema.properties.num_resources;
      delete schema.properties.organization;
      delete schema.properties.num_tags;
      delete schema.properties.relationships_as_object;
      delete schema.properties.relationships_as_subject;
      delete schema.properties.action__;
      delete schema.properties.visibility;
      delete schema.properties.update_frequency;
      delete schema.properties.observation_level;
      delete schema.properties.ckan_url;
      delete schema.properties.isopen;
      delete schema.properties.metadata_created;
      delete schema.properties.metadata_modified;
      delete schema.properties.cache_last_updated;
      delete schema.properties.description;
      delete schema.properties.short_description;
      delete schema.properties.github_url;
      delete schema.required;

      return schema;
    })
    .catch(() => ({}));
}

export function getBdmTableSchema() {
  return axiosInstance
    .get(`/bd_bdm_table_schema`)
    .then(({ data }) => {
      const schema = data.result;

      delete schema.properties.id;
      delete schema.properties.position;
      delete schema.properties.url;
      delete schema.properties.datastore_active;
      delete schema.properties.format;
      delete schema.properties.hash;
      delete schema.properties.state;
      delete schema.properties.package_id;
      delete schema.properties.created;
      delete schema.properties.last_modified;
      delete schema.properties.resource_type;
      delete schema.properties.metadata_modified;
      delete schema.properties.cache_last_updated;
      delete schema.properties.cache_url;
      delete schema.properties.mimetype;
      delete schema.properties.mimetype_inner;
      delete schema.properties.size;
      delete schema.properties.url_type;
      delete schema.properties.uncompressed_file_size;
      delete schema.properties.compressed_file_size;
      delete schema.required;

      return schema;
    })
    .catch(() => ({}));
}

export function getExternalLinkSchema() {
  return axiosInstance
    .get(`/bd_external_link_schema`)
    .then(({ data }) => {
      const schema = data.result;

      delete schema.properties.id;
      delete schema.properties.position;
      delete schema.properties.datastore_active;
      delete schema.properties.format;
      delete schema.properties.hash;
      delete schema.properties.state;
      delete schema.properties.package_id;
      delete schema.properties.resource_type;
      delete schema.properties.created;
      delete schema.properties.last_modified;
      delete schema.properties.metadata_modified;
      delete schema.properties.cache_last_updated;
      delete schema.properties.cache_url;
      delete schema.properties.mimetype;
      delete schema.properties.mimetype_inner;
      delete schema.properties.size;
      delete schema.properties.url_type;
      delete schema.required;

      return schema;
    })
    .catch(() => ({}));
}

export function getInformationRequestSchema() {
  return axiosInstance
    .get("/bd_information_request_schema")
    .then(({ data }) => {
      const schema = data.result;

      delete schema.properties.id;
      delete schema.properties.position;
      delete schema.properties.url;
      delete schema.properties.datastore_active;
      delete schema.properties.format;
      delete schema.properties.hash;
      delete schema.properties.state;
      delete schema.properties.package_id;
      delete schema.properties.created;
      delete schema.properties.last_modified;
      delete schema.properties.resource_type;
      delete schema.properties.metadata_modified;
      delete schema.properties.cache_last_updated;
      delete schema.properties.cache_url;
      delete schema.properties.mimetype;
      delete schema.properties.mimetype_inner;
      delete schema.properties.size;
      delete schema.properties.url_type;
      delete schema.required;

      return schema;
    })
    .catch(() => ({}));
}

export function getBdmColumnsSchema() {
  return axiosInstance
    .get(`/bd_bdm_columns_schema`)
    .then(({ data }) => {
      const schema = data.result.properties;

      return schema;
    })
    .catch(() => ({}));
}