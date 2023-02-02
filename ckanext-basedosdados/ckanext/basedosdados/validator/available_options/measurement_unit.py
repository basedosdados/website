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
    hectare     = {"label": "ha"}
    acre        = {"label": "acre"}

    # mass
    ton       = {"label": "tonelada"}
    kilogram  = {"label": "kg"}
    gram      = {"label": "g"}
    miligram  = {"label": "mg"}
    microgram = {"label": "ug"}
    ounce     = {"label": "onça"}

    # volume
    gallon   = {"label": "galão"}
    litre    = {"label": "litro"}
    militre  = {"label": "ml"}
    barrel   = {"label": "barril"}
    boe      = {"label": "barril de óleo equivalente"}
    toe      = {"label": "tonelada de óleo equivalente"}


    # energy
    watt           = {"label": "W"}
    kilowatt       = {"label": "kW"}
    megawatt       = {"label": "mW"}
    gigawatt       = {"label": "gW"}
    terawatt       = {"label": "tW"}
    volt           = {"label": "V"}
    kilovolt       = {"label": "kV"}
    megavolt       = {"label": "mV"}
    gigavolt       = {"label": "gV"}
    teravolt       = {"label": "tV"}
    calorie        = {"label": "cal"}
    kilocalorie    = {"label": "kcal"}

    
    # people
    person    = {"label": "pessoa"}
    household = {"label": "domicílio"}
    
    # currency
    ars = {"label": "ARS"}
    brl = {"label": "BRL"}
    cad = {"label": "CAD"}
    clp = {"label": "CLP"}
    usd = {"label": "USD"}
    eur = {"label": "EUR"}
    gbp = {"label": "GBP"}
    cny = {"label": "CNY"}
    inr = {"label": "INR"}
    jpy = {"label": "JPY"}
    zar = {"label": "ZAR"}
    
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
