#!/usr/bin/env python3
from __future__ import annotations
from datetime import datetime
from typing import List, Optional, Literal, Union, Any
import pydantic
from pydantic import StrictInt as Int, StrictStr as Str, Field, ValidationError, validator, PrivateAttr, root_validator
from uuid import UUID
import jsonschema

from .data_types import ObservationLevel, TemporalCoverage, IdType

from typing_extensions import Annotated  # migrate to py3.9

Email = Str  # TODO

from . import BaseModel
from .resource import ExternalLink, BdmTable
from .metadata_definitions.package_definitions import *

AnyResource = Annotated[
    Union[ExternalLink, BdmTable], Field(discriminator="resource_type")
]


coerce_to_unicode = lambda field: validator('field', allow_reuse=True)()

class _CkanDefaults(BaseModel):
    id  : IdType
    name: Str

    title            : Str
    type             : Literal["dataset"]
    notes            : Optional[Str]
    author           : Optional[Str]
    author_email     : Optional[Email]
    maintainer       : Optional[Str]
    maintainer_email : Optional[Email]
    state            : Optional[Literal['active', 'draft', 'deleted']]
    license_id       : Optional[Str]
    url              : Optional[Str]
    version          : Optional[Str]
    metadata_created : Optional[datetime]
    metadata_modified: Optional[datetime]
    creator_user_id  : Optional[UUID]
    private          : bool
    license_title    : Optional[Str]

    # Ckan Defaults Complex Fields
    num_resources: Optional[Int]
    resources    : List[AnyResource] = []
    groups       : Any
    owner_org    : UUID
    organization : Any
    num_tags     : Optional[Int]
    tags         : Any

    relationships_as_object : Any
    relationships_as_subject: Any

    # throwaway field that is used to modify validators. You can think of it as an argument to validate function. Cant use prefix underscores on pydantic so used suffix to indicate this
    action__: Optional[
        Literal["package_show", "package_create", "package_update"]
    ]  # TODO: after 2021-07-01 add exclude by default when issue is merged in master


    @validator('resources', pre=True)
    def resources_should_have_position_field(cls, resources):
        for idx, r in enumerate(resources):
            # idx = (idx) # need to be string cause ckan is dumb and will treat an int 0 as a false value causing problems in later validations
            # assert r.get('position') is None or r['position'] == idx, f"Position on resource {r.get('name')} is {r['position']!r} but should be {idx!r}."
            r['position'] = idx
        return resources

    @root_validator
    def ids_should_respect_action(cls, values):
        action = values['action__']
        resources = values.get('resources', [])
        if action in ('package_update', 'package_show'):
            assert values['id'] != None, f'package id is None on {action}'
        elif action == 'package_create':
            assert values['id'] == None, 'package id is not None on package_create'
            for idx, r in enumerate(resources):
                assert r.id == None, f"resource #{idx!r} id field not is None: {r.id!r} on package_create"
        else: raise ValueError(f'action {action!r} not supported')
        if action == 'package_show':
            for idx, r in enumerate(resources):
                assert r.id != None, f"resource {idx!r} id is None on {action}"
        return values

    @root_validator # using root_validator I can guarantee that all individual fields are ready. Using `values` on single field validators prooved to hard to synchronize
    def not_null_on_show(cls, values):
        for f in ('state', 'metadata_created', 'metadata_modified', 'creator_user_id', 'num_resources', 'num_tags'):
            if values['action__'] == 'package_show':
                assert values[f] is not None
        return values



class Package(_CkanDefaults):
    # Generated Fields
    # temporal_coverage: TemporalCoverage
    # spatial_coverage: Str
    # observation_level: List[ObservationLevel] = Field(max_items=10)
    # auxiliary_files_url: List[Str]

    download_type: Optional[Literal['Link Externo', 'BD Mais']] # TODO: generate this automatically

    # Ckan Defaults with description
    author           : Optional[Str]      = AUTHOR_FIELD # This field have name and email in YAML
    metadata_modified: Optional[datetime] = METADATA_MODIFIED_FIELD

    # Ckan Defaults Complex Fields
    groups      : Any = GROUPS_FIELD
    organization: Any = ORGANIZATION_FIELD
    tags        : Any = TAGS_FIELD
    
    # TODO: Remove optional from required fields bellow
    # New dataset fields
    dataset_id  : Optional[Str]     = DATASET_ID_FIELD
    url_ckan    : Optional[Str]     = URL_CKAN_FIELD
    url_github  : Optional[Str]     = URL_GITHUB_FIELD
    website     : Optional[Str]     = WEBSITE_FIELD
    languages   : Optional[Str]     = LANGUAGES_FIELD
    free        : Optional[Str]     = FREE_FIELD
    microdata   : Optional[Str]     = MICRODATA_FIELD
    API         : Optional[Str]     = API_FIELD
    availability: Optional[Str]     = AVAILABILITY_FIELD
    brazilian_IP: Optional[Str]     = BRAZILIAN_IP_FIELD
    license     : Optional[Licence] = LICENSE_FIELD
    

    
# TODO: try to access fields on validation and get annotations on which fields are needed for each tier
