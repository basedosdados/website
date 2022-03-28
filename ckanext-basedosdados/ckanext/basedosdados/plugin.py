import ast
import collections
import json
import logging
import types

import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from ckanext.basedosdados.validator.packages import Dataset
from ckanext.basedosdados.virtual_fields import create_virtual_fields
from pydantic import ValidationError

log = logging.getLogger(__name__)


class BasedosdadosPlugin(plugins.SingletonPlugin, plugins.toolkit.DefaultDatasetForm):
    plugins.implements(plugins.IPackageController, inherit=True)
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.interfaces.IFacets)
    plugins.implements(plugins.interfaces.ITemplateHelpers)
    plugins.implements(plugins.IValidators)
    plugins.implements(plugins.IActions)
    plugins.implements(plugins.IDatasetForm)

    # IDatasetForm
    is_fallback = lambda s: True
    package_types = lambda s: []

    # IPackageController
    def before_index(self, fields_to_index):
        virtual_fields = create_virtual_fields(fields_to_index)
        new_fields = {}
        for key, value in virtual_fields.items():
            assert type(value) in (str, int, list, float, None)
            multi = 'multi_' if isinstance(value, list) else ''
            new_fields[f'virtual_{multi}{key}'] = value
        fields_to_index.update(new_fields)
        return fields_to_index

    # IValidators
    def validate(self, context, data_dict, schema, action):
        out, errors = {
            "package_show": self._validate_show,
            "package_create": self._validate_create,
            "package_update": self._validate_update,
        }[action](data_dict)

        return out, errors

    def _validate_show(self, data_dict):
        if duplicated_keys := _find_duplicated_keys(data_dict["extras"]):
            raise ValidationError(
                {"extras": f"extras contains duplicated keys: {duplicated_keys!r}"}
            )
        try:
            out = self._validate_pydantic(data_dict, "package_show")
            return out, []
        except ValidationError as error:
            # a validation error in show is our fault,
            # not the user's so raise and cause a 500
            log.error(">" * 60)
            log.error(">" * 60)
            log.error(error)
            log.error(">" * 60)
            log.error(data_dict)
            log.error(">" * 60)
            log.error(">" * 60)
            raise

    def _validate_create(self, data_dict, action="package_create"):
        try:
            out = self._validate_pydantic(data_dict, action)
            for d in out.get("extras") or []:
                if d["key"] == "dataset_args":
                    d["value"] = str(d["value"])
                    break
            return out, []
        except ValidationError as ee:
            # need to jsonify to ensure that data types are json friendly
            return {}, json.loads(ee.json())

    def _validate_update(self, data_dict):
        return self._validate_create(data_dict, action="package_update")

    def _validate_pydantic(self, data_dict, action, validate=True):
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
        if not validate:
            return data_dict

        # 0. Find dataset_args in extras
        dataset_args = {}
        for extra in data_dict.get("extras") or []:
            if extra.get("key") == "dataset_args":
                dataset_args = extra["value"]
                break

        # 1. It unpacks the dataset_args from the extras
        # 2. Converts the dataset_args from string to dict
        if isinstance(dataset_args, str):
            dataset_args = ast.literal_eval(dataset_args)
        elif not isinstance(dataset_args, dict):
            raise TypeError(
                f"dataset_args should be dict or string, but it is {type(dataset_args)}"
            )

        # 3. Merge it do the data_dict
        data_model = dict(**data_dict, **dataset_args)
        data_model.pop("extras", None)

        # 4. Validate the data_dict with pydantic
        validation = Dataset(**data_model, action__=action)

        # exclude unset needed by ckan so it can deal with missing values downstream (during partial updates for instance)
        data_dict = validation.json(exclude={"action__"}, exclude_unset=True)

        # we need to jsonify and de-jsonify so that objects such as datetimes are serialized
        data_dict = json.loads(data_dict)

        # 5. Repack the dataset_args to extras in order to be used by CKAN,
        # but it keeps the dataset arguments in the dict to be shown in `package_show`
        data_dict["extras"] = [
            {
                "key": "dataset_args",
                "value": {k: data_dict.get(k, None) for k in dataset_args.keys()},
            }
        ]

        # 6. Removes extras from the main dict
        for k in dataset_args.keys():
            data_dict.pop(k, None)

        return data_dict

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
