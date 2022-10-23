import { ExpandableTable } from "../molecules/ExpandableTable";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
  unionArrays,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { SchemaForm } from "../molecules/SchemaForm";
import { deleteDataset, updateDataset } from "../../pages/api/datasets";
import { getDatasetSchema } from "../../pages/api/schemas";

export function MetadataPage({
  translations,
  dataset,
  availableOptionsTranslations,
}) {
  const _dataset = { ...dataset };
  const unionResourceFields = [
    "spatial_coverage",
    "temporal_coverage",
    "update_frequency",
  ];

  _dataset["groups"] = _dataset["groups"].map((t) => t.display_name);
  _dataset["tags"] = _dataset["tags"].map((t) => t.display_name);

  _dataset["resources"] = _dataset["resources"].map((resource) => {
    const _resource = { ...resource };

    function fixSpatialCoverage(sc) {
      if (sc == null) return [];

      if (typeof sc === "object") {
        if (Object.keys(sc).length === 0) return [];

        return [sc.continent, sc.country];
      }

      return sc;
    }

    _resource["spatial_coverage"] = fixSpatialCoverage(
      _resource["spatial_coverage"]
    );

    return _resource;
  });

  unionResourceFields.forEach(
    (f) =>
      (_dataset[f] = unionArrays(
        _dataset.resources
          .map((r) => (r[f] ? (typeof r[f] === "array" ? r[f] : [r[f]]) : []))
          .sort()
      ))
  );

  return (
    <BaseResourcePage
      title="Metadados do conjunto"
      removeFunction={async () => {
        await deleteDataset(dataset)
        window.history.pushState({}, "", "/dataset")
      }}
      formComponent={
        <SchemaForm
          data={dataset}
          updateFunction={updateDataset}
          loadSchemaFunction={getDatasetSchema}
          schemaName="Dataset"
          prepareData={(data) => {
            data.maintainer = data.maintainer || "";
            data.maintainer_email = data.maintainer_email || "";
            data.version = data.version || "";
            data.type = "dataset";

            return data;
          }}
        />
      }
    >
      <ExpandableTable
        headers={["nome", "valor"]}
        values={formatObjectsInArray(
          translate(
            translations,
            availableOptionsTranslations,
            filterOnlyValidValues(_dataset, [
              "id",
              "name",
              "groups",
              "tags",
              "spatial_coverage",
              "temporal_coverage",
              "update_frequency",
              "observation_level",
              "ckan_url",
              "github_url",
            ])
          )
        )}
      />
    </BaseResourcePage>
  );
}
