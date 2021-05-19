#!/usr/bin/env python3
from __future__ import annotations
from datetime import datetime
from typing import List, Optional, Literal, Union, Any
import pydantic
from pydantic import (
    StrictInt as Int,
    StrictStr as Str,
    Field,
    ValidationError,
    validator,
    PrivateAttr,
)
from enum import Enum
from uuid import UUID
import jsonschema

from .observations import ObservationLevel

from typing_extensions import Annotated  # migrate to py3.9

A = Annotated
F = Field
ID_TYPE = A[
    Optional[Str], F()
]  # TODO: would be nice to require on show/update but not on create
Email = Str  # TODO

from . import resource, BaseModel
from .resource import LaiRequest, ExternalLink, BdmTable

AnyResource = Annotated[
    Union[LaiRequest, ExternalLink, BdmTable], Field(discriminator="resource_type")
]


class TemporalCoverageEnum(str, Enum):
    CHECK = "CHECK"  # TODO: data check

    def __init__(self, *args, **kwargs):
        for i in range(1970, 2031):
            setattr(self, i, i)

        super().__init__(*args, **kwargs)


class _CkanDefaults(BaseModel):
    id: ID_TYPE
    name: Str
    title: Str
    type: Literal["dataset"]
    notes: Optional[Str]
    author: Optional[Str]
    author_email: Optional[Email]
    maintainer: Optional[Str]
    maintainer_email: Optional[Email]
    state: Literal["active"]
    license_id: Optional[Str]
    url: Optional[Str]
    version: Optional[Str]
    metadata_created: datetime
    metadata_modified: datetime
    creator_user_id: UUID
    private: bool
    license_title: Optional[Str]

    # Ckan Defaults Complex Fields
    num_resources: Int
    resources: List[AnyResource]
    groups: Any
    owner_org: UUID
    organization: Any
    num_tags: Int
    tags: Any

    relationships_as_object: Any
    relationships_as_subject: Any

    # throwaway field that is used to modify validators. You can think of it as an argument to validate function. Cant use prefix underscores on pydantic so used suffix to indicate this
    action__: Optional[
        Literal["package_show", "package_create", "package_update"]
    ]  # TODO: after 2021-07-01 add exclude by default when issue is merged in master

    @validator("action__")
    def ids_should_respect_action(cls, value, config, values, field):
        action = value
        if not action:
            return
        if action in ("package_update", "package_show"):
            assert values["id"] != None, f"package id is None on {action}"
            for idx, r in enumerate(values["resources"]):
                assert r.id != None, f"resource {idx!r} id is None on {action}"
        elif action == "package_create":
            assert values["id"] == None, "package id is not None on package_create"
            for idx, r in enumerate(values["resources"]):
                assert (
                    r.id == None
                ), f"resource #{idx!r} id field not is None: {r.id!r} on package_create"


class Package(_CkanDefaults):

    # Custom fields
    description: Str
    temporal_coverage: List[TemporalCoverageEnum] = Field(max_items=10)
    spatial_coverage: Str
    observation_level: List[ObservationLevel] = Field(max_items=10)
    auxiliary_files_url: List[Str]
    download_type: Optional[
        Literal["Link Externo"]
    ]  # field_name: download_type # validators: generate_download_type #TODO uncomment generates


# TODO: try to access fields on validation and get annotations on which fields are needed for each tier
