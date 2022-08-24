import importlib.resources
import pandas

import os 
dir_path = os.path.dirname(os.path.realpath(__file__))

import ckanext.basedosdados.validator.available_options.people as people

with importlib.resources.path(
    people, "people.csv"
) as path:
    PEOPLE = pandas.read_csv(path)
    PEOPLE.fillna('', inplace=True)
    PEOPLE.rename(
        columns={
            'id': 'id',
            'nome': 'name',
            'descricao': 'description',
            'email': 'email',
            'twitter': 'twitter',
            'github': 'github',
            'website': 'website',
            'linkedin': 'linkedin',
            'url_foto': 'photo_url',
        },
        inplace=True
    )

with importlib.resources.path(
    people, "teams.csv"
) as path:
    TEAMS = pandas.read_csv(path)
    TEAMS.fillna('', inplace=True)
    TEAMS.rename(
        columns={
            'id_pessoa': 'person_id',
            'nome_pessoa': 'person_name',
            'equipe': 'team',
            'cargo': 'role',
            'nivel': 'level',
            'data_inicio' : 'start_date',
            'data_fim' : 'end_date'
        },
        inplace=True
    )
