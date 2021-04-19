# Documentation on: https://docs.ckan.org/en/2.9/extensions/adding-custom-fields.html?highlight=validators#custom-validators

from ckantoolkit import missing as MISSING


def _get_type(key, data):
    k = list(key)
    k[-1] = "resource_type"
    type_ = data.get(tuple(k))
    SUPPORTED_TYPES = ("bdm_table", "external_link", "lai_request")
    if type_ not in SUPPORTED_TYPES:
        return None
        # raise Exception( f'Resource Type invalid! Found {type_!r}, but we only accept types: {SUPPORTED_TYPES!r}\n{locals()}')
    return type_


def required_on_types(*types):
    def validator(key, data, errors, con):
        type_ = _get_type(key, data)
        if type_ == None:
            errors[key].append(f"resource_type not supported.")
            return
        has_data = data[key] != MISSING and data[key]
        if type_ in types and not has_data:
            errors[key].append(f"Field required for {type_} resources")

    return validator


def only_on_types(*types):
    def validator(key, data, errors, con):
        type_ = _get_type(key, data)
        if type_ == None:
            errors[key].append(f"resource_type not supported.")
            return
        has_data = data[key] != MISSING and data[key]
        if type_ not in types and has_data:
            errors[key].append(
                f"Field only available for {types} resources. This resource is of type {type_}"
            )

    return validator


def bdm_table_columns_metadata_validator(data):
    from ckanext.basedosdados.bdm_table_column_metadata_validator import (
        column_validator,
    )

    print(
        "########################## V A L I D A T I N G C O L U M N S ##################################"
    )

    def validator(key, data, errors, con):
        validated = column_validator.validate_columns_from_dict(data)
        if validated:
            errors[key].append(str(validated))

    return validator


def bdm_table_columns_name_validator(*field):
    from ckanext.basedosdados.bdm_table_column_metadata_validator import (
        column_validator,
    )

    print(
        "########################## V A L I D A T I N G N A M E S ##################################"
    )

    def validator(key, data, errors, con):
        validated = column_validator.validate_name(field)
        if validated:
            errors[key].append(str(validated))

    return validator


def bdm_table_columns_description_validator(*field):
    from ckanext.basedosdados.bdm_table_column_metadata_validator import (
        column_validator,
    )

    print(
        "########################## V A L I D A T I N G D E S C R I P T I O N ##################################"
    )

    def validator(key, data, errors, con):
        validated = column_validator.validate_description(data)
        if not validated:
            errors[key].append(validated)

    return validator