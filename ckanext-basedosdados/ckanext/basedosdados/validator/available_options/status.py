from .attr_enum import AttrEnum

class StatusEnum(AttrEnum):
    processing = {"label": "Processing"}
    answered   = {"label": "Answered"}
    denied     = {"label": "Denied"}