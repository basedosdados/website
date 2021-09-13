from .attr_enum import AttrEnum


class StatusEnum(AttrEnum):
    # fmt: off
    processing = {"label": "Em processamento"}
    answered   = {"label": "Respondido"}
    denied     = {"label": "Negado"}
    # fmt: on
