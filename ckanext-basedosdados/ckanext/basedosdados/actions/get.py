import os

import ckan.plugins.toolkit as toolkit
import requests
from ckan.logic.action.get import package_search, resource_search


@toolkit.side_effect_free
def bd_get_dataset(context, data_dict):
    """Show dataset

    :param dataset_id: dataset name
    :type dataset_id: string

    :returns: dataset most relevant
    """

    dataset_id = data_dict.get("dataset_id", "")

    search = package_search(context, {"name_or_id": dataset_id.replace("_", "-")})
    data = search.get("results", [])

    return data[0]


@toolkit.side_effect_free
def bd_get_table(context, data_dict):
    """Show table

    :param table_id: table name
    :type table_id: string

    :returns: table most relevant
    """

    table_id = data_dict.get("table_id", "")

    search = resource_search(context, {"name": table_id})
    data = search.get("results", [])

    return data[0]


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
