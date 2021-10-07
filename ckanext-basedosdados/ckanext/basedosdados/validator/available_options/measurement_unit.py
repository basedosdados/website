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
    
    # people
    person = {"label": "pessoa"}
    
    # currency
    brl = {"label": "BRL"}
    usd = {"label": "USD"}
    eur = {"label": "EUR"}
    gbp = {"label": "GBP"}
    cny = {"label": "CNY"}
    jpy = {"label": "JPY"}
    
    # date_time
    year = {"label": "ano"}
    month = {"label": "mês"}
    day = {"label": "dia"}
    second = {"label": "segundo"}
    
