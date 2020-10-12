import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from ckan.plugins.toolkit import get_action
import collections

class BasedosdadosPlugin(plugins.SingletonPlugin, ):#toolkit.DefaultDatasetForm):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.interfaces.IFacets)
    # plugins.implements(plugins.interfaces.ITemplateHelpers)
    # plugins.implements(plugins.IDatasetForm)

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

#     def get_helpers(self):
#         return {'announcement_block_content': announcement_block_content}
# 
# def announcement_block_content():
#     return
