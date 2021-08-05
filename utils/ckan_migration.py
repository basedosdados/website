import ast
import os
from ckanapi.errors import ValidationError
from ckanapi import RemoteCKAN
from functools import lru_cache
import re
import unidecode


def flatten(t):
    return [item for sublist in t for item in sublist]


class Migrate:
    def __init__(self, package_dict):
        self.package_dict = package_dict

    @property
    @lru_cache(maxsize=None)
    def ckan_api(self):

        # if not os.environ.get('CKAN_API_KEY'):
        #     print("You need to export environment variable `CKAN_API_KEY`. PLease generate an api key from this page: http://localhost:5000/user/dev/api-tokens")
        #     exit(1)

        user_agent = None
        CKAN_API_KEY = (
            CKAN_API_KEY
        ) = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1RUxycHVUV0ZRMXoxbXAwYWE5RjNNalpsZnlBbUpGZ3phUEZIYWxTTXg0eUxReV9UdnJjOHRudFhNeVNneHlLTWJSSmVNZGt4U0NwenU4QSIsImlhdCI6MTYyMTEyMzM5NH0.ePC4i_UpPK-98MCLV-pVjRD2cw1dykPFXeJpxNVUPwY"
        CKAN_URL = os.environ.get("CKAN_URL", "http://localhost:5000")

        return RemoteCKAN(CKAN_URL, user_agent=user_agent, apikey=CKAN_API_KEY)

    def validate(self):

        try:
            return self.ckan_api.action.package_validate(**self.package_dict)
        except ValidationError as e:
            return e.error_dict["message"]

    def _update_frequency(self, resource_dict):
        # map update_frequency values
        update_frequency_mapping = {
            "outro": None,
            "-": None,
            "vazio": None,
            "empty": None,
            "dia": "day",
            "mes": "month",
            "semana": "week",
            "ano": "one_year",
            "dez_anos": "ten_years",
            "trimestre": "quarter",
            "dois_anos": "two_years",
            "recorrente": "recurring",
            "sem_atualizacao": "unique",
            "1 ano": "one_year",
            "~ 7 anos": "five_years",
            "cinco_anos": "five_years",
            "1 trimestre": "quarter",
            "1 mês": "month",
            "~5 anos": "five_years",
            "3 horas": "hour",
            "semestre": "semester",
            "1 dia": "day",
            "2 anos": "two_years",
            "~2 anos": "two_years",
            "~3 anos": "three_years",
            "dia, semana, mês": None,
            "~1 mês": "month",
            "~6 meses": "semester",
            "~1 ano": "one_year",
            "5 anos": "five_years",
            "~4 anos": "four_years",
            "10 anos": "ten_years",
        }
        update_frequency = resource_dict.get("update_frequency", None)
        resource_dict["update_frequency"] = update_frequency_mapping.get(
            update_frequency, update_frequency
        )
        return resource_dict

    def _update_spatial_coverage(self, resource_dict):
        spatial_coverage_mapping = {
            "continent": {
                "vazio": None,
                "outro": None,
                "america_norte": ["north_america"],
                "africa": ["africa"],
                "europa": ["europe"],
                "internacional": ["all"],
                "america_sul": ["south_america"],
                "oriente_medio": ["asia"],
                "asia": ["asia"],
                "america_central": ["central_america"],
                "antartica": ["antarctica"],
                "oceania": ["oceania"],
            },
            "country": {
                "vazio": None,
                "outro": None,
                "franca": ["fra"],
                "india": ["ind"],
                "inglaterra": ["gbr"],
                "indonesia": ["idn"],
                "mexico": ["mex"],
                "china": ["chn"],
                "malasia": ["mys"],
                "brasil": ["bra"],
                "japao": ["jpn"],
                "colombia": ["col"],
                "africa-sul": ["zaf"],
                "russia": ["rus"],
                "EUA": ["usa"],
                "australia": ["aus"],
            },
            "admin1": {
                "vazio": None,
                "outro": None,
                "AC": ["id_uf_12"],
                "AL": ["id_uf_27"],
                "AM": ["id_uf_13"],
                "AP": ["id_uf_16"],
                "BA": ["id_uf_29"],
                "CE": ["id_uf_23"],
                "DF": ["id_uf_53"],
                "ES": ["id_uf_32"],
                "GO": ["id_uf_52"],
                "MA": ["id_uf_21"],
                "MG": ["id_uf_31"],
                "MS": ["id_uf_50"],
                "MT": ["id_uf_51"],
                "PA": ["id_uf_15"],
                "PB": ["id_uf_25"],
                "PE": ["id_uf_26"],
                "PI": ["id_uf_22"],
                "PR": ["id_uf_41"],
                "RJ": ["id_uf_33"],
                "RN": ["id_uf_24"],
                "RO": ["id_uf_11"],
                "RR": ["id_uf_14"],
                "RS": ["id_uf_43"],
                "SC": ["id_uf_42"],
                "SE": ["id_uf_28"],
                "SP": ["id_uf_35"],
                "TO": ["id_uf_17"],
                "todos": [
                    "id_uf_12",
                    "id_uf_27",
                    "id_uf_13",
                    "id_uf_16",
                    "id_uf_29",
                    "id_uf_23",
                    "id_uf_53",
                    "id_uf_32",
                    "id_uf_52",
                    "id_uf_21",
                    "id_uf_31",
                    "id_uf_50",
                    "id_uf_51",
                    "id_uf_15",
                    "id_uf_25",
                    "id_uf_26",
                    "id_uf_22",
                    "id_uf_41",
                    "id_uf_33",
                    "id_uf_24",
                    "id_uf_11",
                    "id_uf_14",
                    "id_uf_43",
                    "id_uf_42",
                    "id_uf_28",
                    "id_uf_35",
                    "id_uf_17",
                ],
            },
        }

        spatial_coverage = resource_dict.pop("spatial_coverage", None)
        if isinstance(spatial_coverage, dict):
            for key in spatial_coverage.keys():
                spatial_coverage[key] = spatial_coverage_mapping[key][
                    spatial_coverage[key]
                ]
            resource_dict["spatial_coverage"] = spatial_coverage

        return resource_dict

    def _update_entity(self, resource_dict):

        entity = resource_dict.get("entity", None)

        entity_mapping = {
            "municipio": "municipality",
            "pessoa": "person",
            "outro": None,
            "ataque": None,
            "pais": "country",
            "estado": "state",
            "livro": "book",
            "periodico": "journal",
            "artigo": "article",
            "filme_serie_clipe": "movie",
            "pintura": "painting",
            "partido": "party",
            "acordo_tratado": "agreement",
            "produto": "product",
            "jornal": "newspaper",
            "enchente": "disaster",
            "desastre": "disaster",
            "embarcacao": "ship",
            "pixel": None,
            "transacao": "transaction",
            "empresa": "company",
            "lei": "law",
            "ong": "ngo",
            "cidade": "city",
            "agencia": "agency",
            "condado": "county",
            "vila": "village",
            "poligono": "polygon",
            "time": "team",
            "partida": "match",
            "cartorio": "notary_office",
            "entidade": None,
            "domicilio": "household",
            "carro_onibus": "automobile",
            "universidade": "school",
            "transferencia": "transfer",
            "missao": None,
            "proposicao": "law",
            "pais, estado": None,
            "ato": "act",
            "tribunal": None,
            "delegacia de policia": None,
            "distrito": "district",
            "foto": "photo",
            "objeto": None,
            "concerto_show": "concert",
            "imovel": "property",
            "deputado(a), entidade": None,
            "presidio": "prison",
            "unidade de conservacao": None,
            "escola": "school",
            "1 mes": None,
            "raca": "race",
            "sexo": "sex",
            "dia": None,
            "publicacao": None,
            "vazio": None,
            "periodico_revista": "journal",
            "instituicao": None,
            "regiao": "region",
            "alerta": None,
            "sentenca": None,
            "guerra": None,
            "estacao": "station",
            "convenio": None,
            "-": None,
            "musica, album, banda": None,
            "bolsa": "scholarship",
            "area_protegida": "protected_area",
            "crianca, pais": None,
            "dominio": "domain",
            "organizacao": None,
            "empresa, pais": "company",
            "doacao": None,
            "musica": None,
            "aldeia": None,
            "iceberg": None,
            "contrato": "contract",
            "evento, deputado(a)": None,
            "professor": "person",
            "discurso": "speech",
            "mes": None,
            "idade": None,
            "evento": None,
            "terreno": None,
            "tratado": "agreement",
            "museu": "museum",
            "obito": "death",
            "licitacao": "procurement",
            "passageiro(a)": "person",
            "estabelecimento": None,
            "federal": None,
            "loja": None,
            "documento": None,
            "auditoria": None,
            "agency": None,
            "planta": "plant",
            "caso": None,
            "typo": None,
            "eleicao": "election",
            "patente": "patent",
            "mudanca territorial": None,
            "item": None,
            "exportador": None,
            "importador": None,
            "genero": None,
            "terremoto": "disaster",
            "banda": None,
            "morte": "death",
            "sancao": None,
            "ano": None,
            "igreja": None,
            "pagina": None,
            "aluno": "person",
            "politico": "person",
            "navio": "ship",
            "soldado(a)": None,
            "assembleia legislativa": None,
            "deputado(a)": None,
            "industria": None,
            "senador(a)": None,
            "materia": "law",
            "gasto": None,
            "unidade de gestao": None,
        }

        if isinstance(entity, str) or isinstance(entity, list):
            if isinstance(entity, str):
                try:
                    entity = ast.literal_eval(entity)
                except:
                    entity = [unidecode.unidecode(entity.lower())]
            entity = flatten([e.split(",") for e in entity])
            entity = flatten([e.split("-") for e in entity])
            entity = flatten([e.split("/") for e in entity])
            entity = [e.strip() for e in entity]
            entity = [entity_mapping.get(e, e) for e in entity]
            entity = [e for e in entity if e]
            resource_dict["entity"] = entity if len(entity) else None
        elif entity is None:
            pass
        elif not isinstance(entity, list):
            raise Exception(f"Entity should be list or str, it is {type(entity)}")

        return resource_dict

    def migrate_resource_external_link(self, resource_dict, package_dict):

        # brazilian_ip to country_ip_address_required
        resource_dict["country_ip_address_required"] = None
        if resource_dict.get("brazilian_ip") == "yes":
            resource_dict["country_ip_address_required"] = ["bra"]
        resource_dict.pop("brazilian_ip", None)

        # free to is_free
        resource_dict["is_free"] = resource_dict.pop("free", None)

        # license_type
        resource_dict.pop("license_type", None)
        resource_dict["license"] = "mit"

        # signup_needed to requires_registration
        resource_dict["requires_registration"] = resource_dict.pop(
            "signup_needed", None
        )

        # delete version
        resource_dict.pop("version", None)

        # package API to has_api
        api_mapping = {"Não": "no", "Sim": "yes"}
        api = package_dict.pop("API", None)
        if api:
            resource_dict["has_api"] = api_mapping.get(api)
        else:
            resource_dict["has_api"] = None

        resource_dict.pop("bdm_file_size", None)

        # clean extra from temporal coverage
        temporal_coverage = resource_dict.get("temporal_coverage", [])
        if temporal_coverage:
            resource_dict["temporal_coverage"] = [
                v for v in temporal_coverage if isinstance(v, int)
            ]

        resource_dict = self._update_frequency(resource_dict)

        # translate language
        language_mapping = {
            "portugues": "portuguese",
            "ingles": "english",
            "arabe": "arabic",
            "espanhol": "spanish",
            "japones": "japanese",
            "alemao": "german",
            "chines": "chinese",
            "frances": "french",
            "russo": "russian",
            "portugues, ingles": None,
            "ingles, frances": None,
            "ingles, espanhol, chines, frances, arabe": None,
            "ingles, varias": None,
        }
        language = resource_dict.get("language", None)
        if isinstance(language, str):
            try:
                language = ast.literal_eval(language)
            except:
                language = [unidecode.unidecode(language.lower())]

        if language:
            language = [language_mapping.get(l, l) for l in language]
            language = [l for l in language if l]

            resource_dict["language"] = language if len(language) else None

        # has_structured_data
        has_structured_data_mapping = {
            "nao": "no",
            "sim": "yes",
            "restrito": None,
            "com projeto de pesquisa": "yes",
            "por pedido": "yes",
            "sim (em pdf)": "yes",
            "pedido por email": "yes",
        }
        has_structured_data = resource_dict.pop("has_structured_data", None)
        if has_structured_data:
            has_structured_data = unidecode.unidecode(has_structured_data.lower())
        resource_dict["has_structured_data"] = has_structured_data_mapping.get(
            has_structured_data, has_structured_data
        )

        # spatial coverage
        resource_dict = self._update_spatial_coverage(resource_dict)

        # entity
        resource_dict = self._update_entity(resource_dict)

        # availability
        availability = resource_dict.pop("availability", None)
        if availability:
            availability = unidecode.unidecode(availability.lower())

        return resource_dict

    def migrate_resource_bdm_table(self, resource_dict, package_dict):

        # delete primary_keys
        resource_dict.pop("primary_keys", None)

        # structure published
        to_pop = [k for k in resource_dict.keys() if "published_by." in k]
        for k in to_pop:
            resource_dict.pop(k, None)

        resource_dict["published_by"] = dict(
            name=resource_dict.pop("publisher", None),
            email=resource_dict.pop("publisher_email", None),
            github_user=resource_dict.pop("publisher_github", None),
            website=resource_dict.pop("publisher_website", None),
        )

        # structure treated
        resource_dict["data_cleaned_by"] = dict(
            name=resource_dict.pop("treated_by.name", None),
            email=resource_dict.pop("treated_by.email", None),
            github_user=resource_dict.pop("treated_by.github", None),
            website=resource_dict.pop("treated_by.website", None),
            code_url=resource_dict.pop("treated_by.code_url", None),
        )

        # treatment_description to data_cleaning_description
        resource_dict["data_cleaning_description"] = resource_dict.pop(
            "treatment_description", None
        )

        # pop url_ckan
        resource_dict.pop("url_ckan", None)

        # pop url_github
        resource_dict.pop("url_github", None)

        # columns
        cols = resource_dict.get("columns")
        if cols == "" or cols is None:
            resource_dict.pop("columns", None)
            resource_dict["columns"] = []

        # spatial coverage
        resource_dict = self._update_spatial_coverage(resource_dict)

        # observation level to entity
        res = resource_dict.get("observation_level")
        if res is None:
            resource_dict["entity"] = None
        elif res[0] == "other" or None:
            resource_dict["entity"] = None
        else:
            resource_dict["entity"] = resource_dict.pop("observation_level", None)
        resource_dict.pop("observation_level", None)

        # entity
        resource_dict = self._update_entity(resource_dict)

        # clean extra from temporal coverage
        resource_dict["temporal_coverage"] = [
            v for v in resource_dict.get("temporal_coverage", []) if isinstance(v, int)
        ]

        resource_dict = self._update_frequency(resource_dict)

        return resource_dict

    def migrate_package_extras(self, package_dict):

        # Remove download type from package_dict
        package_dict.pop("download_type", None)
        package_dict.pop("license_url", None)

        extras = package_dict.pop("extras")

        if extras:

            # Unpack extras
            extras_dict = {}
            for extra in extras:
                unaccented_string = unidecode.unidecode(extra["key"].lower())
                extras_dict[unaccented_string] = extra["value"]

            # Remove unneeded fields f
            extras_dict.pop("autor", None)
            extras_dict.pop("autor_email", None)
            extras_dict.pop("coleta", None)
            extras_dict.pop("artigo cientifico", None)

            def _treat_ano(ano):
                if isinstance(ano, str):
                    ano = ast.literal_eval(ano)
                return [int(y) for y in ano if re.match(r"^([\s\d]+)$", y)]

            def _treat_datas(datas):

                final = []

                datas = datas.lower()

                if datas in ["atual", "-"]:
                    return None
                else:
                    for d_range in datas.split(","):
                        if "-" in d_range:
                            rang = [r.strip() for r in d_range.split("-")]
                            if len(rang[0]) == 0 or len(rang[1]) == 0:
                                continue
                            if len(rang[1]) == 2:
                                rang[1] = rang[0][:2] + rang[1]
                            final.extend(list(range(int(rang[0]), int(rang[1]) + 1)))
                        else:
                            # print('year', [int(d_range)])
                            final.extend([int(d_range)])

                return final

            to_resources_args = [
                # 'ano' --> temporal_coverage (external_link, bdm_table)
                {
                    "current_key": "ano",
                    "new_key": "temporal_coverage",
                    "resource_types": ["external_link", "bdm_table"],
                    "transform_func": _treat_ano,
                },
                {
                    "current_key": "datas",
                    "new_key": "temporal_coverage",
                    "resource_types": ["external_link", "bdm_table"],
                    "transform_func": _treat_datas,
                },
                # 'api' --> has_api (external_link)
                {
                    "current_key": "api",
                    "new_key": "has_api",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'disponibilidade' --> availability (external_link)
                {
                    "current_key": "disponibilidade",
                    "new_key": "availability",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'gratis' --> is_free (external_link)
                {
                    "current_key": "gratis",
                    "new_key": "is_free",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'idioma' --> language (external_link)
                {
                    "current_key": "idioma",
                    "new_key": "language",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'ip_brasileiro' --> country_ip_address_required (external_link)
                {
                    "current_key": "ip_brasileiro",
                    "new_key": "country_ip_address_required",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'ip brasileiro' --> country_ip_address_required (external_link)
                {
                    "current_key": "ip brasileiro",
                    "new_key": "country_ip_address_required",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'microdados' --> has_structured_data (external_link)
                {
                    "current_key": "microdados",
                    "new_key": "has_structured_data",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'registro' --> requires_registration (external_link)
                {
                    "current_key": "registro",
                    "new_key": "requires_registration",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'periodicidade' --> update_frequency (external_link, bdm_table)
                {
                    "current_key": "periodicidade",
                    "new_key": "update_frequency",
                    "resource_types": ["external_link", "bdm_table"],
                    "transform_func": lambda x: x,
                },
                {
                    "current_key": "periodicididade",
                    "new_key": "update_frequency",
                    "resource_types": ["external_link", "bdm_table"],
                    "transform_func": lambda x: x,
                },
                # 'nivel_observacao' --> entity (external_link, bdm_table)
                {
                    "current_key": "nivel_observacao",
                    "new_key": "entity",
                    "resource_types": ["external_link", "bdm_table"],
                    "transform_func": lambda x: x,
                },
                # 'versao' --> version (bdm_table)
                {
                    "current_key": "versao",
                    "new_key": "version",
                    "resource_types": ["bdm_table"],
                    "transform_func": lambda x: x,
                },
                # 'mantenedor' --> published_by.name (bdm_table)
                # 'mantenedor_email' --> published_by.email (bdm_table)
                {
                    "current_key": ["mantenedor", "mantenedor_email"],
                    "new_key": "published_by",
                    "resource_types": ["bdm_table"],
                    "transform_func": lambda x, y: {"name": x, "email": y},
                },
                # 'pais' --> spatial_coverage.country (external_link, bdm_table)
                # 'regiao' --> spatial_coverage.continent (external_link, bdm_table)
                # 'estado' --> spatial_coverage.admin2 (external_link)
                {
                    "current_key": [
                        "estado",
                        "pais",
                        "regiao",
                    ],  # keep alphabetical order
                    "new_key": "spatial_coverage",
                    "resource_types": ["external_link", "bdm_table"],
                    "transform_func": lambda x, y, z: {
                        "admin1": x,
                        "country": y,
                        "continent": z,
                    },
                },
                # 'gratis' --> is_free (external_link)
                {
                    "current_key": "gratis",
                    "new_key": "is_free",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'lingua' --> language (external_link)
                {
                    "current_key": "lingua",
                    "new_key": "language",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'nivel da observacao' --> entity (external_link)
                {
                    "current_key": "nivel da observacao",
                    "new_key": "entity",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'nivel de observacao' --> entity (external_link)
                {
                    "current_key": "nivel de observacao",
                    "new_key": "entity",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
                # 'esfera' --> entity (external_link)
                {
                    "current_key": "esfera",
                    "new_key": "entity",
                    "resource_types": ["external_link"],
                    "transform_func": lambda x: x,
                },
            ]

            for args in to_resources_args:
                package_dict = self.to_resource(package_dict, extras_dict, **args)

        else:
            extras_dict = {}

        # Repack extras
        package_dict["extras"] = [{"key": "dataset_args", "value": extras_dict}]

        return package_dict

    def to_resource(
        self,
        package_dict,
        extras_dict,
        current_key,
        new_key,
        resource_types,
        transform_func,
    ):

        obj = [
            extras_dict.pop(key)
            for key in sorted(extras_dict.keys())
            if key in current_key
        ]
        if len(obj) == 1:
            obj = [o for o in obj if o]
        if obj:
            for resource in package_dict["resources"]:
                # print(f"{resource['resource_type'] =} {resource_types = } {resource['resource_type'] in resource_types =}")
                if resource["resource_type"] in resource_types:
                    # print(f"{transform_func(*obj) =}")
                    # print()
                    resource[new_key] = transform_func(*obj)

        return package_dict

    def migrate(self):

        # Package Extras
        self.package_dict = self.migrate_package_extras(self.package_dict)

        # Resources
        for resource in self.package_dict["resources"]:

            if resource["resource_type"] == "external_link":
                resource = self.migrate_resource_external_link(
                    resource, self.package_dict
                )

            elif resource["resource_type"] == "bdm_table":
                resource = self.migrate_resource_bdm_table(resource, self.package_dict)
