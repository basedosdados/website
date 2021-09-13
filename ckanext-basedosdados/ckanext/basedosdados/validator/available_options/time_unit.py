from .attr_enum import AttrEnum


class TimeUnitEnum(AttrEnum):
    # fmt: off
    second                        = {"label": "Segundo"} #"Second"}
    minute                        = {"label": "Minuto"} #"Minute"}
    hour                          = {"label": "Hora"} #"Hour"}
    day                           = {"label": "Dia"} #"Day"}
    week                          = {"label": "Semana"} #"Week"}
    month                         = {"label": "Mês"} #"Month"}
    quarter                       = {"label": "Trimestre"} #"Quarter"}
    semester                      = {"label": "Semestre"} #"Semester"}
    one_year                      = {"label": "1 ano"} #"One Year"}
    two_years                     = {"label": "2 anos"} #"Two Years"}
    three_years                   = {"label": "3 anos"} #"Three Years"}
    four_years                    = {"label": "4 anos"} #"Four Years"}
    five_years                    = {"label": "5 anos"} #"Five Years"}
    ten_years                     = {"label": "10 anos"} #"Ten Years"}
    unique                        = {"label": "Único"} #"Unique"}
    recurring                     = {"label": "Recorrente"} #"Recurring"}
    uncertain                     = {"label": "Incerto"} #"Uncertain"}
    other                         = {"label": "Outro"} #"Other"}
    # fmt: on
