import dataclasses
import importlib.resources
from dataclasses import dataclass
from typing import List, Dict
from pydantic import BaseModel, validator
import pandas
import importlib.resources

from ..attr_enum import AttrEnum

#----------------------------------
# TODO: make this come 
# automatically from directory
#----------------------------------
class CountryEnum(AttrEnum):
    # country codes from ISO 3166
    # https://www.iban.com/country-codes

    # fmt: off
    br = {"label": "Brasil"}
    ar = {"label": "Argentina"}
    bo = {"label": "Bolívia"}
    cl = {"label": "Chile"}
    co = {"label": "Colômbia"}
    ca = {"label": "Canadá"}
    us = {"label": "Estados Unidos da América"}
    mx = {"label": "México"}
    de = {"label": "Alemanha"}
    es = {"label": "Espanha"}
    fr = {"label": "França"}
    it = {"label": "Itália"}
    pt = {"label": "Portugal"}
    gb = {"label": "Reino Unido"}
    ru = {"label": "Rússia"}
    cn = {"label": "China"}
    #in = {"label": "Índia"}
    th = {"label": "Tailândia"}
    jp = {"label": "Japão"}
    my = {"label": "Malásia"}
    id = {"label": "Indonésia"}
    za = {"label": "África do Sul"}
    au = {"label": "Austrália"}
    # fmt: on

#----------------------------------

def build_areas_from_csv(csv_path):
    df = pandas.read_csv(csv_path)["id label__pt".split()]

    def create_area(row):
        key = row["id"]
        value = {
            "label": {
                k.removeprefix("label__"): v
                for k, v in row.items()
                if k.startswith("label__")
            }
        }
        Area(id=key, **value)

    for row in df.to_dict(orient="records"):
        create_area(row)


SPATIAL_COVERAGE_AREAS = {}

@dataclass
class Area:
    id: str
    label: Dict[str, str]

    def __post_init__(self):
        SPATIAL_COVERAGE_AREAS[self.id] = self

    @property
    def _tree_id(self):
        return self.id if self.id != "world" else ""

    def parent(self):
        if self.id == "world":
            return None
        if "." not in self._tree_id:
            return SPATIAL_COVERAGE_AREAS["world"]
        return SPATIAL_COVERAGE_AREAS[self._tree_id.rsplit(".", 1)[0]]

    def children(self):
        return [
            SPATIAL_COVERAGE_AREAS[area]
            for area in SPATIAL_COVERAGE_AREAS
            if area.startswith(self._tree_id) and len(area) > len(self._tree_id) # + "." #or self._tree_id == "world"
        ]

    def __contains__(a, b):
        if isinstance(b, AreaUnion):
            return all(b_sub in a for b_sub in b.areas)
        return b.id.startswith(a._tree_id)

    def __add__(a, b):
        if b in a:
            return a
        if a in b:
            return b
        return AreaUnion(areas=[a, b])

    def dict(self):
        return dataclasses.asdict(self)

Area(id="world", label={"pt": "Mundo"})

@dataclass
class AreaUnion:
    areas: List[Area]

    def __contains__(self, b):
        for a in self.areas:
            if b in a:
                return True
        return False

    def __add__(self, b):
        if b in self:
            return self
        areas = [a for a in self.areas if a not in b]
        areas.append(b)
        return AreaUnion(areas=areas)
        # TODO: check if union can be represented by fewer higher level Areas. Ex rj + sp + mg + ... = BR

class SpatialCoverageArea(BaseModel):
    __root__: str

    @validator("__root__")
    def is_a_valid_area(cls, value):
        assert value in SPATIAL_COVERAGE_AREAS, value
        return value

    @property
    def area(self):
        return SPATIAL_COVERAGE_AREAS[self.__root__]

import ckanext.basedosdados.validator.available_options.spatial_coverage as spatial_coverage

with importlib.resources.path(
    spatial_coverage, "spatial_coverage_tree.csv"
) as path:  # TODO: mudar isso aqui pra ler o arquivo certo
    build_areas_from_csv(path)

