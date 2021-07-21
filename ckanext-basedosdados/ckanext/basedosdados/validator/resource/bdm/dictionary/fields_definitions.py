#!/usr/bin/env python3
from pydantic import (
    StrictStr as Str,
    Field,
)
from ckanext.basedosdados.validator import BaseModel

to_line = lambda description: "\n".join(description)

###################
### YAML FIELDS ###
###################

DATASET_ID_FIELD = Field(
    title="dataset_id",
    user_input_hint=["<dataset_id>"],
    description=to_line(["AUTO GENERATED"]),
    yaml_order={
        "id_before": "table_id",
        "id_after": None,
    },
)

TABLE_ID_FIELD = Field(
    title="table_id",
    user_input_hint=["<table_id>"],
    description=to_line(["AUTO GENERATED"]),
    yaml_order={
        "id_before": "last_updated",
        "id_after": "dataset_id",
    },
)

LAST_UPDATED_FIELD = Field(
    title="Última atualização",
    user_input_hint=["<YYYY-MM-DD>"],
    description=to_line(["AUTO GENERATED"]),
    yaml_order={
        "id_before": None,
        "id_after": "table_id",
    },
)
