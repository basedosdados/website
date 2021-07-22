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
    title="Dataset ID",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

TABLE_ID_FIELD = Field(
    title="Table ID",
    yaml_order={
        "id_before": "dataset_id",
        "id_after": "source_bucket_name",
    },
)

LAST_UPDATED_FIELD = Field(
    title="Última atualização",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)
