import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ExpandableTable } from "../molecules/ExpandableTable";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
  unionArrays,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { DatasetEditPage } from "./DatasetEditPage";

export function MetadataPage({ translations, dataset }) {
  const [editing, setEditing] = useState(false);
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

        return [sc.continent[0], sc.country[0]];
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

  if (editing) {
    return <DatasetEditPage dataset={dataset} />;
  }

  return (
    <BaseResourcePage
      buttonText="Editar"
      onClick={() => setEditing(true)}
      buttonRightIcon={<FontAwesomeIcon icon={faPen} />}
      title="Metadados do conjunto"
    >
      <ExpandableTable
        headers={["nome", "valor"]}
        values={formatObjectsInArray(
          translate(
            translations,
            filterOnlyValidValues(_dataset, [
              "id",
              "groups",
              "tags",
              "spatial_coverage",
              "temporal_coverage",
              "update_frequency",
              "entity",
              "ckan_url",
              "github_url",
            ])
          )
        )}
      />
    </BaseResourcePage>
  );
}
