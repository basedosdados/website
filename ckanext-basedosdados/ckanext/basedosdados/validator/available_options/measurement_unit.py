from .attr_enum import AttrEnum

class MeasurementUnitEnum(AttrEnum):
    
    # space
    kilometer   = {"label": "km"}
    kilometer2  = {"label": "km2"}
    meter       = {"label": "m"}
    meter2      = {"label": "m2"}
    centimeter  = {"label": "cm"}
    centimeter2 = {"label": "cm2"}
    hectare     = {"label": "hectare"}
    acre        = {"label": "acre"}
    mile        = {"label": "mi"}
    mile2       = {"label": "mi2"}
    foot        = {"label": "pé"}
    inch        = {"label": "polegada"}
    
    # mass
    kilogram = {"label": "kg"}
    ton      = {"label": "tonelada"}
    ounce    = {"label": "onça"}
    gallon   = {"label": "galão"}
    
    # people
    person = {"label": "pessoa"}
    
    # currency
    brl = {"label": "BRL"}
    usd = {"label": "USD"}
    eur = {"label": "EUR"}
    gbp = {"label": "GBP"}
    cny = {"label": "CNY"}
    jpy = {"label": "JPY"}
    
    # economics
    minimum_wage = {"label": "salário mínimo"}
    
    # date_time
    year     = {"label": "ano"}
    semester = {"label": "semestre"}
    quarter  = {"label": "trimestre"}
    month    = {"label": "mês"}
    week     = {"label": "semana"}
    day      = {"label": "dia"}
    second   = {"label": "segundo"}
    
    # percentage
    percent = {"label": "porcentagem"}
    
