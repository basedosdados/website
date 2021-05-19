import datetime

from . import BaseModel
from enum import Enum
from typing import List, Optional, Literal, Union
from pydantic import (
    StrictInt as Int,
    StrictStr as Str,
    Field,
    ValidationError,
    validator,
)
from .package import ID_TYPE

YES_NO = Literal["yes", "no"]


class TemporalCoverageEnum(str, Enum):
    CHECK = "CHECK"  # TODO: data check

    def __init__(self, *args, **kwargs):
        for i in range(1970, 2031):
            setattr(self, i, i)

        super().__init__(*args, **kwargs)


class UpdateFrequencyEnum(str, Enum):
    second = "Second"
    minute = "Minute"
    hour = "Hour"
    day = "Day"
    week = "Week"
    month = "Month"
    quarter = "Quarter"
    semester = "Semester"
    one_year = "One Year"
    two_years = "Two Years"
    three_years = "Three Years"
    four_years = "Four Years"
    five_years = "Five Years"
    ten_years = "Ten Years"
    unique = "Unique"
    recurring = "Recurring"
    empty = "Empty"  # TODO: dahis review
    other = "Other"  # TODO: dahis review


class ObservationLevelSphereEnum(str, Enum):
    continent = "Continent"
    country = "Country"
    region = "Region"
    state = "State"
    county = "County"
    district = "District"
    municipality = "Municipality"
    city = "City"
    village = "Village"
    neighborhood = "Neighborhood"
    zip_code = "ZIP Code"
    census_tract = "Census Tract"


class ObservationLevelIndividualEnum(str, Enum):
    person = "Person (student, teacher/professor, politician/candidate, player, partner, etc)"
    household = "Household"
    name = "Name"
    animal = "Animal"
    plant = "Plant"


class ObservationLevelEstablishmentEnum(str, Enum):
    agency = "Agency"
    protected_area = "Protected Area"
    library = "Library"
    notary_office = "Notary's Office"
    company = "Company"
    school = "School"
    station = "Station"
    stadium = "Stadium"
    terrorist_group = "Terrorist Group"
    hospital = "Hospital"
    property = "Property"
    ministry = "Ministry/Department"
    museum = "Museum"
    ngo = "Nongovernmental Organization (NGO)"
    terrorist_group = "Terrorist Group"
    prison = "Prison"
    team = "Team"
    university = "University"


class ObservationLevelPoliticsEnum(str, Enum):
    agreement = "Agreement/Treaty"
    speech = "Speech"
    election = "Election"
    law = "Law/Proposition"
    party = "Party"
    poll = "Poll"


class ObservationLevelScienceEnum(str, Enum):
    article = "Article/Paper"
    citation = "Citation"
    domain = "Domain"
    book = "Book"
    newspaper = "Newspaper"
    patent = "Patent"
    journal = "Journal/Magazine"
    word = "Word"
    post = "Post/Tweet"
    langugage = "Language"
    crs = "Coordinate Reference System"
    protein = "Protein"
    meteor = "Meteor"


class ObservationLevelEconomicsEnum(str, Enum):
    contract = "Contract"
    grant = "Grant"
    procurement = "Procurement"
    product = "Product"
    transaction = "Transaction"
    transfer = "Transfer"
    bill = "Money Bill"
    occupation = "Occupation"
    sector = "Sector"


class ObservationLevelEducationEnum(str, Enum):
    scholarship = "Scholarship"
    test = "Test/Exam"


class ObservationLevelEventsEnum(str, Enum):
    alert = "Alert"
    attack = "Attack"
    act = "Act"
    concert = "Concert"
    disinvitation = "Disinvitation"
    disaster = "Natural Disaster (earthquake, flood, fire, etc)"
    birth = "Birth"
    death = "Death"
    request = "Request/Complaint"
    protest = "Protest"
    match = "Match"


class ObservationLevelArtEnum(str, Enum):
    album = "Album"
    movie = "Movie/Film/Clip/Show"
    photo = "Photo/Picture"
    song = "Song"
    statue = "Statue"
    painting = "Painting/Drawing/Illustration"
    poem = "Poem"
    roller_coaster = "Roller Coaster"


class ObservationLevelInfrastructureEnum(str, Enum):
    dam = "dam"
    satellitte = "Satellite"
    street_road = "Street/Avenue/Road/Highway"


class ObservationLevelTransportationEnum(str, Enum):
    automobile = "Car/Bus/Truck/Motorcycle"
    train = "Train"
    aircraft = "Plane/Helicopter"
    ship = "Ship"


class ObservationLevelSecurityEnum(str, Enum):
    gun = "Gun"


class ObservationLevelDemographicEnum(str, Enum):
    age = "Age"
    race = "Race/Skin color"
    sex = "Sex"


class ObservationLevelImageEnum(str, Enum):
    pixel = "Pixel/Grid"
    polygon = "Polygon"


class ObservationLevelHistoryEnum(str, Enum):
    empire = "Empire"


class ObservationLevelOthersEnum(str, Enum):
    other = "Other"


ObservationLevel = Union[
    ObservationLevelSphereEnum,
    ObservationLevelIndividualEnum,
    ObservationLevelEstablishmentEnum,
    ObservationLevelPoliticsEnum,
    ObservationLevelScienceEnum,
    ObservationLevelEconomicsEnum,
    ObservationLevelEducationEnum,
    ObservationLevelEventsEnum,
    ObservationLevelArtEnum,
    ObservationLevelInfrastructureEnum,
    ObservationLevelTransportationEnum,
    ObservationLevelSecurityEnum,
    ObservationLevelDemographicEnum,
    ObservationLevelHistoryEnum,
    ObservationLevelOthersEnum,
]


class LanguageEnum(str, Enum):
    german = "German"
    arabic = "Arabic"
    bahasa = "Bahasa"
    bengali = "Bengali"
    chinese = "Chinese"
    spanish = "Spanish"
    french = "French"
    hebrew = "Hebrew"
    hindi = "Hindi"
    english = "English"
    japanese = "Japanese"
    malay = "Malay"
    portuguese = "Portuguese"
    russian = "Russian"
    thai = "Thai"
    urdu = "Urdu"


class AvailabilityEnum(str, Enum):
    online = "Online"
    physical = "Physical (CD, DVD, paper, etc)"
    in_person = "In Person"


class StatusEnum(str, Enum):
    processing = "Processing"
    answered = "Answered"
    denied = "Denied"


class Resource(BaseModel):
    id: ID_TYPE
    name: Str
    description: Str
    spatial_coverage: Str
    temporal_coverage: List[TemporalCoverageEnum]
    update_frequency: UpdateFrequencyEnum
    # resource_type: str


# TODO: Remove only_on_types, required
# Required for later
"""
class LaiRequest(Resource):
    origin: Str  # Validators  required_on_types(lai_request)
    protocol_number: Str  # Validators  required_on_types(lai_request)
    superior_organ: Str  # Validators  required_on_types(lai_request)
    linked_organ: Str  # Validators  required_on_types(lai_request)
    start_date: datetime.date  # Validators  required_on_types(lai_request) scheming_required isodate convert_to_json_if_date
    who_requested: Str  # Validators  # required_on_types(lai_request)
    status: StatusEnum  # Validatos  required_on_types(lai_request) scheming_required scheming_choices
    request_url: Str  # Validators  required_on_types(lai_request) ignore_missing unicode remove_whitespace
    data_url: Str  # Validators  ignore_missing unicode remove_whitespace #required_on_types(lai_request)
    observations: Str  # Validators  # required_on_types(lai_request)
    lai_n: int
    resource_type: Literal["lai_request"]
"""


class BdmTable(Resource):
    table_id: Int  # Validator only on types
    auxiliary_files_url: Optional[
        Str
    ]  # Validators ignore_missing unicode remove_whitespace
    treatment_description: Optional[Str]
    observation_level: List[ObservationLevel]
    columns: Str
    primary_keys: Str
    version: Str
    publisher: Str
    publisher_email: Str
    publisher_github: Str
    publisher_website: Str
    resource_type: Literal["bdm_table"]


class ExternalLink(Resource):
    url: str  # Validators ignore_missing unicode remove_whitespace # TODO: add check_url_is_alive validator
    language: List[LanguageEnum]  # TODO: @dahis, serio q eh so no external link ?
    has_api: YES_NO  # Validators scheming_required scheming_choices # TODO: data check
    free: YES_NO  # Validators scheming_required scheming_choices
    signup_needed: YES_NO  # Validators scheming_required scheming_choice
    availability: AvailabilityEnum  # Validators scheming_required scheming_choices
    brazilian_ip: YES_NO  # Validators scheming_required scheming_choices
    license_type: Str
    resource_type: Literal["external_link"]
