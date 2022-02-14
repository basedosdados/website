
import os, json, re, requests
import json
import inflection

def download_packages(ORIGINAL_CKAN_URL,env):
    api_url = ORIGINAL_CKAN_URL + '/api/3/action/package_search?q=&rows=3000'
    packages = requests.get(api_url, verify=False).json()['result']['results']
    for p in packages:
        if not os.path.isdir(f"packages/"):
            os.mkdir(f'packages/')
        if not os.path.isdir(f"packages/{env}"):
            os.mkdir(f'packages/{env}')
        name= p['name']
        json.dump(p, open(f'packages/{env}/{name}', 'w'))
    return packages

def missing_dataset_id(resource):
	return resource['dataset_id'] is None

def list_resources_with_no_dataset_id(packages):

	l_bdm = []
	l_rest = []

	for package in packages:
		for resource in package['resources']:
			if 'dataset_id' not in resource:
				if resource['resource_type'] == 'bdm_table':
					l_bdm.append({package['name']:resource['name']})
				else:
					l_rest.append({package['name']:resource['name']})
	
	return l_bdm, l_rest

def list_tables_with_no_columns(packages):

	l_bdm = []

	for package in packages:
		for resource in [resource for resource in package['resources'] if resource['resource_type'] == 'bdm_table']:
			if 'columns' not in resource:
				l_bdm.append({package['name']:resource['name']})
	
	return l_bdm

def list_external_links_with_missing_fields(packages):

	l = []

	for package in packages:
		
		for resource in package['resources']:
			
			if resource['resource_type'] in ['external_link']:
				
				if ('url' not in resource):

					l.append({package['name']:resource['name']})
					
	return l

def list_columns_with_missing_fields(packages):

	l = []

	for package in packages:
		
		for resource in package['resources']:
			
			if resource['resource_type'] in ['bdm_table', 'bdm_dictionary']:
				
				if 'columns' not in resource:
					print('{}:{}'.format(package['name'],resource['name']))
				#assert 'columns' in resource
					#print(package['name'], resource['name'])
					#break
				else:
					for column in resource['columns']:
						
						if 'name' not in column:
							l.append(package['name'])

						elif ('bigquery_type' not in column or
							'description' not in column or
							'has_sensitive_data' not in column or
							'covered_by_dictionary' not in column):

							l.append({package['name']:'{}_{}'.format(resource['name'],column['name'])})
					
	return l

def replace_missing_dataset_ids(package):

	dataset_id = inflection.underscore(package['name'])

	for resource in package['resources']:
		
		if 'dataset_id' not in resource or resource['dataset_id'] != dataset_id:
			resource['dataset_id'] = dataset_id
		
	return package

def create_missing_entity_fields(package):

	for i, resource in enumerate(package['resources']):
		
		if 'entity' not in resource:
			package['resources'][i]['entity'] = []
	
	return package

def create_format_field(package):

	for i, resource in enumerate(package['resources']):
		
		if 'format' not in resource or resource['format'] is None:
			package['resources'][i]['format'] = ''
	
	return package

def create_short_description_field(package):

	package['short_description'] = ''

	return package

def create_partner_organization_field(package):
	
	field = {'name': '', 'organization_id': ''}
	
	for i, resource in enumerate(package['resources']):
		if resource['resource_type'] in ['bdm_table', 'information_request']:
			resource['partner_organization'] = field
		package['resources'][i] = resource
	
	return package

def replace_missing_column_fields(package):

	substring_list = ['cpf', 'cnpj', 'nome', 'endereco']

	for resource in package['resources']:
		
		if resource['resource_type'] in ['bdm_table', 'bdm_dictionary']:
			
			assert 'columns' in resource
				#print(package['name'], resource['name'])
				#break

			for column in resource['columns']:
				
				if 'has_sensitive_data' not in column:
					column['has_sensitive_data'] = 'no'
				else:
					if column['has_sensitive_data'] is None:
						if any(substring in column['name'] for substring in substring_list):
							column['has_sensitive_data'] = 'no'
						else:
							column['has_sensitive_data'] = 'yes'
				
				if 'covered_by_dictionary' not in column or column['covered_by_dictionary'] is None:
					column['covered_by_dictionary'] = 'no'

	return package

def migrate_time_unit(package):
	
	for i, resource in enumerate(package['resources']):
		if 'time_unit' not in resource:
			pass
		elif resource['time_unit'] != '':
			
			# converts derived years to year
			if resource['time_unit'] in ['one_year', 'two_years', 'three_years', 'four_years', 'five_years', 'ten_years']:
				updated_time_unit = 'year'
			elif resource['time_unit'] in ['unique', 'recurring', 'uncertain', 'other']:
				updated_time_unit = None
			else:
				updated_time_unit = resource['time_unit']
			
			if 'entity' not in resource or resource['entity'] is None:
				resource['entity'] = updated_time_unit
			elif resource['entity'] is not None and isinstance(resource['entity'], list):
				#resource['entity'] = resource['entity'] + ', ' + resource['time_unit']
				resource['entity'].append(updated_time_unit)
		
		package['resources'][i] = resource

	return package

def migrate_data_cleaning_code_url(package):

	for i, resource in enumerate(package['resources']):
		if resource['resource_type'] == 'bdm_table':
			if 'code_url' in resource['data_cleaned_by']:
				resource['data_cleaning_code_url'] = resource['data_cleaned_by']['code_url']
			else:
				resource['data_cleaning_code_url'] = ''

			updated_field = {}
			for key, value in resource['data_cleaned_by'].items():
				if key != 'code_url':
					updated_field[key] = value
			resource['data_cleaned_by'] = updated_field

		package['resources'][i] = resource

	return package

def standardize_old_spatial_coverage(package):

	for k, resource in enumerate(package['resources']):
		
		if resource['name'] == 'dicionario' and 'spatial_coverage' in resource:
			del resource['spatial_coverage']
		else:
			if 'spatial_coverage' in resource:
				if resource['spatial_coverage'] == 'all':
					resource['spatial_coverage'] = {'continent': None,
													'country': None,
													'admin1': None,
													'admin2': None}
				elif resource['spatial_coverage'] == 'south_america':
					resource['spatial_coverage'] = {'continent': ['south_america'],
													'country': None,
													'admin1': None,
													'admin2': None}
				elif resource['spatial_coverage'] == 'north_america':
					resource['spatial_coverage'] = {'continent': ['north_america'],
													'country': None,
													'admin1': None,
													'admin2': None}
				elif resource['spatial_coverage'] == 'europe':
					resource['spatial_coverage'] = {'continent': ['europe'],
													'country': None,
													'admin1': None,
													'admin2': None}
				elif resource['spatial_coverage'] == 'bra':
					resource['spatial_coverage'] = {'continent': ['south_america'],
													'country': ['bra'],
													'admin1': None,
													'admin2': None}
				elif resource['spatial_coverage'] == 'bra,id_uf_35':
					resource['spatial_coverage'] = {'continent': ['south_america'],
													'country': ['bra'],
													'admin1': ['id_uf_35'],
													'admin2': None}
				elif resource['spatial_coverage'] == 'bra,BA, CE, DF, MG, PA, PE, PR, RJ, SP':
					resource['spatial_coverage'] = {'continent': ['south_america'],
													'country': ['bra'],
													'admin1': ['id_uf_29', 'id_uf_23', 'id_uf_53', 'id_uf_31', 'id_uf_15', 'id_uf_26', 'id_uf_41', 'id_uf_33', 'id_uf_35'],
													'admin2': None}
				elif resource['spatial_coverage'] == 'bra,PA, MG, PR, DF, CE, RS, PE, RJ, BA, SP':
					resource['spatial_coverage'] = {'continent': ['south_america'],
													'country': ['bra'],
													'admin1': ['id_uf_29', 'id_uf_23', 'id_uf_53', 'id_uf_31', 'id_uf_15', 'id_uf_26', 'id_uf_41', 'id_uf_43', 'id_uf_33', 'id_uf_35'],
													'admin2': None}
				elif resource['spatial_coverage'] == 'bra,id_uf_33,id_uf_33':
					resource['spatial_coverage'] = {'continent': ['south_america'],
													'country': ['bra'],
													'admin1': ['id_uf_33'],
													'admin2': None}
				else:
					pass
			
			else:
				pass
		
		package['resources'][k] = resource
	
	return package

def migrate_spatial_coverage(package):

	mapping = {
		'bra': 'br',
		'usa': 'us',
		'arg': 'ar', 
		'bol': 'bo', 
		'chl': 'cl', 
		'col': 'co', 
		'can': 'ca', 
		'mex': 'mx', 
		'deu': 'de', 
		'esp': 'es', 
		'fra': 'fr', 
		'ita': 'it', 
		'prt': 'pt', 
		'gbr': 'gb',
		'rus': 'ru', 
		'chn': 'cn', 
		'ind': 'in', 
		'tha': 'th', 
		'jpn': 'jp', 
		'mys': 'my', 
		'idn': 'id', 
		'zaf': 'za',
		'aus': 'au', 
	}

	for k, resource in enumerate(package['resources']):

		if 'spatial_coverage' in resource and resource['spatial_coverage'] not in [None, {}]:
			
			if 'continent' in resource['spatial_coverage'] and resource['spatial_coverage']['continent'] is None:
				resource['spatial_coverage'] = None
			elif ('continent' in resource['spatial_coverage'] and 
				resource['spatial_coverage']['continent'] is not None and
				'all' in resource['spatial_coverage']['continent']):
				resource['spatial_coverage'] = []
			elif resource['spatial_coverage'] == {'continent': ['south_america'],
											'country': None,
											'admin1': None,
											'admin2': None}:
				resource['spatial_coverage'] = [
					{
						'continent': 'south_america'
					}
				]
			elif resource['spatial_coverage'] == {'continent': ['north_america'],
											'country': None,
											'admin1': None,
											'admin2': None}:
				resource['spatial_coverage'] = [
					{
						'continent': 'north_america'
					}
				]
			elif resource['spatial_coverage'] == {'continent': ['europe'],
											'country': None,
											'admin1': None,
											'admin2': None}:
				resource['spatial_coverage'] = [
					{
						'continent': 'europe'
					}
				]
			elif (resource['spatial_coverage']['continent'] not in [None, []] and 
				('country' in resource['spatial_coverage'] and resource['spatial_coverage']['country'] not in [None, []]) and
				('admin1' not in resource['spatial_coverage'] or resource['spatial_coverage']['admin1'] in [None, []])):
				sc = [
					{
						'continent': resource['spatial_coverage']['continent'][0],
						'country': mapping[resource['spatial_coverage']['country'][0]]
					}
				]
				resource['spatial_coverage'] = sc
			elif (
				('continent' in resource['spatial_coverage'] and resource['spatial_coverage']['continent'] not in [None, []]) and 
				('country' in resource['spatial_coverage'] and resource['spatial_coverage']['country'] not in [None, []]) and
				('admin1' in resource['spatial_coverage'] and resource['spatial_coverage']['admin1'] not in [None, []]) and
				('admin2' not in resource['spatial_coverage'] or resource['spatial_coverage']['admin2'] in [None, []])):

				sc = []
				if len(resource['spatial_coverage']['admin1']) >= 15:
					sc.append(
						{
							'continent': resource['spatial_coverage']['continent'][0],
							'country': mapping[resource['spatial_coverage']['country'][0]],
						}
					)
				else:
					for admin1 in resource['spatial_coverage']['admin1']:
						sc.append(
							{
								'continent': resource['spatial_coverage']['continent'][0],
								'country': mapping[resource['spatial_coverage']['country'][0]],
								'admin1': admin1
							}
						)
				resource['spatial_coverage'] = sc
			else:
				resource['spatial_coverage'] = []
		
		else:
			resource['spatial_coverage'] = None
		
		package['resources'][k] = resource

	return package

def migrate_country_ip_address_required(package):

	mapping = {
		'bra': 'br',
		'usa': 'us',
		'arg': 'ar', 
		'bol': 'bo', 
		'chl': 'cl', 
		'col': 'co', 
		'can': 'ca', 
		'mex': 'mx', 
		'deu': 'de', 
		'esp': 'es', 
		'fra': 'fr', 
		'ita': 'it', 
		'prt': 'pt', 
		'gbr': 'gb',
		'rus': 'ru', 
		'chn': 'cn', 
		'ind': 'in', 
		'tha': 'th', 
		'jpn': 'jp', 
		'mys': 'my', 
		'idn': 'id', 
		'zaf': 'za',
		'aus': 'au', 
	}

	for k, resource in enumerate(package['resources']):
		if 'country_ip_address_required' in resource and resource['country_ip_address_required'] not in [None, '']:
			countries = []
			for country in resource['country_ip_address_required']:
				countries.append(mapping[country])
			resource['country_ip_address_required'] = countries
			
			package['resources'][k] = resource
	
	return package

def migrate_spatial_coverage_keys(package):

	#TODO: convert id_uf_35 to SP
	#TODO: convert id_municipio_1100015 to 1100015

	return package

def subLists(l):
    lists = [[]]
    for i in range(len(l) + 1):
        for j in range(i):
            lists.append(l[j: i])
    return lists

def stepsList(l):

	steps = [l[n]-l[n-1] for n in range(1,len(l))]
	diff = list(set(steps))

	return diff

def migrate_temporal_coverage_field(l):

	if str in [type(element) for element in l]:
		return l
	
	elif len(l) == 1:
		return [str(element) for element in l]
	
	else:
		
		l = sorted(list(set(l))) # to avoid negative steps
		
		steps = [l[n]-l[n-1] for n in range(1,len(l))]
		diff = list(set(steps))
		
		step = min(diff)
		sublists = subLists(l)
		largest_sublists = []
		for element in l:
			sls = [sl for sl in sublists if element in sl and ((len(stepsList(sl)) == 1 and stepsList(sl)[0] == step) or len(sl) == 1)]
			max_sl = max(sls, key=len)
			largest_sublists.append(max_sl)

		lists = [list(item) for item in set(tuple(row) for row in largest_sublists)]

		intervals = []
		for l in lists:

			steps = [l[n]-l[n-1] for n in range(1,len(l))]
			diff = list(set(steps))

			if len(l) == 1:
				intervals.append([str(x) for x in l])
			else:
				if len(diff) == 1:
					first = l[0]
					last = l[-1]
					unit = diff[0]
					intervals.append(['{}({}){}'.format(first, unit, last)])
				else:
					lists = []
					previous_step = steps[0]
					sub_list = [l[0]]
					for i, step in enumerate(steps[1:]):
						if step == previous_step:
							sub_list.append(step)
						else:
							sub_list.append(l[i+1])
							lists.append(sub_list)
							sub_list = []
						previous_step = step
					intervals.append(lists)

		updated_temporal_coverage = sorted([item for sublist in intervals for item in sublist])

		return updated_temporal_coverage
	
def migrate_temporal_coverage(package):

	for i, resource in enumerate(package['resources']):

		if 'temporal_coverage' in resource and resource['temporal_coverage'] is not None and resource['temporal_coverage'] != []:
			try:
				resource['temporal_coverage'] = migrate_temporal_coverage_field(resource['temporal_coverage'])
			except:
				print(resource['name'], resource['temporal_coverage'])
		else:
			resource['temporal_coverage'] = []

		if resource['resource_type'] == 'bdm_table':
			for j, column in enumerate(resource['columns']):
				if 'temporal_coverage' in column and column['temporal_coverage'] is not None and column['temporal_coverage'] != []:
					column['temporal_coverage'] = migrate_temporal_coverage_field(column['temporal_coverage'])
				else:
					column['temporal_coverage'] = []
				
				resource['columns'][j] = column
		
		package['resources'][i] = resource
	
	return package

def fill_out_observation_level_from_identifying_columns(resource, sols):

	for identifying_column in resource['identifying_columns']:

		# find index of corresponding entity and country
		i = None
		for k, sol in enumerate(sols):
			if sol[2] in identifying_column:
				i = k
		
		# if identifying_column is in standard
		if i is not None:
			country = sols[i][0]
			entity = sols[i][1]

			# if corresponding entity already exists:
			if entity in [ol['entity'] for ol in resource['observation_level'] if 'entity' in ol]:
				
				# paste identifying_column in correct place
				for k, ol in enumerate(resource['observation_level']):
					if 'entity' in ol and ol['entity'] == entity:
						resource['observation_level'][k]['column'] = [identifying_column]
						if 'country' in resource['observation_level'][k]:
							resource['observation_level'][k]['country'] = country
			
			else:
				if country == '':
					dict = {'entity': entity, 'columns': [identifying_column]}
				else:
					dict = {'country': country, 'entity': entity, 'columns': [identifying_column]}
				resource['observation_level'].append(dict)
		
		else:
			dict = {'columns': [identifying_column]}
			resource['observation_level'].append(dict)

	return resource

def migrate_observation_level(package):

	for i, resource in enumerate(package['resources']):
		
		if resource['name'] == 'dicionario':
			if 'observation_level' in resource:
				del resource['observation_level']

		else:

			if 'observation_level' in resource:
				pass

			else:

				resource['observation_level'] = []

				if 'entity' in resource and resource['entity'] not in [None, []]:
					
					for k, entity in enumerate(resource['entity']):

						# migrate entity
						resource['observation_level'].append({'entity': entity})

						# fill out country for common spatial entities
						if entity in ['municipality', 'district', 'census_tract']:
							resource['observation_level'][k]['country'] = 'br'
						elif entity in ['county']:
							resource['observation_level'][k]['country'] = 'us'

				if 'identifying_columns' in resource and resource['identifying_columns'] not in [None, []]:
					
					standard_observation_levels = [
						['', 'year', 'ano'],
						['', 'quarter', 'trimestre'],
						['', 'month', 'mes'],
						['', 'day', 'dia'],
						['', 'date', 'data'],
						['br', 'state', 'sigla_uf'],
						['br', 'state', 'id_uf'],
						['br', 'municipality', 'id_municipio'],
						['br', 'district', 'id_distrito'],
						['br', 'census_tract', 'id_setor_censitario'],
					]

					resource = fill_out_observation_level_from_identifying_columns(resource, standard_observation_levels)
			
		package['resources'][i] = resource

	return package

def migrate_partitions_field(package):
	
	for k, resource in enumerate(package['resources']):
		if resource['resource_type'] == 'bdm_table':
			if 'partitions' in resource and resource['partitions'] not in [None, '']:
				if type(resource['partitions']) == list:
					pass
				else:
					resource['partitions'] = resource['partitions'].replace(",", " ")
					resource['partitions'] = resource['partitions'].split()
			else:
				resource['partitions'] = []
		
		package['resources'][k] = resource

	return package

def migrate_measurement_unit_field(package):

	for k, resource in enumerate(package['resources']):
		if resource['resource_type'] == 'bdm_table':
			if 'columns' in resource and resource['columns'] not in [None, []]:
				for j, column in enumerate(resource['columns']):
					if 'measurement_unit' in column and column['measurement_unit'] is not None:
						column['measurement_unit'] = column['measurement_unit'].replace("2", "^2")
						column['measurement_unit'] = column['measurement_unit'].replace("3", "^3")

				resource['columns'][j] = column

		package['resources'][k] = resource
		
	return package

def migrate_external_link_title_to_name(package):

	for k, resource in enumerate(package['resources']):
		if resource['resource_type'] == 'external_link':
			if 'name' in resource and resource['name'] == '':
				if 'title' in resource and resource['title'] != '':
					resource['name'] = resource['title']

		package['resources'][k] = resource
		
	return package

def migrate_notes_field(package):

	if 'notes' in package and package['notes'] != '': 
		package['description'] = package['notes']
		package['notes'] = ''
	
	return package

def list_datasets(packages, condition):

	l = []

	for package in packages:
		for resource in package['resources']:
			if resource['resource_type'] == 'bdm_table':
				if condition(resource):
					l.append(package['name'])
					break
	
	return l

def list_resources_with_no_entity(packages):

	l = []

	for package in packages:
		for resource in package['resources']:
			if 'entity' not in resource or resource['entity'] == []:
				l.append({package['name']:resource['name']})
	
	return l

def delete_package_field(package, field):

	updated_package = {}

	for key, value in package.items():
		if key != field:
			updated_package[key] = value

	return updated_package

def delete_package_dataset_id(package):

	package['extras'][0]['value'] = {}

	return package

def delete_resource_field(package, resource_type, field):

	for i, resource in enumerate(package['resources']):
		if resource['resource_type'] == resource_type:
			updated_resource = {}
			for key, value in resource.items():
				if key != field:
					updated_resource[key] = value
			package['resources'][i] = updated_resource
	
	return package
