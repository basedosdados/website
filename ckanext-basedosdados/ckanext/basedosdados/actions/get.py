import json
from pathlib import Path

import ckan.plugins.toolkit as toolkit
from ckan.logic.action.get import dataset_follower_count, package_search
from ckanext.basedosdados.validator.available_options import (
    Admin1Enum,
    Admin2Enum,
    AvailabilityEnum,
    BigQueryTypeEnum,
    ContinentEnum,
    CountryEnum,
    DirectoryEnum,
    LanguageEnum,
    LicenseEnum,
    MeasurementUnitEnum,
    StatusEnum,
    TimeUnitEnum,
    YesNoEnum,
)
from ckanext.basedosdados.validator.available_options.entity import (
    EntityArtEnum,
    EntityDemographicEnum,
    EntityEconomicsEnum,
    EntityEducationEnum,
    EntityEstablishmentEnum,
    EntityEventEnum,
    EntityHistoryEnum,
    EntityImageEnum,
    EntityIndividualEnum,
    EntityInfrastructureEnum,
    EntityOtherEnum,
    EntityPoliticsEnum,
    EntityScienceEnum,
    EntitySecurityEnum,
    EntitySphereEnum,
    EntityTransportationEnum,
)
from ckanext.basedosdados.validator.packages import Dataset
from ckanext.basedosdados.validator.resources import (
    RESOURCE_TYPES,
    BdmColumns,
    BdmDictionary,
    BdmTable,
    ExternalLink,
    InformationRequest,
)
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
def bd_get_current_user(context, data_dict):
    """Shows current user data
    Args:
        none
    Returns:
        data about the current logged user, returns None if not logged
    """

    user = context["auth_user_obj"]

    if not user:
        return None

    return {
        "fullname": user.fullname,
        "image_url": user.image_url,
        "name": user.name,
        "is_admin": user.sysadmin,
    }


@toolkit.side_effect_free
def bd_bdm_dataset_show(context, data_dict):
    """Show dataset
    Args:
        dataset_id (str): dataset ID (required)
    Returns:
        list of datasets
    Example usage:
        http://staging.basedosdados.org/api/3/action/bd_bdm_dataset_show?dataset_id=br_sp_alesp
        http://localhost:5000/api/3/action/bd_bdm_dataset_show?dataset_id=br_sp_alesp
    """

    try:
        dataset_id = data_dict["dataset_id"]
    except KeyError as e:
        raise ValidationError(f"{e} parameter not found")

    fq = f"res_extras_dataset_id:({dataset_id})"

    search_result = package_search(
        context,
        {
            "fq": fq,
            "rows": 1000,
        },
    ).get("results")

    # get the only package that mach dataset_id
    for package in search_result:
        for resource in package.get("resources"):
            if (
                resource.get("dataset_id") is not None
                and resource.get("dataset_id") == dataset_id
            ):
                found_package = package
                break

    # TODO: make error message appear in the endpoint response
    if found_package:
        return found_package
    else:
        raise "No dataset found with dataset_id={dataset_id}"


@toolkit.side_effect_free
def bd_bdm_table_show(context, data_dict):
    """Show table
    Args:
        dataset_id (str): dataset ID (required)
        table_id (str): table ID (required)
    Returns:
        list of tables
    Example usage:
        http://staging.basedosdados.org/api/3/action/bd_bdm_table_show?dataset_id=br_sp_alesp&table_id=deputado
        http://localhost:5000/api/3/action/bd_bdm_table_show?dataset_id=br_sp_alesp&table_id=deputado
    """

    try:
        dataset_id = data_dict["dataset_id"]
        table_id = data_dict["table_id"]
    except KeyError as e:
        raise ValidationError(f"{e} parameter not found")

    fq = f"res_extras_dataset_id:({dataset_id}) AND res_extras_table_id:({table_id})"

    # TODO: maybe use resource_search instead of package_search
    search_result = package_search(
        context,
        {
            "fq": fq,
            "rows": 1000,
        },
    ).get("results")

    # get the only package that mach dataset_id and table_id
    for package in search_result:
        for resource in package.get("resources"):
            if (
                resource.get("table_id") is not None
                and resource.get("table_id") == table_id
                and resource.get("dataset_id") == dataset_id
            ):
                found_resources = resource
                break

    # # TODO: make error message appear in the endpoint response
    if found_resources:
        return found_resources
    else:
        raise "No tables found with dataset_id={dataset_id} and table_id={table_id}"


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
    fq += get_parameter(data_dict, "resource_type", "res_type")
    fq += get_parameter(data_dict, "organization", "organization")
    fq += get_parameter(data_dict, "entity", "res_extras_entity")
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

    # post-process groups ###################################

    response["groups"] = {}
    response["groups_display_names"] = {}

    for dataset in response["datasets"]:
        for group in dataset.get("groups", []):
            key = group["name"]
            response["groups_display_names"][key] = group["display_name"]
            value = response["groups"].get(key, 0) + 1
            response["groups"][key] = value

    # post-process tags ###################################

    response["tags"] = {}

    for dataset in response["datasets"]:
        for tag in dataset.get("tags", []):
            key = tag["name"]
            value = response["tags"].get(key, 0) + 1
            response["tags"][key] = value

    # post-process organizations ##########################

    response["organizations"] = {}
    response["organizations_display_names"] = {}

    for dataset in response["datasets"]:
        key = dataset["organization"]["name"]
        response["organizations_display_names"][key] = dataset["organization"]["title"]
        value = response["organizations"].get(key, 0) + 1
        response["organizations"][key] = value

    # post-process entities ###############################

    response["entities"] = {}

    for dataset in response["datasets"]:
        entities = []
        for resource in dataset["resources"]:
            res_entities = resource.get("entity", []) or []
            entities.extend(res_entities)
        entities = list(set(entities))

        for key in entities:
            value = response["entities"].get(key, 0) + 1
            response["entities"][key] = value

    # post-process update frequency ###############################

    response["update_frequencies"] = {}

    for dataset in response["datasets"]:
        update_frequencies = []
        for resource in dataset["resources"]:
            res_update_frequencies = resource.get("update_frequency", None)

            if res_update_frequencies is None:
                continue

            update_frequencies.append(res_update_frequencies)
        update_frequencies = list(set(update_frequencies))

        for key in update_frequencies:
            value = response["update_frequencies"].get(key, 0) + 1
            response["update_frequencies"][key] = value

    # post-process spatial coverage ###############################

    response["spatial_coverage_continent"] = {}

    for dataset in response["datasets"]:
        spatial_coverage = []
        for resource in dataset["resources"]:
            res_spatial_coverage = []
            resource_spatial_coverage = resource.get("spatial_coverage", {})

            if (
                "continent" in resource_spatial_coverage
                and type(resource_spatial_coverage.get("continent", None)) is str
            ):
                res_spatial_coverage.extend(resource_spatial_coverage["continent"])

            spatial_coverage.extend(res_spatial_coverage)
        spatial_coverage = list(set(spatial_coverage))

        for key in spatial_coverage:
            value = response["spatial_coverage_continent"].get(key, 0) + 1
            response["spatial_coverage_continent"][key] = value

    response["spatial_coverage_country"] = {}

    # post-process resource count #########################

    response["resource_bdm_table_count"] = 0
    response["resource_external_link_count"] = 0

    for dataset in response["datasets"]:
        resource_bdm_table_count = 0
        resource_external_link_count = 0
        for resource in dataset["resources"]:
            if resource["resource_type"] == "bdm_table":
                resource_bdm_table_count = 1
            elif resource["resource_type"] == "external_link":
                resource_external_link_count = 1

        response["resource_bdm_table_count"] += resource_bdm_table_count
        response["resource_external_link_count"] += resource_external_link_count

    # post-process datasets order by resource_type ###################################

    resource_type_order = [
        "bdm_table",
        "bdm_dictionary",
        "information_request",
        "external_link",
        None,
    ]
    resource_types_not_included = [
        resource_type
        for resource_type in RESOURCE_TYPES
        if resource_type not in resource_type_order
    ]
    resource_type_order = resource_type_order + resource_types_not_included

    resources_order_dict = {}
    print(resource_type_order)
    for i, package in enumerate(response["datasets"]):
        resources_type = [
            resource.get("resource_type") for resource in package.get("resources")
        ]
        resources_type = resources_type if resources_type != [] else [None]

        for item in resource_type_order:
            if item in resources_type:
                resources_order_dict[i] = item
                break

    datasets_final_order = []
    for item in resource_type_order:
        for position in resources_order_dict:
            if resources_order_dict[position] == item:
                datasets_final_order.append(response["datasets"][position])

    response["datasets"] = datasets_final_order

    # post-process datasets ###############################

    page = int(page or 1)
    page_size = int(page_size or 10)

    j = page_size * page
    i = page_size * (page - 1)

    response["datasets"] = response["datasets"][i:j]

    #######################################################

    return response


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
def bd_available_options_dict(context, data_dict):
    return {
        **AvailabilityEnum.get_all_enum_attr("label"),
        **BigQueryTypeEnum.get_all_enum_attr("label"),
        **DirectoryEnum.get_all_enum_attr("label"),
        **EntityArtEnum.get_all_enum_attr("label"),
        **EntityDemographicEnum.get_all_enum_attr("label"),
        **EntityEconomicsEnum.get_all_enum_attr("label"),
        **EntityEducationEnum.get_all_enum_attr("label"),
        **EntityEstablishmentEnum.get_all_enum_attr("label"),
        **EntityEventEnum.get_all_enum_attr("label"),
        **EntityHistoryEnum.get_all_enum_attr("label"),
        **EntityImageEnum.get_all_enum_attr("label"),
        **EntityIndividualEnum.get_all_enum_attr("label"),
        **EntityInfrastructureEnum.get_all_enum_attr("label"),
        **EntityOtherEnum.get_all_enum_attr("label"),
        **EntityPoliticsEnum.get_all_enum_attr("label"),
        **EntityScienceEnum.get_all_enum_attr("label"),
        **EntitySecurityEnum.get_all_enum_attr("label"),
        **EntitySphereEnum.get_all_enum_attr("label"),
        **EntityTransportationEnum.get_all_enum_attr("label"),
        **LanguageEnum.get_all_enum_attr("label"),
        **LicenseEnum.get_all_enum_attr("label"),
        **MeasurementUnitEnum.get_all_enum_attr("label"),
        **Admin1Enum.get_all_enum_attr("label"),
        **Admin2Enum.get_all_enum_attr("label"),
        **ContinentEnum.get_all_enum_attr("label"),
        **CountryEnum.get_all_enum_attr("label"),
        **StatusEnum.get_all_enum_attr("label"),
        **TimeUnitEnum.get_all_enum_attr("label"),
        **YesNoEnum.get_all_enum_attr("label"),
    }


@toolkit.side_effect_free
def bd_available_options(context, data_dict):
    return {
        "Availability": AvailabilityEnum.get_all_enum_attr("label"),
        "BigQuery Type": BigQueryTypeEnum.get_all_enum_attr("label"),
        "Directory": DirectoryEnum.get_all_enum_attr("label"),
        "Entity": {
            "Entity Art": EntityArtEnum.get_all_enum_attr("label"),
            "Entity Demographic": EntityDemographicEnum.get_all_enum_attr("label"),
            "Entity Economics": EntityEconomicsEnum.get_all_enum_attr("label"),
            "Entity Education": EntityEducationEnum.get_all_enum_attr("label"),
            "Entity Establishment": EntityEstablishmentEnum.get_all_enum_attr("label"),
            "Entity Event": EntityEventEnum.get_all_enum_attr("label"),
            "Entity History": EntityHistoryEnum.get_all_enum_attr("label"),
            "Entity Image": EntityImageEnum.get_all_enum_attr("label"),
            "Entity Individual": EntityIndividualEnum.get_all_enum_attr("label"),
            "Entity Infrastructure": EntityInfrastructureEnum.get_all_enum_attr(
                "label"
            ),
            "Entity Other": EntityOtherEnum.get_all_enum_attr("label"),
            "Entity Politics": EntityPoliticsEnum.get_all_enum_attr("label"),
            "Entity Science": EntityScienceEnum.get_all_enum_attr("label"),
            "Entity Security": EntitySecurityEnum.get_all_enum_attr("label"),
            "Entity Sphere": EntitySphereEnum.get_all_enum_attr("label"),
            "Entity Transportation": EntityTransportationEnum.get_all_enum_attr(
                "label"
            ),
        },
        "Language": LanguageEnum.get_all_enum_attr("label"),
        "License": LicenseEnum.get_all_enum_attr("label"),
        "Measurement Unit": MeasurementUnitEnum.get_all_enum_attr("label"),
        "Spatial Coverage": {
            "Admin1": Admin1Enum.get_all_enum_attr("label"),
            "Admin2": Admin2Enum.get_all_enum_attr("label"),
            "Continent": ContinentEnum.get_all_enum_attr("label"),
            "Country": CountryEnum.get_all_enum_attr("label"),
        },
        "Status": StatusEnum.get_all_enum_attr("label"),
        "Time Unit": TimeUnitEnum.get_all_enum_attr("label"),
        "Yes No": YesNoEnum.get_all_enum_attr("label"),
    }


@toolkit.side_effect_free
def bd_openapi(context, data_dict):
    filepath = Path(__file__).parent
    filepath = filepath / "openapi.json"
    with open(filepath, "r") as file:
        return json.load(file)
