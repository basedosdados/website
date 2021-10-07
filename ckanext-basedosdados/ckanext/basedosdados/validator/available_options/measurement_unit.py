from .attr_enum import AttrEnum

class MeasurementUnitEnum(AttrEnum):
    
    # space
    km  = {"label": "km"}
    km2 = {"label": "km2"}
    m   = {"label": "m"}
    m2  = {"label": "m2"}
    ha  = {"label": "ha"}
    
    # mass
    kg  = {"label": "kg"}
    t   = {"label": "t"}
    
    # currency
    brl = {"label": "BRL"}
    usd = {"label": "USD"}
    
    # date_time
    year = {"label": "ano"}
    month = {"label": "mês"}
    day = {"label": "dia"}
    second = {"label": "segundo"}
    
