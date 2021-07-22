#!/usr/bin/env python3
from datetime import datetime
from pydantic import (
    StrictStr as Str,
    Field,
)
from ckanext.basedosdados.validator import BaseModel

to_line = lambda description: "\n".join(description)


class LastUpdated(BaseModel):
    metadata: datetime = Field(user_input_hint=["Última atualização: metadados"])
    data: datetime = Field(user_input_hint=["Última atualização: metadados"])
    release: datetime = Field(user_input_hint=["Último lançamento: dados originais"])


# -------------------------------------
# BdmDictionary Fields
# -------------------------------------

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
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)
