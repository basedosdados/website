import json
from pathlib import Path

import ckan.plugins.toolkit as toolkit
from ckan.logic.action.get import (dataset_follower_count, package_search,
                                   resource_search)
from ckanext.basedosdados.validator.packages import Dataset
from ckanext.basedosdados.validator.resources import (BdmColumns,
                                                      BdmDictionary, BdmTable,
                                                      ExternalLink,
                                                      InformationRequest)
from pydantic import ValidationError

# how to acess the endpoint
# http://localhost:5000/api/3/action/<function_name>


@toolkit.side_effect_free
def bd_dataset_schema(context, data_dict):
    return Dataset.schema()


@toolkit.side_effect_free
def bd_bdm_table_schema(context, data_dict):
    return BdmTable.schema()


@toolkit.side_effect_free
def bd_bdm_columns_schema(context, data_dict):
    return BdmColumns.schema()


@toolkit.side_effect_free
def bd_bdm_dictionary_schema(context, data_dict):
    return BdmDictionary.schema()


@toolkit.side_effect_free
def bd_external_link_schema(context, data_dict):
    return ExternalLink.schema()


@toolkit.side_effect_free
def bd_information_request_schema(context, data_dict):
    return InformationRequest.schema()


@toolkit.side_effect_free
def bd_dataset_search(context, data_dict):

    # pre-process solr parameters #########################

    q = data_dict.get("q", "")
    page = data_dict.get("page", 1)
    page_size = data_dict.get("page_size", 10)
    order_by = data_dict.get("order_by", "score,recent")

    # pre-process solr parameter fq #######################

    def get_parameter(data, bd_key, fq_key):
        value = data.get(bd_key, "")
        value = value.split(",")
        value = " OR ".join(value)
        return [f"{fq_key}:({value})" if value else ""]

    fq = []
    fq += get_parameter(data_dict, "tag", "tags")
    fq += get_parameter(data_dict, "group", "groups")
    fq += get_parameter(data_dict, "organization", "organization")
    fq += get_parameter(data_dict, "download_type", "extras_dataset_args")
    fq += get_parameter(data_dict, "spatial_coverage", "res_extras_spatial_coverage")
    fq += get_parameter(data_dict, "temporal_coverage", "res_extras_temporal_coverage")

    fq = [f for f in fq if f]
    fq = "+".join(fq)

    # pre-process solr parameter sort #####################

    order2sort = {
        "score": "score desc",
        "popular": "views_recent desc",
        "recent": "metadata_modified desc",
    }

    sort = order_by.split(",")
    sort = [order2sort[s] for s in sort]
    sort = ", ".join(sort)

    # search with solr query ##############################

    response = package_search(
        context,
        {
            "q": q,
            "fq": fq,
            "rows": 1000,
            "sort": sort,
        },
    )

    # post-process ########################################

    response["datasets"] = response.pop("results", None)
    response.pop("facets", None)
    response.pop("search_facets", None)
    response.pop("sort", None)

    # post-process tags ###################################

    response["tags"] = {}

    for dataset in response["datasets"]:
        for tag in dataset.get("tags", []):
            key = tag["name"]
            value = response["tags"].get(key, 0) + 1
            response["tags"][key] = value

    # post-process organizations ##########################

    response["organizations"] = {}

    for dataset in response["datasets"]:
        key = dataset["organization"]["name"]
        value = response["organizations"].get(key, 0) + 1
        response["organizations"][key] = value

    # post-process datasets ###############################

    page = int(page or 1)
    page_size = int(page_size or 10)

    j = page_size * page
    i = page_size * (page - 1)

    response["datasets"] = response["datasets"][i:j]

    #######################################################

    return response


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


@toolkit.side_effect_free
def bd_translation(context, data_dict):
    def extract_translation(schema):
        translation = {}
        for prop, body in schema["properties"].items():
            translation[prop] = body.get("title")
        translation.pop("action__", None)
        return translation

    return {
        "dataset": extract_translation(Dataset.schema()),
        "bdm_table": extract_translation(BdmTable.schema()),
        "bdm_columns": extract_translation(BdmColumns.schema()),
        "bdm_dictionary": extract_translation(BdmDictionary.schema()),
        "external_link": extract_translation(ExternalLink.schema()),
        "information_request": extract_translation(InformationRequest.schema()),
    }


@toolkit.side_effect_free
def bd_openapi(context, data_dict):
    filepath = Path(__file__).parent
    filepath = filepath / "openapi.json"
    with open(filepath, "r") as file:
        return json.load(file)
