from .attr_enum import AttrEnum

class UpdateFrequencyEnum(AttrEnum):
    second                        = {"label": "Second"}
    minute                        = {"label": "Minute"}
    hour                          = {"label": "Hour"}
    day                           = {"label": "Day"}
    week                          = {"label": "Week"}
    month                         = {"label": "Month"}
    quarter                       = {"label": "Quarter"}
    semester                      = {"label": "Semester"}
    one_year                      = {"label": "One Year"}
    two_years                     = {"label": "Two Years"}
    three_years                   = {"label": "Three Years"}
    four_years                    = {"label": "Four Years"}
    five_years                    = {"label": "Five Years"}
    ten_years                     = {"label": "Ten Years"}
    unique                        = {"label": "Unique"}
    recurring                     = {"label": "Recurring"}
    uncertain                     = {"label": "Uncertain"}
    empty                         = {"label": "Empty"}
    other                         = {"label": "Other"}