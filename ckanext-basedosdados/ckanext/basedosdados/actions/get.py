import os

import ckan.plugins.toolkit as toolkit
import requests
from ckan.logic.action.get import package_search
from .. import validator


@toolkit.side_effect_free  # Necessário para fazer o GET
def bd_package_schema(context, data_dict=None):
    return validator.package.package_schema_json()


@toolkit.side_effect_free  # Necessário para fazer o GET
def bd_resource_schema(context, data_dict=None):
    return validator.resource.resource_schema_json()


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
