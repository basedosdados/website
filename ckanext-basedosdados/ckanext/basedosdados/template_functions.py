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
    return f'''SELECT * FROM `basedosdados.{get_package_bdm_schema_name(package)}.{resource['name']}` LIMIT 100'''
    
def make_example_python_query(resource, package):
    return f'''import basedosdados as bd
# Para carregar o dado direto no pandas
bd.read_table(dataset_id='{get_package_bdm_schema_name(package)}', 
            table_id='{resource['name']}',
            billing_project_id=<YOUR_PROJECT_ID>)'''

def make_example_r_query(resource, package):
    return f'''if (!require("bigrquery")) install.packages("bigrquery")
library("bigrquery")
billing_project_id = "<YOUR_PROJECT_ID>"
# Para baixar a tabela inteira
query = "SELECT * FROM `basedosdados.{get_package_bdm_schema_name(package)}.{resource['name']}`"
d <- bq_table_download(bq_project_query(billing_project_id, query), page_size=500, bigint="integer64")
    '''
def get_package_bdm_schema_name(package):
    return stringcase.snakecase(package['name'])

def get_resource_bdm_table_name(resource):
    return resource['name']


from ckanext.basedosdados import validator

def load_json_schema():
    from jsonref import JsonRef, json
    def to_schema(x, fields_to_remove):
        out = JsonRef.replace_refs(x.schema(), jsonschema=True)
        _remove_complex_ckan_fields(out, fields_to_remove)
        return out
    resource_fields_to_delete = list(validator.resource.Resource.__fields__) + ['resource_type']
    return json.dumps({
        'external_link': to_schema(validator.resource.ExternalLink, resource_fields_to_delete)
        ,'bdm_table':    to_schema(validator.resource.BdmTable,     resource_fields_to_delete)
        #,'lai_request':  to_schema(validator.resource.LaiRequest,   resource_fields_to_delete)
        ,'package':      to_schema(validator.package.Package,       validator.package._CkanDefaults.__fields__)
    }, indent=2)

def _remove_complex_ckan_fields(package, fields_to_remove):
    for field in fields_to_remove:
        del package['properties'][field]
        if field in package['required']:
            package['required'].remove(field)

def get_possible_resource_types():
    return [{'name': i, 'value': i} for i in validator.resource.RESOURCE_TYPES]

