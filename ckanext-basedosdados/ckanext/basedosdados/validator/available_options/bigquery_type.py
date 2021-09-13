from .attr_enum import AttrEnum


class BigQueryTypeEnum(AttrEnum):
    # fmt: off
    string     = {"label": "STRING"}
    int64      = {"label": "INT64"}
    float64    = {"label": "FLOAT64"}
    date       = {"label": "DATE"}
    time       = {"label": "TIME"}
    geography  = {"label": "GEOGRAPHY"}
    # fmt: on
