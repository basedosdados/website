import logging

import ckan.lib.plugins as lib_plugins
import ckan.logic as logic

from .get import *

log = logging.getLogger(__name__)
ValidationError = logic.ValidationError


def package_validate(context, data_dict):
    context["ignore_auth"] = True

    if "type" not in data_dict:
        package_plugin = lib_plugins.lookup_package_plugin()
        try:
            # use first type as default if user didn't provide type
            package_type = package_plugin.package_types()[0]
        except (AttributeError, IndexError):
            # in case a 'dataset' plugin was registered w/o fallback
            package_type = "dataset"
        data_dict["type"] = package_type
    package_plugin = lib_plugins.lookup_package_plugin(data_dict["type"])

    if "id" in data_dict:
        del data_dict["id"]
    for r in data_dict["resources"]:
        if "id" in r:
            del r["id"]
    if "name" in data_dict:
        # add a char so that name doesn't collide with existing package
        data_dict["name"] += "_"

    schema = context.get("schema") or package_plugin.create_package_schema()
    data, errors = lib_plugins.plugin_validate(
        package_plugin, context, data_dict, schema, "package_create"
    )

    if errors:
        return {"sucess": False, "data": data, "errors": errors}

    return {"sucess": True, "data": data, "errors": errors}
