from .attr_enum import AttrEnum


class AvailabilityEnum(AttrEnum):
    # fmt: off
    online    = {"label": "Online"}
    physical  = {"label": "Físico (CD, DVD, papel, etc)"}
    in_person = {"label": "Pessoalmente"}
    # fmt: on
