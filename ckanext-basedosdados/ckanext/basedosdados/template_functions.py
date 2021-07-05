import more_itertools
import stringcase

def separate_bdm_and_links_resources(resources):
    links, bdm =  more_itertools.partition(is_bdm, resources)
    return list(bdm), list(links)

def is_bdm(r):
    return r.get('resource_type') == 'bdm_table'

def is_bdm_one_click_download(r):
    size = r.get('bdm_file_size')
    return size != 'Unavailable' and type(size) == int and size > 10

def make_example_bq_query(resource, package):
    return f'''SELECT * FROM `basedosdados.{get_package_bdm_schema_name(package)}.{get_resource_bdm_table_name(resource)}` LIMIT 100'''
    
def make_example_python_query(resource, package):
    return f'''import basedosdados as bd
# Para carregar o dado direto no pandas
df = bd.read_table(dataset_id='{get_package_bdm_schema_name(package)}', 
            table_id='{get_resource_bdm_table_name(resource)}',
            billing_project_id=<YOUR_PROJECT_ID>)'''

def make_example_r_query(resource, package):
    return f'''install.packages("basedosdados")
library("basedosdados")
# Defina o seu projeto no Google Cloud
set_billing_id("<YOUR_PROJECT_ID>")
# Para carregar o dado direto no R
query <- "SELECT * FROM `basedosdados.{get_package_bdm_schema_name(package)}.{get_resource_bdm_table_name(resource)}`"
df <- read_sql(query)
    '''
def get_package_bdm_schema_name(package):
    return stringcase.snakecase(package['name'])

def get_resource_bdm_table_name(resource):
    return resource['table_id']


from ckanext.basedosdados import validator
import functools

def load_json_schema():
    from jsonref import JsonRef, json
    from copy import deepcopy
    def to_schema(x, fields_to_remove):
        out = deepcopy(JsonRef.replace_refs(x.schema(), jsonschema=True)) # need deepcopy to create a proper dict, jsonref returns a dict-like object that is not json serializable
        _remove_complex_ckan_fields(out, fields_to_remove)
        _migrate_to_schema3(out) # migrate required to schema3 format to comply with jsonform
        return dict(out)
    resource_fields_to_delete = list(validator.external_link.table.Resource.__fields__) + ['resource_type']
    return {
        'external_link': to_schema(validator.external_link.table.ExternalLink, resource_fields_to_delete)
        ,'bdm_table':    to_schema(validator.bdm.table.BdmTable,     resource_fields_to_delete)
        #,'lai_request':  to_schema(validator.LaiRequest,   resource_fields_to_delete)
        ,'package':      to_schema(validator.ckan_default.package._CkanDefaults, validator.ckan_default.package._CkanDefaults.__fields__)
    }
load_json_schema = functools.update_wrapper(load_json_schema, functools.lru_cache(load_json_schema)) # lru_cache messes up function name so we fix it here

def _remove_complex_ckan_fields(package, fields_to_remove):
    for field in fields_to_remove:
        del package['properties'][field]
        if field in package['required']:
            package['required'].remove(field)

def _migrate_to_schema3(schema):
    if schema.get('type') == 'object':
        for f in schema.get('required', []):
            field = schema.get('properties', {}).get(f, {})
            field['required'] = True
        for sub_schema in schema.get('properties', {}).values():
            _migrate_to_schema3(sub_schema)


def get_possible_resource_types():
    return [{'name': i, 'value': i} for i in validator.ckan_default.resource.RESOURCE_TYPES]
