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


class ObservationLevelEnum(str, Enum):
    placeholder_sphere = "_______________SPHERE"
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
    placeholder_individual = "_______________INDIVIDUAL"
    person = "Person (student, teacher/professor, politician/candidate, player, partner, etc)"
    household = "Household"
    name = "Name"
    animal = "Animal"
    plant = "Plant"
    placeholder_establishment = "_______________ESTABLISHMENT"
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
    placeholder_politics = "_______________POLITICS"
    agreement = "Agreement/Treaty"
    speech = "Speech"
    election = "Election"
    law = "Law/Proposition"
    party = "Party"
    poll = "Poll"
    placeholder_inovation = "_______________SCIENCE, INNOVATION, AND COMMUNICATION"
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
    placeholder_economics = "_______________ECONOMICS"
    contract = "Contract"
    grant = "Grant"
    procurement = "Procurement"
    product = "Product"
    transaction = "Transaction"
    transfer = "Transfer"
    bill = "Money Bill"
    occupation = "Occupation"
    sector = "Sector"
    placeholder_education = "_______________EDUCATION"
    scholarship = "Scholarship"
    test = "Test/Exam"
    placeholder_event = "_______________EVENTS"
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
    placeholder_art = "_______________ART AND ENTERTAINMENT"
    album = "Album"
    movie = "Movie/Film/Clip/Show"
    photo = "Photo/Picture"
    song = "Song"
    statue = "Statue"
    painting = "Painting/Drawing/Illustration"
    poem = "Poem"
    roller_coaster = "Roller Coaster"
    placeholder_infrastructure = "_______________INFRASTRUCTURE"
    dam = "dam"
    satellitte = "Satellite"
    street_road = "Street/Avenue/Road/Highway"
    placeholder_transportation = "_______________TRANSPORTATION"
    automobile = "Car/Bus/Truck/Motorcycle"
    train = "Train"
    aircraft = "Plane/Helicopter"
    ship = "Ship"
    placeholder_security = "_______________SECURITY, VIOLENCE, CRIME"
    gun = "Gun"
    placeholder_demographic = "_______________DEMOGRAPHIC"
    age = "Age"
    race = "Race/Skin color"
    sex = "Sex"
    placeholder_image = "_______________IMAGE"
    pixel = "Pixel/Grid"
    polygon = "Polygon"
    placeholder_history = "_______________HISTORY"
    empire = "Empire"
    placeholder_others = "_______________OTHERS"
    other = "Other"


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


class LaiRequest(Resource):
    origin: Str  # Validators only_on_types(lai_request) required_on_types(lai_request)
    protocol_number: Str  # Validators only_on_types(lai_request) required_on_types(lai_request)
    superior_organ: Str  # Validators only_on_types(lai_request) required_on_types(lai_request)
    linked_organ: Str  # Validators only_on_types(lai_request) required_on_types(lai_request)
    start_date: datetime.date  # Validators only_on_types(lai_request) required_on_types(lai_request) scheming_required isodate convert_to_json_if_date
    who_requested: Str  # Validators only_on_types(lai_request) # required_on_types(lai_request)
    status: StatusEnum  # Validatos only_on_types(lai_request) required_on_types(lai_request) scheming_required scheming_choices
    request_url: Str  # Validators only_on_types(lai_request) required_on_types(lai_request) ignore_missing unicode remove_whitespace
    data_url: Str  # Validators only_on_types(lai_request) ignore_missing unicode remove_whitespace #required_on_types(lai_request)
    observations: Str  # Validators only_on_types(lai_request) # required_on_types(lai_request)
    lai_n: int
    resource_type: Literal["lai_request"]


class BdmTable(Resource):
    table_id: Int  # Validator only on types
    auxiliary_files_url: Str  # Validators only_on_types(bdm_table) ignore_missing unicode remove_whitespace
    treatment_description: Str  # Validator only_on_types(bdm_table)
    observation_level: List[
        ObservationLevelEnum
    ]  # Validators only_on_types(bdm_table) scheming_multiple_choice
    columns: Str  # Validators only_on_types(bdm_table) required_on_types(bdm_table) VER COM FRED
    primary_keys: Str  # Validators only_on_types(bdm_table) #required_on_types(bdm_table) MANUAL
    version: Str  # Validators only_on_types(bdm_table) unicode package_version_validator #required_on_types(bdm_table) MANUAL
    publisher: Str  # Validators only_on_types(bdm_table) #required_on_types(bdm_table) MANUAL display_property: dc:creator
    publisher_email: Str  # Validators only_on_types(bdm_table) #required_on_types(bdm_table) MANUAL  display_property: dc:creator display_snippet: email.html
    publisher_github: Str  # Validators only_on_types(bdm_table) # required_on_types(bdm_table)
    publisher_website: Str  # Validators only_on_types(bdm_table) # required_on_types(bdm_table)
    resource_type: Literal["bdm_table"]


class ExternalLink(Resource):
    url: str  # Validators only_on_types(external_link) required_on_types(external_link) ignore_missing unicode remove_whitespace # TODO: add check_url_is_alive validator
    language: List[
        LanguageEnum
    ]  # Validators only_on_types(external_link) required_on_types(external_link) scheming_multiple_choice # TODO: @dahis, serio q eh so no external link ?
    has_api: bool  # Validators only_on_types(external_link) scheming_required scheming_choices # TODO: data check VER COM FRED SE PODE SER BOOL
    free: bool  # Validators only_on_types(external_link) required_on_types(external_link) scheming_required scheming_choices VER COM FRED SE PODE SER BOOL
    signup_needed: bool  # Validators only_on_types(external_link) required_on_types(external_link) scheming_required scheming_choices VER COM FRED SE PODE SER BOOL
    availability: AvailabilityEnum  # Validators only_on_types(external_link) required_on_types(external_link) scheming_required scheming_choices
    brazilian_ip: bool  # Validators only_on_types(external_link) scheming_required scheming_choices #required_on_types(external_link) VER COM FRED SE PODE SER BOOL
    license_type: Str  # Validators only_on_types(external_link) required_on_types(external_link)
    resource_type: Literal["external_link"]
