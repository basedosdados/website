from pathlib import Path
from pydantic import BaseModel, ValidationError, validator
from typing import List
from importlib import resources
import yaml
import ckanext.basedosdados.bdm_table_column_metadata_validator

bd_standards = ["municipio", "escola", "setor_censitario", "uf"]

BD_STD_COLUMNS = resources.open_text(
    ckanext.basedosdados.bdm_table_column_metadata_validator, "bd_std_columns.yaml"
)
BD_STD_COLUMNS = yaml.safe_load(BD_STD_COLUMNS)
BD_STD_COLUMNS_BY_NAME = {column["name"]: column for column in BD_STD_COLUMNS}
# "duplicated columns defined as standard columns"
assert len(BD_STD_COLUMNS_BY_NAME) == len(BD_STD_COLUMNS)

INV_FIELD = []


class Column(BaseModel):
    name: str
    description: str
    is_in_staging: bool
    is_partition: bool

    @validator("name")
    def name_is_lower(cls, value, values):
        if not value.islower():
            INV_FIELD.append({"name": value})
            raise ValueError("should be all lower case")
        return value

    @validator("name")
    def no_spaces(cls, value, values):
        if " " in value:
            INV_FIELD.append({"name": value})
            raise ValueError("should not have spaces")
        return value

    @validator("description")
    def validate_std_description(cls, value, values):
        if INV_FIELD:
            values.update(INV_FIELD[-1])
            INV_FIELD.clear()
        is_std_col = BD_STD_COLUMNS_BY_NAME.get(values["name"])
        if is_std_col and value != is_std_col["description"]:
            raise ValueError("Standard column does not have standard descritpion")