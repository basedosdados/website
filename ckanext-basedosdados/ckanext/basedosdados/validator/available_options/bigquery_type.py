
from .attr_enum import AttrEnum

class BigQueryTypeEnum(AttrEnum):
    string     = {"label": "STRING"}
    int64      = {"label": "INT64"}
    float64    = {"label": "FLOAT64"}
    date       = {"label": "DATE"}
    time       = {"label": "TIME"}
    geography  = {"label": "GEOGRAPHY"}