from .attr_enum import AttrEnum


class BigQueryTypeEnum(AttrEnum):
    # fmt: off
    array      = {"label": "ARRAY"}
    boolean    = {"label": "BOOLEAN"}
    date       = {"label": "DATE"}
    datetime   = {"label": "DATETIME"}
    float64    = {"label": "FLOAT64"}
    geography  = {"label": "GEOGRAPHY"}
    int64      = {"label": "INT64"}
    numeric    = {"label": "NUMERIC"}
    string     = {"label": "STRING"}
    struct     = {"label": "STRUCT"}
    time       = {"label": "TIME"}
    timestamp  = {"label": "TIMESTAMP"}
    # fmt: on
