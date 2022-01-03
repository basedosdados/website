from .attr_enum import AttrEnum


class MeasurementUnitEnum(AttrEnum):
    # fmt: off
    
    # distance
    kilometer   = {"label": "km"}
    meter       = {"label": "m"}
    centimeter  = {"label": "cm"}
    mile        = {"label": "mi"}
    foot        = {"label": "pé"}
    inch        = {"label": "polegada"}

    # area
    kilometer2  = {"label": "km2"}
    meter2      = {"label": "m2"}
    centimeter2 = {"label": "cm2"}
    hectare     = {"label": "ha"}
    acre        = {"label": "acre"}
    mile2       = {"label": "mi2"}
    foot2       = {"label": "pé2"}
    inch2       = {"label": "polegada2"}

    # mass
    ton      = {"label": "tonelada"}
    kilogram = {"label": "kg"}
    gram     = {"label": "g"}
    miligram = {"label": "mg"}
    ounce    = {"label": "onça"}

    # volume
    gallon   = {"label": "galão"}
    litre    = {"label": "litro"}
    militre  = {"label": "ml"}
    meter3   = {"label": "m3"}
    mile3    = {"label": "mi3"}
    foot3    = {"label": "pé3"}
    inch3    = {"label": "polegada3"}
    barrel   = {"label": "barril"}
    boe      = {"label": "barril de óleo equivalente"}
    toe      = {"label": "tonelada de óleo equivalente"}

    # energy
    watt           = {"label": "W"}
    kilowatt       = {"label": "kW"}
    volt           = {"label": "V"}
    kilovolt       = {"label": "kV"}
    
    # people
    person    = {"label": "pessoa"}
    household = {"label": "domicílio"}
    
    # currency
    brl = {"label": "BRL"}
    usd = {"label": "USD"}
    eur = {"label": "EUR"}
    gbp = {"label": "GBP"}
    cny = {"label": "CNY"}
    jpy = {"label": "JPY"}
    
    # economics
    minimum_wage = {"label": "salário mínimo"}
    
    # date-time
    year     = {"label": "ano"}
    semester = {"label": "semestre"}
    quarter  = {"label": "trimestre"}
    bimester = {"label": "bimestre"}
    month    = {"label": "mês"}
    week     = {"label": "semana"}
    day      = {"label": "dia"}
    hour     = {"label": "hora"}
    minute   = {"label": "minuto"}
    second   = {"label": "segundo"}
    
    # percentage
    percent = {"label": "porcentagem"}
    # fmt: on
