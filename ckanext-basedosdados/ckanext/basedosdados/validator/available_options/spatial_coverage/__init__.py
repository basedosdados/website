from ..attr_enum import AttrEnum
from typing import List, Union, Optional, Dict
from pydantic import BaseModel
import pandas
import importlib.resources

def build_areas_from_csv(csv_path):
    df = pandas.read_csv(csv_path)['id label__pt'.split()]
    def create_area(row):
        key = row['id']
        value = {'label': {k.removeprefix('label__'): v for k, v in row.items() if k.startswith('label__')}}
        Area(id=key, **value)
    for row in df.to_dict(orient='records'):
        create_area(row) 

SpatialCoverageAreas = {}
class Area(BaseModel):
    id: str
    label: Dict[str, str]


    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        SpatialCoverageAreas[self.id] = self

    @property
    def _tree_id(self):
        return self.id if self.id != 'world' else ''

    def parent(self):
        if self.id == 'world': return None
        if not '.' in self._tree_id: return SpatialCoverageAreas['world']
        return SpatialCoverageAreas[self._tree_id.rsplit('.', 1)[0]]

    def children(self):
        return [SpatialCoverageAreas[area] for area in SpatialCoverageAreas if area.startswith(self._tree_id)]

    def __contains__(a, b):
        if isinstance(b, AreaUnion):
            return all(b_sub in a for b_sub in b.areas)
        return b.id.startswith(a._tree_id)

    def __add__(a, b):
        if b in a: return a
        if a in b: return b
        return AreaUnion(areas=[a,b])

Area(id='world', label={'pt': 'Mundo'})

class AreaUnion(BaseModel): 
    areas: List[Area]
    def __contains__(self, b):
        for a in self.areas:
            if b in a: return True
        return False

    def __add__(self, b):
        if b in self: return self
        areas = [a for a in self.areas if a not in b]
        areas.append(b)
        return AreaUnion(areas=areas)
        # TODO: check if union can be represented by fewer higher level Areas. Ex rj + sp + mg + ... = BR


import ckanext.basedosdados.validator.available_options.spatial_coverage as spatial_coverage
with importlib.resources.path(spatial_coverage, 'municipio_brazil.csv') as path: # TODO: mudar isso aqui pra ler o arquivo certo
    build_areas_from_csv(path)





################### TODO: delete below






class ContinentEnum(AttrEnum):
    # fmt: off
    africa          = {"label": "África"}
    north_america   = {"label": "América do Norte"}
    central_america = {"label": "América Central"}
    south_america   = {"label": "América do Sul"}
    asia            = {"label": "Ásia"}
    europe          = {"label": "Europa"}
    oceania         = {"label": "Oceania"}
    antarctica      = {"label": "Antártica"}
    # fmt: on


class CountryEnum(AttrEnum):
    # country codes from ISO 3166
    # https://www.iban.com/country-codes

    # fmt: off
    br = {"label": "Brasil"}
    ar = {"label": "Argentina"}
    bo = {"label": "Bolívia"}
    cl = {"label": "Chile"}
    co = {"label": "Colômbia"}
    ca = {"label": "Canadá"}
    us = {"label": "Estados Unidos da América"}
    mx = {"label": "México"}
    de = {"label": "Alemanha"}
    es = {"label": "Espanha"}
    fr = {"label": "França"}
    it = {"label": "Itália"}
    pt = {"label": "Portugal"}
    gb = {"label": "Reino Unido"}
    ru = {"label": "Rússia"}
    cn = {"label": "China"}
    #in = {"label": "Índia"}
    th = {"label": "Tailândia"}
    jp = {"label": "Japão"}
    my = {"label": "Malásia"}
    id = {"label": "Indonésia"}
    za = {"label": "África do Sul"}
    au = {"label": "Austrália"}
    # fmt: on


class Admin1Enum(AttrEnum):
    # por enquanto só para Brasil

    # fmt: off
    id_uf_12 = {"label": "Acre"}
    id_uf_27 = {"label": "Alagoas"}
    id_uf_13 = {"label": "Amazônia"}
    id_uf_16 = {"label": "Amapá"}
    id_uf_29 = {"label": "Bahia"}
    id_uf_23 = {"label": "Ceará"}
    id_uf_53 = {"label": "Distrito Federal"}
    id_uf_32 = {"label": "Espírito Santo"}
    id_uf_52 = {"label": "Goiás"}
    id_uf_21 = {"label": "Maranhão"}
    id_uf_31 = {"label": "Minas Gerais"}
    id_uf_50 = {"label": "Mato Grosso do Sul"}
    id_uf_51 = {"label": "Mato Grosso"}
    id_uf_15 = {"label": "Pará"}
    id_uf_25 = {"label": "Paraíba"}
    id_uf_26 = {"label": "Pernambuco"}
    id_uf_22 = {"label": "Piauí"}
    id_uf_41 = {"label": "Paraná"}
    id_uf_33 = {"label": "Rio de Janeiro"}
    id_uf_24 = {"label": "Rio Grande do Norte"}
    id_uf_11 = {"label": "Rondônia"}
    id_uf_14 = {"label": "Roraima"}
    id_uf_43 = {"label": "Rio Grande do Sul"}
    id_uf_42 = {"label": "Santa Catarina"}
    id_uf_28 = {"label": "Sergipe"}
    id_uf_35 = {"label": "São Paulo"}
    id_uf_17 = {"label": "Tocantins"}
    # fmt: on


class Admin2Enum(AttrEnum):
    # por enquanto só para capitais de UFs no Brasil

    # fmt: off
    id_municipio_1100205 = {"label": "Porto Velho"}
    id_municipio_1200401 = {"label": "Rio Branco"}
    id_municipio_1302603 = {"label": "Manaus"}
    id_municipio_1400100 = {"label": "Boa Vista"}
    id_municipio_1501402 = {"label": "Belém"}
    id_municipio_1600303 = {"label": "Macapá"}
    id_municipio_1721000 = {"label": "Palmas"}
    id_municipio_2111300 = {"label": "São Luís"}
    id_municipio_2211001 = {"label": "Teresina"}
    id_municipio_2304400 = {"label": "Fortaleza"}
    id_municipio_2408102 = {"label": "Natal"}
    id_municipio_2507507 = {"label": "João Pessoa"}
    id_municipio_2611606 = {"label": "Recife"}
    id_municipio_2704302 = {"label": "Maceió"}
    id_municipio_2800308 = {"label": "Aracaju"}
    id_municipio_2927408 = {"label": "Salvador"}
    id_municipio_3106200 = {"label": "Belo Horizonte"}
    id_municipio_3205309 = {"label": "Vitória"}
    id_municipio_3304557 = {"label": "Rio de Janeiro"}
    id_municipio_3550308 = {"label": "São Paulo"}
    id_municipio_4106902 = {"label": "Curitiba"}
    id_municipio_4205407 = {"label": "Florianópolis"}
    id_municipio_4314902 = {"label": "Porto Alegre"}
    id_municipio_5002704 = {"label": "Campo Grande"}
    id_municipio_5103403 = {"label": "Cuiabá"}
    id_municipio_5208707 = {"label": "Goiânia"}
    id_municipio_5300108 = {"label": "Brasília"}
    # fmt: on


class SpatialCoverage:
    def __init__(self):

        self.structure = {
            "entity": "continent",
            "directory_column": {
                "dataset_id": "br_bd_diretorios_mundo",
                "table_id": "continente",
                "column_name": "",
            },
            "coverage": [
                {
                    "entity": "country",
                    "directory_column": {
                        "dataset_id": "br_bd_diretorios_mundo",
                        "table_id": "pais",
                        "column_name": "sigla_pais_iso3",
                    },
                    "id": "br",
                    "admin_levels": {
                        "1": "state",
                        "2": "municipality",
                        "3": "district",
                        "4": "census_tract",
                    },
                    "coverage": {
                        "admin_level": "1",
                        "entity": "state",
                        "directory_column": {
                            "dataset_id": "br_bd_diretorios_br",
                            "table_id": "uf",
                            "column_name": "sigla_uf",
                        },
                        "coverage": {
                            "admin_level": "2",
                            "entity": "municipality",
                            "directory_column": {
                                "dataset_id": "br_bd_diretorios_br",
                                "table_id": "municipio",
                                "column_name": "id_municipio",
                            },
                            "coverage": {
                                "admin_level": "3",
                                "entity": "district",
                                "directory_column": {
                                    "dataset_id": "br_bd_diretorios_br",
                                    "table_id": "distrito",
                                    "column_name": "id_distrito",
                                },
                                "coverage": {
                                    "admin_level": "4",
                                    "entity": "census_tract",
                                    "directory_column": {
                                        "dataset_id": "br_bd_diretorios_br",
                                        "table_id": "setor_censitario",
                                        "column_name": "id_setor_censitario",
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    "entity": "country",
                    "directory_column": {
                        "dataset_id": "br_bd_diretorios_mundo",
                        "table_id": "pais",
                        "column_name": "sigla_pais_iso3",
                    },
                    "id": "us",
                    "admin_levels": {
                        "1": "state",
                        "2": "county",
                        "3": "neighborhood",
                    },
                    "coverage": {
                        "admin_level": "1",
                        "entity": "state",
                        "directory_column": {
                            "dataset_id": "br_bd_diretorios_us",
                            "table_id": "uf",
                            "column_name": "sigla_uf",
                        },
                        "coverage": {
                            "admin_level": "2",
                            "entity": "county",
                            "directory_column": {
                                "dataset_id": "br_bd_diretorios_us",
                                "table_id": "condado",
                                "column_name": "id_condado",
                            },
                            "coverage": {
                                "admin_level": "3",
                                "entity": "neighborhood",
                                "directory_column": {
                                    "dataset_id": "br_bd_diretorios_us",
                                    "table_id": "bairro",
                                    "column_name": "id_bairro",
                                },
                            },
                        },
                    },
                },
            ],
        }

        self.tree = [
            {
                "id": "africa",
                "label": {
                    "pt": "África",
                    "en": "Africa",
                },
                "spatial_coverage": [
                    {
                        "id": "za",
                        "label": {
                            "pt": "África do Sul",
                            "en": "South Africa",
                        },
                    },
                    {
                        "id": "ng",
                        "label": {
                            "pt": "Nigéria",
                            "en": "Nigeria",
                        },
                    },
                ],
            },
            {
                "id": "asia",
                "label": {
                    "pt": "Ásia",
                    "en": "Asia",
                },
                "spatial_coverage": [
                    {
                        "id": "cn",
                        "label": {
                            "pt": "China",
                            "en": "China",
                        },
                    },
                    {
                        "id": "ru",
                        "label": {
                            "pt": "Rússia",
                            "en": "Russia",
                        },
                    },
                ],
            },
            {
                "id": "europe",
                "label": {
                    "pt": "Europa",
                    "en": "Europe",
                },
                "spatial_coverage": [
                    {
                        "id": "de",
                        "label": {
                            "pt": "Alemanha",
                            "en": "Germany",
                        },
                    },
                    {
                        "id": "es",
                        "label": {
                            "pt": "Espanha",
                            "en": "Spain",
                        },
                    },
                    {
                        "id": "fr",
                        "label": {
                            "pt": "França",
                            "en": "France",
                        },
                    },
                    {
                        "id": "gb",
                        "label": {
                            "pt": "Reino Unido",
                            "en": "Great Britain",
                        },
                    },
                    {
                        "id": "pt",
                        "label": {
                            "pt": "Portugal",
                            "en": "Portugal",
                        },
                    },
                ],
            },
            {
                "id": "north_america",
                "label": {
                    "pt": "América do Norte",
                    "en": "North America",
                },
                "spatial_coverage": [
                    {
                        "id": "ca",
                        "label": {
                            "pt": "Canadá",
                            "en": "Canada",
                        },
                    },
                    {
                        "id": "mx",
                        "label": {
                            "pt": "México",
                            "en": "Mexico",
                        },
                    },
                    {
                        "id": "us",
                        "label": {
                            "pt": "Estados Unidos da América",
                            "en": "United States of America",
                        },
                    },
                ],
            },
            {
                "id": "oceania",
                "label": {
                    "pt": "Oceania",
                    "en": "Oceania",
                },
                "spatial_coverage": [
                    {
                        "id": "au",
                        "label": {
                            "pt": "Austrália",
                            "en": "Australia",
                        },
                    },
                    {
                        "id": "nz",
                        "label": {
                            "pt": "Nova Zelândia",
                            "en": "New Zealand",
                        },
                    },
                ],
            },
            {
                "id": "south_america",
                "label": {
                    "pt": "América do Sul",
                    "en": "South America",
                },
                "spatial_coverage": [
                    {
                        "id": "br",
                        "label": {
                            "pt": "Brasil",
                            "en": "Brazil",
                        },
                        "spatial_coverage": [
                            {
                                "id": "id_uf_11",
                                "label": {
                                    "pt": "Rondônia",
                                    "en": "Rondônia",
                                },
                            },
                            {
                                "id": "id_uf_12",
                                "label": {
                                    "pt": "Acre",
                                    "en": "Acre",
                                },
                            },
                            {
                                "id": "id_uf_13",
                                "label": {
                                    "pt": "Amazonas",
                                    "en": "Amazonas",
                                },
                            },
                            {
                                "id": "id_uf_14",
                                "label": {
                                    "pt": "Roraima",
                                    "en": "Roraima",
                                },
                            },
                            {
                                "id": "id_uf_15",
                                "label": {
                                    "pt": "Pará",
                                    "en": "Pará",
                                },
                            },
                            {
                                "id": "id_uf_16",
                                "label": {
                                    "pt": "Amapá",
                                    "en": "Amapá",
                                },
                            },
                            {
                                "id": "id_uf_17",
                                "label": {
                                    "pt": "Tocantins",
                                    "en": "Tocantins",
                                },
                            },
                            {
                                "id": "id_uf_21",
                                "label": {
                                    "pt": "Maranhão",
                                    "en": "Maranhão",
                                },
                            },
                            {
                                "id": "id_uf_22",
                                "label": {
                                    "pt": "Piauí",
                                    "en": "Piauí",
                                },
                            },
                            {
                                "id": "id_uf_23",
                                "label": {
                                    "pt": "Ceará",
                                    "en": "Ceará",
                                },
                            },
                            {
                                "id": "id_uf_24",
                                "label": {
                                    "pt": "Rio Grande do Norte",
                                    "en": "Rio Grande do Norte",
                                },
                            },
                            {
                                "id": "id_uf_25",
                                "label": {
                                    "pt": "Paraíba",
                                    "en": "Paraíba",
                                },
                            },
                            {
                                "id": "id_uf_26",
                                "label": {
                                    "pt": "Pernambuco",
                                    "en": "Pernambuco",
                                },
                            },
                            {
                                "id": "id_uf_27",
                                "label": {
                                    "pt": "Alagoas",
                                    "en": "Alagoas",
                                },
                            },
                            {
                                "id": "id_uf_28",
                                "label": {
                                    "pt": "Sergipe",
                                    "en": "Sergipe",
                                },
                            },
                            {
                                "id": "id_uf_29",
                                "label": {
                                    "pt": "Bahia",
                                    "en": "Bahia",
                                },
                            },
                            {
                                "id": "id_uf_31",
                                "label": {
                                    "pt": "Minas Gerais",
                                    "en": "Minas Gerais",
                                },
                                "spatial_coverage": [
                                    {
                                        "id": "id_municipio_3106200",
                                        "label": {
                                            "pt": "Belo Horizonte",
                                            "en": "Belo Horizonte",
                                        },
                                    }
                                ],
                            },
                            {
                                "id": "id_uf_32",
                                "label": {
                                    "pt": "Espírito Santo",
                                    "en": "Espírito Santo",
                                },
                            },
                            {
                                "id": "id_uf_33",
                                "label": {
                                    "pt": "Rio de Janeiro",
                                    "en": "Rio de Janeiro",
                                },
                                "spatial_coverage": [
                                    {
                                        "id": "id_municipio_3304557",
                                        "label": {
                                            "pt": "Rio de Janeiro",
                                            "en": "Rio de Janeiro",
                                        },
                                    }
                                ],
                            },
                            {
                                "id": "id_uf_35",
                                "label": {
                                    "pt": "São Paulo",
                                    "en": "São Paulo",
                                },
                                "spatial_coverage": [
                                    {
                                        "id": "id_municipio_3550308",
                                        "label": {
                                            "pt": "São Paulo",
                                            "en": "São Paulo",
                                        },
                                    }
                                ],
                            },
                            {
                                "id": "id_uf_41",
                                "label": {
                                    "pt": "Paraná",
                                    "en": "Paraná",
                                },
                            },
                            {
                                "id": "id_uf_42",
                                "label": {
                                    "pt": "Santa Catarina",
                                    "en": "Santa Catarina",
                                },
                            },
                            {
                                "id": "id_uf_43",
                                "label": {
                                    "pt": "Rio Grande do Sul",
                                    "en": "Rio Grande do Sul",
                                },
                            },
                            {
                                "id": "id_uf_50",
                                "label": {
                                    "pt": "Mato Grosso do Sul",
                                    "en": "Mato Grosso do Sul",
                                },
                            },
                            {
                                "id": "id_uf_51",
                                "label": {
                                    "pt": "Mato Grosso",
                                    "en": "Mato Grosso",
                                },
                            },
                            {
                                "id": "id_uf_52",
                                "label": {
                                    "pt": "Goiás",
                                    "en": "Goiás",
                                },
                            },
                            {
                                "id": "id_uf_53",
                                "label": {
                                    "pt": "Distrito Federal",
                                    "en": "Distrito Federal",
                                },
                            },
                        ],
                    },
                    {
                        "id": "ar",
                        "label": {
                            "pt": "Argentina",
                            "en": "Argentina",
                        },
                    },
                    {
                        "id": "bo",
                        "label": {
                            "pt": "Bolívia",
                            "en": "Bolivia",
                        },
                    },
                    {
                        "id": "cl",
                        "label": {
                            "pt": "Chile",
                            "en": "Chile",
                        },
                    },
                    {
                        "id": "co",
                        "label": {
                            "pt": "Colômbia",
                            "en": "Colombia",
                        },
                    },
                ],
            },
        ]

    def list_continents(self, label=False):

        l = []
        if self.tree:
            for continent in self.tree:
                if label:
                    l.append(continent["label"]["pt"])
                else:
                    l.append(continent["id"])

        return l

    def list_countries(self, label=False):

        l = []
        if self.tree:
            for continent in self.tree:
                if "spatial_coverage" in continent and continent["spatial_coverage"]:
                    for country in continent["spatial_coverage"]:
                        if label:
                            l.append(country["label"]["pt"])
                        else:
                            l.append(country["id"])

        return l

    def get_children(self, level, id=None, levels_below=1):

        if level == "world":
            if levels_below == 1:
                return [continent["id"] for continent in self.tree]
            elif levels_below == 2:
                return [
                    country["id"]
                    for continent in self.tree
                    if "spatial_coverage" in continent
                    for country in continent["spatial_coverage"]
                ]
            elif levels_below == 3:
                return [
                    admin1["id"]
                    for continent in self.tree
                    if "spatial_coverage" in continent
                    for country in continent["spatial_coverage"]
                    if "spatial_coverage" in country
                    for admin1 in country["spatial_coverage"]
                ]
            elif levels_below == 4:
                return [
                    admin2["id"]
                    for continent in self.tree
                    if "spatial_coverage" in continent
                    for country in continent["spatial_coverage"]
                    if "spatial_coverage" in country
                    for admin1 in country["spatial_coverage"]
                    if "spatial_coverage" in admin1
                    for admin2 in admin1["spatial_coverage"]
                ]
            else:
                return []

        elif level == "continent":
            for continent in self.tree:
                if continent["id"] == id:
                    if levels_below == 1:
                        return [
                            country["id"] for country in continent["spatial_coverage"]
                        ]
                    elif levels_below == 2:
                        for country in continent["spatial_coverage"]:
                            return [
                                admin1["id"]
                                for country in continent["spatial_coverage"]
                                if "spatial_coverage" in country
                                for admin1 in country["spatial_coverage"]
                            ]
                    elif levels_below == 3:
                        for country in continent["spatial_coverage"]:
                            return [
                                admin2["id"]
                                for country in continent["spatial_coverage"]
                                if "spatial_coverage" in country
                                for admin1 in country["spatial_coverage"]
                                if "spatial_coverage" in admin1
                                for admin2 in admin1["spatial_coverage"]
                            ]
            else:
                return []

        elif level == "country":
            for continent in self.tree:
                for country in continent["spatial_coverage"]:
                    if country["id"] == id:
                        if "spatial_coverage" in country:
                            if levels_below == 1:
                                return [
                                    admin1["id"]
                                    for admin1 in country["spatial_coverage"]
                                ]
                            elif levels_below == 2:
                                return [
                                    admin2["id"]
                                    for admin1 in country["spatial_coverage"]
                                    if "spatial_coverage" in admin1
                                    for admin2 in admin1["spatial_coverage"]
                                ]
                            else:
                                return []
                        else:
                            return []
                return []

        elif level == "admin1":
            for continent in self.tree:
                for country in continent["spatial_coverage"]:
                    if "spatial_coverage" in country:
                        for admin1 in country["spatial_coverage"]:
                            if admin1["id"] == id:
                                if "spatial_coverage" in admin1:
                                    if levels_below == 1:
                                        return [
                                            admin2["id"]
                                            for admin2 in admin1["spatial_coverage"]
                                        ]
                                    else:
                                        return []
                                else:
                                    return []
                    else:
                        return []
                return []

        else:
            return []
