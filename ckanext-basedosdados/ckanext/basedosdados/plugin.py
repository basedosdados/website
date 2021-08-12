import collections
import types
import json
import ast

import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from ckan.plugins.toolkit import get_action
from ckanext.basedosdados.validator.packages import Dataset
from pydantic import ValidationError
import logging

log = logging.getLogger(__name__)


class BasedosdadosPlugin(plugins.SingletonPlugin, plugins.toolkit.DefaultDatasetForm):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.interfaces.IFacets)
    plugins.implements(plugins.interfaces.ITemplateHelpers)
    plugins.implements(plugins.IValidators)
    plugins.implements(plugins.IActions)
    plugins.implements(plugins.IDatasetForm)

    # IDatasetForm
    is_fallback = lambda s: True
    package_types = lambda s: []

    def _validate_pydantic(self, data_dict, action):
        """
        Validates metadata using pydantic.

        1. It unpacks the dataset_args from the extras
        2. Converts the dataset_args from string to dict
        3. Merges it do the data_dict
        4. Validates the data_dict with pydantic
        5. Repacks the dataset_args to extras in order to be used by CKAN, but it keeps the dataset arguments
        in the dict to be shown in `package_show`

        Package extras and dataset arguments
        -------------------------------------
        All dataset arguments are stored in a dict in the package_extras table called dataset_args.
        This is the case b/c CKAN only accepts string values for extras. In that way, we know that
        we always have to unpack a dict that is saved as a string in the extras field.
        """

        # 1. It unpacks the dataset_args from the extras
        # 2. Converts the dataset_args from string to dict
        if isinstance(data_dict["extras"], list):

            if any(["dataset_args" == i["key"] for i in data_dict["extras"]]):

                template_extras = [{"key": "dataset_args", "value": {}}]
                dataset_args = [
                    d["value"]
                    for d in data_dict.pop("extras", template_extras)
                    if d["key"] == "dataset_args"
                ][0]
                if isinstance(dataset_args, str):
                    dataset_args = ast.literal_eval(dataset_args)
                if not isinstance(dataset_args, dict):
                    raise TypeError(
                        f"dataset_args should be dict or string, but it is {type(dataset_args)}"
                    )
            else:
                dataset_args = {}
        dataset_args.pop("dataset_args", None)

        # 3. Merges it do the data_dict
        data_dict = dict(**data_dict, **dataset_args)
        data_dict.pop("dataset_args", None)

        # 4. Validates the data_dict with pydantic
        validation = Dataset(**data_dict, action__=action)

        # exclude unset needed by ckan so it can deal with missing values downstream (during partial updates for instance)
        data_dict = validation.json(exclude={"action__"}, exclude_unset=True)

        # we need to jsonify and de-jsonify so that objects such as datetimes are serialized
        data_dict = json.loads(data_dict)

        # 5. Repacks the dataset_args to extras in order to be used by CKAN, but it keeps the dataset arguments
        # in the dict to be shown in `package_show`
        data_dict["extras"] = [
            {
                "key": "dataset_args",
                "value": {k: data_dict.get(k, None) for k in dataset_args.keys()},
            }
        ]
        return data_dict

    def _validate_show(self, data_dict):
        if duplicated_keys := _find_duplicated_keys(data_dict["extras"]):
            raise ValidationError(
                {"extras": f"extras contains duplicated keys: {duplicated_keys!r}"}
            )
        try:
            out = self._validate_pydantic(data_dict, "package_show")
            return out, []
        except ValidationError as ee:  # a validation error in show is our fault, not the user's so raise and cause a 500
            log.error("Data dict:")
            log.error(data_dict)
            raise

    def _validate_create(self, data_dict, action="package_create"):
        try:
            out = self._validate_pydantic(data_dict, action)
            # out['extras'] = [{'key':k, 'value':v} for k, v in out['extras'].items()]
            return out, []
        except ValidationError as ee:
            return {}, json.loads(
                ee.json()
            )  # need to jsonify to ensure that data types are json friendly

    def _validate_update(self, data_dict):

        # Converts dataset_args from dict to string only if update is the case
        data_dict, errors = self._validate_create(data_dict, action="package_update")
        if data_dict.get("extras"):
            for d in data_dict.get("extras"):
                if d["key"] == "dataset_args":
                    d["value"] = str(d["value"])

                    break

        return data_dict, errors

    def validate(self, context, data_dict, schema, action):
        out, errors = {
            "package_show": self._validate_show,
            "package_create": self._validate_create,
            "package_update": self._validate_update,
        }[action](data_dict)

        # from ckan.lib.navl.dictization_functions import (
        #     validate as ckan_validate,
        # )  # use old ckan schema to validate ckan stuff. Maybe remove this sometime

        # out_2, errors_2 = ckan_validate(out, schema, context=context)
        # out.update(out_2)
        # if (
        #     not errors and errors_2
        # ):  # if pydantic has no errors, send ckan errors to avoid duplicated msgs... This can be improved if we merge errors correctly
        #     errors.append(
        #         {"msg": "ckan-errors", "errors": errors_2}
        #     )  # merge errors in a dirty way
        return out, errors
        # return (out || out_2, errors || errors_2)

    # IFacets
    def dataset_facets(self, facet_dict, package_type):
        facets = collections.OrderedDict()

        facets["download_type"] = "Forma de Download"
        facets["organization"] = "Organização"
        facets["groups"] = "Grupos"
        facets["tags"] = "Tags"

        return facets
        # OPTIONS: dict_keys(['license_title', 'maintainer', 'relationships_as_object', 'private',
        # 'maintainer_email', 'num_tags', 'id', 'metadata_created', 'owner_org', 'metadata_modified',
        # 'author', 'author_email', 'state', 'version', 'license_id', 'type', 'resources', 'num_resources',
        # 'tags', 'groups', 'creator_user_id', 'relationships_as_subject', 'name', 'isopen', 'url', 'notes',
        # 'title', 'extras', 'license_url', 'organization'])

    def group_facets(self, facets_dict, group_type, package_type):
        return self.dataset_facets(facets_dict, package_type)

    def organization_facets(self, facets_dict, organization_type, package_type):
        return self.dataset_facets(package_type)

    # IConfigurer
    def update_config(self, config_):
        toolkit.add_template_directory(config_, "templates")
        toolkit.add_public_directory(config_, "public")
        toolkit.add_public_directory(config_, "assets")
        # toolkit.add_resource('fanstatic', 'basedosdados')
        toolkit.add_resource("assets", "basedosdados")

    def get_helpers(self):
        import boltons.strutils
        import ckanext.basedosdados.template_functions as template_functions

        funs = _read_functions_from_module(template_functions)
        funs["boltons"] = boltons
        return funs

    # IValidators
    def get_validators(self):
        import ckanext.basedosdados.validator_functions as validators

        return _read_functions_from_module(validators)

    # IActions
    def get_actions(self):
        import ckanext.basedosdados.actions as actions

        return _read_functions_from_module(actions)


def _read_functions_from_module(module):
    funs = {
        name: getattr(module, name) for name in dir(module) if not name.startswith("_")
    }
    funs = {k: v for k, v in funs.items() if isinstance(v, types.FunctionType)}
    return funs


def _find_duplicated_keys(a_dict):
    from collections import Counter

    keys_frequencies = Counter(i["key"] for i in a_dict)
    return {key for key, count in keys_frequencies.items() if count > 1}
