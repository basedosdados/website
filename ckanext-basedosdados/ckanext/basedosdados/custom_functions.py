import more_itertools
import stringcase

def separate_bdm_and_links_resources(resources):
    links, bdm =  more_itertools.partition(is_bdm, resources)
    return bdm, links

def is_bdm(r):
    return r['is_bdm'] or 'bd+' in r['formato'] or '(BD+)' in r['name']

def make_example_select_query(resource, package):
    return f'''SELECT * FROM "basedosdados.{get_package_bdm_schema_name(package)}.{resource['name']}" LIMIT 100'''

def get_package_bdm_schema_name(package):
    return stringcase.snakecase(package['name'])
