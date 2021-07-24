from .attr_enum import AttrEnum

class StatusEnum(AttrEnum):
    processing = {"label": "Em processamento"}
    answered   = {"label": "Respondido"}
    denied     = {"label": "Negado"}