import ckan.plugins as plugins
import ckan.plugins.toolkit as toolkit
from ckan.plugins.toolkit import get_action
import collections

class BasedosdadosPlugin(plugins.SingletonPlugin, ):#toolkit.DefaultDatasetForm):
    plugins.implements(plugins.IConfigurer)
    plugins.implements(plugins.interfaces.IFacets)
    # plugins.implements(plugins.IDatasetForm)

    # IFacets
    def dataset_facets(self, facet_dict, package_type):
        facets = collections.OrderedDict()
        # get_action('package_list')(None, {})
        # asian = get_action('package_show')(None, {'id': 'asian-barometer'})
        facets['ip_brasileiro'] = 'Forma de Download'
        for key, value in facet_dict.items():
            facets[key] = value
        return facets


    # IConfigurer
    def update_config(self, config_):
        toolkit.add_template_directory(config_, 'templates')
        toolkit.add_public_directory(config_, 'public')
        toolkit.add_public_directory(config_, 'assets')
        # toolkit.add_resource('fanstatic', 'basedosdados')
        toolkit.add_resource('assets', 'basedosdados')
