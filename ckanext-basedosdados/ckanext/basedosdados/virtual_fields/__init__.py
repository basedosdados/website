import collections
from ckanext.basedosdados.validator.available_options.spatial_coverage import *


def create_virtual_fields(fields):
    return {name: f(fields) for name, f in CREATORS.items()}


###################################
### VIRTUAL DATASET FIELDS
###
### To create a virtual field, create a function below.
### The function should be called "create_{name}" where name is the virtual field you are creating
### The function will be called with a single argument, which is a dictionary of the package's existing non-virtual fields
### The function should return either a list of scalars or a scalar field (int, str, float, etc)
###################################
################################### Define virtual fields bellow this line ###################################

def create_spatial_coverage(fields):

    area_ids = []

    for resource_spatial_coverage in fields.get("res_extras_spatial_coverage", []):
        if resource_spatial_coverage == None:
            continue
        for area_id in resource_spatial_coverage:
            if area_id is None:
                continue
            #if area_id != 'world':
            area_ids.append(area_id)
            for child in get_spatial_coverage_children(area_id):
                area_ids.append(child.id)
    area_ids = list(set(area_ids))
    return area_ids


def create_entity(fields):
    entities = []
    for ol in fields.get("res_extras_observation_level", []):
        if ol == None:
            continue
        for e in ol:
            if "entity" in e:
                entities.append(e["entity"])
    entities = list(set(entities))
    return entities


def create_temporal_coverage(fields):
    years = set()
    for tc in fields.get("res_extras_temporal_coverage", []):
        if tc in [None, "", []]:
            continue
        interval = tc[0]
        if "(" in interval:
            first = int(interval.split("(")[0][0:4])
            last = int(interval.split(")")[1][0:4]) + 1
            step = int(interval[interval.find("(") + 1 : interval.find(")")])
            year_range = [*range(first, last, step)]
        else:
            year_range = [int(interval[0:4])]
        years |= set(year_range)
    return list(years)


def create_raw_quality_tier(fields):

    # discussed at https://github.com/basedosdados/website/issues/228

    tier = ""
    grades = []
    i = 0
    if "res_type" in fields:
        for resource_type in fields["res_type"]:
            if resource_type == "external_link":

                has_structured_data = fields["res_extras_has_structured_data"][i]
                has_api = fields["res_extras_has_api"][i]
                is_free = fields["res_extras_is_free"][i]
                requires_registration = fields["res_extras_requires_registration"][i]
                availability = fields["res_extras_availability"][i]
                country_ip_address_required = fields[
                    "res_extras_country_ip_address_required"
                ][i]
                license = fields["res_extras_license"][i]

                grade = (
                    10 * (has_structured_data == "yes")
                    + 6 * (has_api == "yes")
                    + 8 * (is_free == "yes")
                    + 4 * (requires_registration == "no")
                    + 8 * (availability == "online")
                    + 5 * (country_ip_address_required == [])
                    + 6 * (license != "")
                ) / (10 + 6 + 8 + 4 + 8 + 5 + 6)

                grades.append(grade)

            i += 1

        if grades:  # some datasets may not have any resources
            grade = max(grades)
            if grade < 0.5:
                tier = "low"
            elif grade >= 0.5 and grade < 0.75:
                tier = "medium"
            else:
                tier = "high"

    return tier


################################### Define virtual fields above this line ###################################

CREATORS = {
    name.removeprefix("create_"): f
    for name, f in list(globals().items())
    if name.startswith("create_")
    and name != "create_virtual_fields"
    and isinstance(f, collections.Callable)
}
