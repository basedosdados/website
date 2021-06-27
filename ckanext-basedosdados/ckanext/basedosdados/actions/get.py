import os

import ckan.plugins.toolkit as toolkit
import requests
from ckan.logic.action.get import package_search
from pydantic import Field
from .. import validator
from typing import Union
from typing_extensions import Annotated
import json

# how to acess the endpoint
# http://localhost:5000/api/3/action/<function_name>

@toolkit.side_effect_free
def bd_dataset_schema(context, data_dict):
    dataset_schema = validator.package.Package.schema_json(indent=2)
    return json.loads(dataset_schema)


@toolkit.side_effect_free
def bd_bdm_table_schema(context, data_dict):
    BdmTable_schema = validator.resource.BdmTable.schema_json(indent=2)
    return json.loads(BdmTable_schema)


@toolkit.side_effect_free
def bd_external_link_table_schema(context, data_dict):
    ExternalLink_schema = validator.resource.ExternalLink.schema_json(indent=2)
    return json.loads(ExternalLink_schema)


@toolkit.side_effect_free
def bd_list_recent_datasets(context, data_dict):
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

    return data


@toolkit.side_effect_free
def bd_list_popular_datasets(context, data_dict):
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

    return data
