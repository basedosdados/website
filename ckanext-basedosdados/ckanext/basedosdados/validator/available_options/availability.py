from .attr_enum import AttrEnum

class AvailabilityEnum(AttrEnum):
    
    online    = {"label": "Online"}
    physical  = {"label": "Físico (CD, DVD, papel, etc)"}
    in_person = {"label": "Pessoalmente"}
