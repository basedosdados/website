from enum import Enum
from typing import Union


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