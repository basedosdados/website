import yaml
import sys
from pathlib import Path
import json
from cerberus import Validator

### LOADS STANDARD COLUMNS FROM br_bd_diretorios_brasil
# with open(Path(".") / "bd_std_columns.yaml", "r") as f:
BD_STD_COLUMNS = [
    {
        "name": "id_municipio",
        "description": "ID Município - IBGE 7 Dígitos",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_municipio_6",
        "description": "ID Município - IBGE 6 Dígitos",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_municipio_tse",
        "description": "ID Município - TSE",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_municipio_rf",
        "description": "ID Município - Receita Federal",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_municipio_bcb",
        "description": "ID Município - Banco Central do Brasil",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "municipio",
        "description": "Nome Município",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "capital_uf",
        "description": "Capital da Unidade da Federação",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_comarca",
        "description": "ID Sede Comarca",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_regiao_saude",
        "description": "ID Região de Saúde",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "regiao_saude",
        "description": "Região de Saúde",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_regiao_imediata",
        "description": "ID Região Imediata - IBGE",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "regiao_imediata",
        "description": "Região Imediata",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_regiao_intermediaria",
        "description": "ID Região Intermediária - IBGE",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "regiao_intermediaria",
        "description": "Região Intermediária",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_microrregiao",
        "description": "ID Microrregião - IBGE",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "microrregiao",
        "description": "Microrregião",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_mesorregiao",
        "description": "ID Mesorregião - IBGE",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "mesorregiao",
        "description": "Mesorregião",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "sigla_uf",
        "description": "Sigla Unidade da Federação",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "uf",
        "description": "Unidade da Federação",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "regiao",
        "description": "Região",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "existia_1991",
        "description": "Existia em 1991",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "existia_2000",
        "description": "Existia em 2000",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "existia_2010",
        "description": "Existia em 2010",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_escola",
        "description": "ID Escola - Inep",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_escola_sp",
        "description": "ID Escola - especifica para o Estado de São Paulo",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "nome_escola",
        "description": "Nome da Escola",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "rede",
        "description": "Rede Escolar",
        "is_in_staging": True,
        "is_partition": False,
    },
    {"name": "ano", "description": "Ano", "is_in_staging": True, "is_partition": True},
    {
        "name": "id_setor_censitario",
        "description": "ID do setor censitário",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_rm",
        "description": "ID da região metropolitana ou RIDE",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "nome_rm",
        "description": "Nome da região metropolitana ou RIDE",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_distrito",
        "description": "ID do distrito",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "nome_distrito",
        "description": "Nome do distrito",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_subdistrito",
        "description": "ID do subdistrito",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "nome_subdistrito",
        "description": "Nome do subdistrito",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_bairro",
        "description": "ID de bairro",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "nome_bairro",
        "description": "Nome do bairro",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "situacao_setor",
        "description": "– ID de situação do setor - Situação urbana - IDs 1, 2 e 3; 1 - Área urbanizada de cidade ou vila 2 - Área não urbanizada de cidade ou vila 3 - Área urbana isolada - Situação rural – IDs 4, 5, 6, 7 e 8; 4 - Aglomerado rural de extensão urbana 5 - Aglomerado rural isolado, povoado 6 - Aglomerado rural isolado, núcleo 7 - Aglomerado rural isolado, outros aglomerados 8 - Zona rural, exclusive aglomerado rural",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "tipo_setor",
        "description": "Tipo de setor censitário",
        "is_in_staging": True,
        "is_partition": False,
    },
    {
        "name": "id_uf",
        "description": "ID Unidade da Federação - IBGE",
        "is_in_staging": True,
        "is_partition": False,
    },
]
BD_STD_COLUMNS_BY_NAME = {column["name"]: column for column in BD_STD_COLUMNS}
assert len(BD_STD_COLUMNS_BY_NAME) == len(BD_STD_COLUMNS)
# "duplicated columns defined as standard columns"
### Custom extensions to Cerberus Validator class
class MyValidator(Validator):
    ### Checks must be prefixed with _check_with for using it within the check_with schema keyword
    def _check_with_lowercase(self, field, value):
        if not value.islower():
            self._error(field, "Must be named all lowercase")

    def _check_with_nospaces(self, field, value):
        if " " in value:
            self._error(field, "Cannot have spaces")

    def _check_with_abbreviation(self, field, value):
        not_allowed_abbrev = ["qt", "tp", "cd"]
        for a in not_allowed_abbrev:
            if a in value:
                self._error(field, f"cannot contain abbreviations {not_allowed_abbrev}")

    def _check_with_standard_columns(self, field, value):
        std_col = BD_STD_COLUMNS_BY_NAME.get(self.document["name"])
        if std_col and value != std_col["description"]:
            self._error(field, "Standard column does not have standard description")


def validate_columns_from_yaml(path_to_yaml):
    schema = yaml.load(open("validation_schema.yaml", "r"), Loader=yaml.SafeLoader)
    config = yaml.load(open(Path(path_to_yaml), "r"), Loader=yaml.SafeLoader)
    columns = config["columns"]
    v = MyValidator(schema=schema)

    if not v.validate({"columns": columns}):
        # print(columns)
        print(v.errors["columns"])
    return v.validate({"columns": columns})


def validate_columns_from_dict(column_dict):
    # with open("validation_schema.yaml", "r") as s:
    #     schema = yaml.load(s, Loader=yaml.SafeLoader)
    schema = {
        "columns": {
            "type": "list",
            "schema": {
                "type": "dict",
                "schema": {
                    "name": {
                        "type": "string",
                        "required": True,
                        "empty": False,
                        "check_with": ["lowercase", "nospaces", "abbreviation"],
                    },
                    "description": {
                        "type": "string",
                        "required": True,
                        "empty": False,
                        "check_with": "standard_columns",
                    },
                    "is_in_staging": {"type": "boolean"},
                    "is_partition": {"type": "boolean"},
                },
            },
        }
    }

    v = MyValidator(schema=schema)
    validate = v.validate(column_dict)
    if not validate:
        print(v.errors["columns"])

    return validate


if __name__ == "__main__":
    validate_columns_from_yaml(path_to_yaml=sys.argv[1])
