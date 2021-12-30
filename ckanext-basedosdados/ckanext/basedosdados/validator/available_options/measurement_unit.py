from .attr_enum import AttrEnum


class MeasurementUnitEnum(AttrEnum):
    # fmt: off
    # space
    km          = {"label": "km"}
    km2         = {"label": "km2"}
    m           = {"label": "m"}
    meter2      = {"label": "m2"}
    centimeter  = {"label": "cm"}
    centimeter2 = {"label": "cm2"}
    hectare     = {"label": "hectare"}
    acre        = {"label": "acre"}
    mile        = {"label": "mi"}
    mile2       = {"label": "mi2"}
    foot        = {"label": "pé"}
    foot2       = {"label": "pé2"}
    inch        = {"label": "polegada"}
    inch2       = {"label": "polegada2"}
    
    # mass
    kilogram = {"label": "kg"}
    gram     = {"label": "g"}
    miligram = {"label": "mg"}
    ton      = {"label": "tonelada"}
    ounce    = {"label": "onça"}

    # volume
    gallon   = {"label": "galão"}
    litre    = {"label": "litro"}
    militre  = {"label": "ml"}
    meter3   = {"label": "m3"}
    barrel   = {"label": "barril"}
    boe      = {"label": "barril de óleo equivalente"}
    toe      = {"label": "tonelada de óleo equivalente"}

    # energy
    W        = {"label": "watt"}
    kW       = {"label": "quilowatt"}
    kWh      = {"label": "quilowatt-hora"}
    V        = {"label": "volt"}
    kV       = {"label": "quilovolt"}
    
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
    
    # date_time
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
