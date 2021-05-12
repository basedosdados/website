import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from ckan.plugins.toolkit import get_action
import collections
import pprint
import types
import ckanext.basedosdados.validator as pydantic_validator

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
    def validate(self, context, data_dict, schema, action):
        if action == 'package_show': # 'package_show', 'package_create', 'package_update'
            if duplicated_keys := _find_duplicated_keys(data_dict['extras']):
                raise ValidationErro({"extras": f'extras contains duplicated keys: {duplicated_keys!r}'})
            data_dict['extras'] = { i['key']: i['value'] for i in data_dict['extras']} # transform extras into a simple dict
        errors = {}
        try:
            out = pydantic_validator.package.Wrapper.validate({'package': data_dict, 'action': action})
            return out.package.dict(), {}
        except pydantic_validator.ValidationError as ee:
            errors = ee.errors()
            errors = {i['loc']: repr(i) for i in errors}
            log.error('Data dict:')
            log.error(data_dict)
            raise
            # assert set(errors.keys()).issubset(data_dict.keys()) # error keys are = to data_dict keys, we need to enforce this better #TODO
            errors[('resources', 1, 'id')] = ['deu ruim']
            import ckan.lib.navl.dictization_functions as df
            del errors[('resources', 1)]
            del errors[('resources', 2)]
            breakpoint()
            out_errors = df.unflatten(errors)
            return data_dict, out_errors


    # def show_package_schema(self):
        # return

    def create_package_schema(self):
        def validator(key, flat_data, errors, context):
            pass
        schema = super().create_package_schema()
        schema['__after'] = validator
        return schema


    # IFacets
    def dataset_facets(self, facet_dict, package_type):
        facets = collections.OrderedDict()
        # get_action('package_list')(None, {})
        # asian = get_action('package_show')(None, {'id': 'asian-barometer'})
        facets['download_type'] = 'Forma de Download'
        facets['organization'] = 'Organização'
        facets['groups'] = 'Grupos'
        facets['tags'] = 'Tags'
        # facets['pais'] = 'País'
        # facets['nivel_observacao'] = 'Nivel da Observação'
        # facets['ano'] = 'Anos'
        return facets
        # OPTIONS: dict_keys(['license_title', 'maintainer', 'relationships_as_object', 'private',
        # 'maintainer_email', 'num_tags', 'id', 'metadata_created', 'owner_org', 'metadata_modified',
        # 'author', 'author_email', 'state', 'version', 'license_id', 'type', 'resources', 'num_resources',
        # 'tags', 'groups', 'creator_user_id', 'relationships_as_subject', 'name', 'isopen', 'url', 'notes',
        # 'title', 'extras', 'license_url', 'organization'])

    def group_facets(self, facets_dict, group_type, package_type): return self.dataset_facets(facets_dict, package_type)
    def organization_facets(self, facets_dict, organization_type, package_type): return self.dataset_facets(package_type)

    # IConfigurer
    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_public_directory(config_, 'assets')
        # toolkit.add_resource('fanstatic', 'basedosdados')
        toolkit.add_resource('assets', 'basedosdados')

    def get_helpers(self):
        import boltons.strutils
        import ckanext.basedosdados.template_functions as template_functions
        funs = _read_functions_from_module(template_functions)
        funs['boltons'] = boltons
        return funs

    # IValidators
    def get_validators(self):
        import ckanext.basedosdados.validator_functions as validators
        return _read_functions_from_module(validators)

    # IActions
    def get_actions(self):
        import ckanext.basedosdados.endpoint_functions as endpoints
        return _read_functions_from_module(endpoints)

def _read_functions_from_module(module):
    funs = { name: getattr(module, name) for name in dir(module) if not name.startswith('_')}
    funs = { k: v for k, v in funs.items() if isinstance(v, types.FunctionType) }
    return funs



def _find_duplicated_keys(a_dict):
        from collections import Counter
        keys_frequencies = Counter(i['key'] for i in a_dict)
        return {key for key, count in keys_frequencies.items() if count > 1}
