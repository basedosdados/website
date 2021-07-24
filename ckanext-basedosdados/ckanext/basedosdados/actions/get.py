import json
import sys

import requests
from pydantic import ValidationError
import ckan.plugins.toolkit as toolkit
from ckan.logic.action.get import (
    dataset_follower_count,
    package_search,
    resource_search,
)

from ckanext.basedosdados.validator.packages import Dataset
from ckanext.basedosdados.validator.resources import (
    BdmTable,
    BdmColumns,
    BdmDictionary,
    ExternalLink,
    InformationRequest,
)


# how to acess the endpoint
# http://localhost:5000/api/3/action/<function_name>


@toolkit.side_effect_free
def bd_dataset_schema(context, data_dict):
    return json.loads(Dataset.schema_json(indent=2))


@toolkit.side_effect_free
def bd_bdm_table_schema(context, data_dict):
    return json.loads(BdmTable.schema_json(indent=2))


@toolkit.side_effect_free
def bd_bdm_columns_schema(context, data_dict):
    return json.loads(BdmColumns.schema_json(indent=2))


@toolkit.side_effect_free
def bd_bdm_dictionary_schema(context, data_dict):
    return json.loads(BdmDictionary.schema_json(indent=2))


@toolkit.side_effect_free
def bd_external_link_schema(context, data_dict):
    return json.loads(ExternalLink.schema_json(indent=2))


@toolkit.side_effect_free
def bd_information_request_schema(context, data_dict):
    return json.loads(InformationRequest.schema_json(indent=2))


def bd_dataset_show(context, data_dict):
    """Show dataset

    :param dataset_id: dataset name
    :type dataset_id: string

    :returns: most relevant dataset
    """

    try:
        dataset_id = data_dict["dataset_id"]
        dataset_id = dataset_id.replace("_", "-")
    except KeyError as e:
        raise ValidationError(f"{e} parameter not found")

    search = package_search(context, {"q": f"name={dataset_id}"})
    data = search.get("results", [])

    return data[0]


@toolkit.side_effect_free
def bd_dataset_show(context, data_dict):
    """Show dataset
    :param dataset_id: dataset name
    :type dataset_id: string
    :returns: most relevant dataset
    """

    try:
        dataset_id = data_dict["dataset_id"]
        dataset_id = dataset_id.replace("_", "-")
    except KeyError as e:
        raise ValidationError(f"{e} parameter not found")

    search = package_search(context, {"q": f"name={dataset_id}"})
    data = search.get("results", [])

    return data[0]


@toolkit.side_effect_free
def bd_table_show(context, data_dict):
    """Show table
    :param table_id: table name
    :type table_id: string
    :returns: most relevant table
    """

    try:
        table_id = data_dict["table_id"]
    except KeyError as e:
        raise ValidationError(f"{e} parameter not found")

    search = resource_search(context, {"query": f"name:{table_id}"})
    data = search.get("results", [])

    return data[0]


@toolkit.side_effect_free
def bd_recent_datasets_list(context, data_dict):
    """List recent modified datasets
    :param limit: quantity of results
    :type limit: int
    :returns: list of datasets
    """

    limit = data_dict.get("limit", 10)

    search = package_search(
        context, {"sort": "metadata_modified desc", "rows": limit}
    )  # or sort by metadata_created
    data = search.get("results", [])

    for datum in data:
        count = dataset_follower_count(context, {"id": datum["name"]})
        datum["follower_count"] = count

    return data


@toolkit.side_effect_free
def bd_popular_datasets_list(context, data_dict):
    """List recent popular datasets
    :param limit: quantity of results
    :type limit: int
    :returns: list of datasets
    """

    limit = data_dict.get("limit", 10)

    search = package_search(
        context, {"sort": "views_recent desc", "rows": limit}
    )  # or sort by views_total
    data = search.get("results", [])

    for datum in data:
        count = dataset_follower_count(context, {"id": datum["name"]})
        datum["follower_count"] = count

    return data


def _migrate_to_schema3(schema):
    if schema.get("type") == "object":
        for f in schema.get("required", []):
            field = schema.get("properties", {}).get(f, {})
            field["required"] = True
        for sub_schema in schema.get("properties", {}).values():
            _migrate_to_schema3(sub_schema)


def _remove_complex_ckan_fields(package, fields_to_remove):
    for field in fields_to_remove:
        del package["properties"][field]
        if field in package["required"]:
            package["required"].remove(field)


def to_schema(x, fields_to_remove):
    from jsonref import JsonRef, json
    from copy import deepcopy

    out = deepcopy(
        JsonRef.replace_refs(x.schema(), jsonschema=True)
    )  # need deepcopy to create a proper dict, jsonref returns a dict-like object that is not json serializable

    _remove_complex_ckan_fields(out, fields_to_remove)
    _migrate_to_schema3(
        out
    )  # migrate required to schema3 format to comply with jsonform
    return dict(out)


@toolkit.side_effect_free
def bd_test(context, data_dict):
    resource_fields_to_delete = [
        "spatial_coverage",
        "temporal_coverage",
        "update_frequency",
        "resource_type",
        "columns",
    ]
    return to_schema(BdmTable, resource_fields_to_delete)
