import sys
import json
import requests

import ckan.plugins.toolkit as toolkit
from ckan.logic.action.get import package_search

from ckanext.basedosdados.validator.bdm.dataset import BdmDataset
from ckanext.basedosdados.validator.bdm.table import BdmTable
from ckanext.basedosdados.validator.bdm.columns import BdmColumns

from ckanext.basedosdados.validator.external_link.table import ExternalLink

# how to acess the endpoint
# http://localhost:5000/api/3/action/<function_name>


@toolkit.side_effect_free
def bd_bdm_dataset_schema(context, data_dict):
    return json.loads(BdmDataset.schema_json(indent=2))


@toolkit.side_effect_free
def bd_bdm_table_schema(context, data_dict):
    return json.loads(BdmTable.schema_json(indent=2))


@toolkit.side_effect_free
def bd_bdm_columns_schema(context, data_dict):
    return json.loads(BdmColumns.schema_json(indent=2))


@toolkit.side_effect_free
def bd_external_link_table_schema(context, data_dict):
    return json.loads(ExternalLink.schema_json(indent=2))


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
