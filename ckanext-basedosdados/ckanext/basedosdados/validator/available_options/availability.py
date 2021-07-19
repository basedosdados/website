from .attr_enum import AttrEnum

class AvailabilityEnum(AttrEnum):
    online    = {"label": "Online"}
    physical  = {"label": "Physical (CD, DVD, paper, etc)"}
    in_person = {"label": "In Person"}