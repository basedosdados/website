from enum import Enum
from typing import Union


class ObservationLevelSphereEnum(str, Enum):
    continent = 'continent' # "Continent"
    country = 'country' # "Country"
    region = 'region' # "Region"
    state = 'state' # "State"
    county = 'county' # "County"
    district = 'district' # "District"
    municipality = 'municipality' # "Municipality"
    city = 'city' # "City"
    village = 'village' # "Village"
    neighborhood = 'neighborhood' # "Neighborhood"
    zip_code = 'zip_code' # "ZIP Code"
    census_tract = 'census_tract' # "Census Tract"


class ObservationLevelIndividualEnum(str, Enum):
    person = 'person' # "Person (student, teacher/professor, politician/candidate, player, partner, etc)"
    household = 'household' # "Household"
    name = 'name' # "Name"
    animal = 'animal' # "Animal"
    plant = 'plant' # "Plant"


class ObservationLevelEstablishmentEnum(str, Enum):
    agency = 'agency' # "Agency"
    protected_area = 'protected_area' # "Protected Area"
    library = 'library' # "Library"
    notary_office = 'notary_office' # "Notary's Office"
    company = 'company' # "Company"
    school = 'school' # "School"
    station = 'station' # "Station"
    stadium = 'stadium' # "Stadium"
    terrorist_group = 'terrorist_group' # "Terrorist Group"
    hospital = 'hospital' # "Hospital"
    property = 'property' # "Property"
    ministry = 'ministry' # "Ministry/Department"
    museum = 'museum' # "Museum"
    ngo = 'ngo' # "Nongovernmental Organization (NGO)"
    prison = 'prison' # "Prison"
    team = 'team' # "Team"
    university = 'university' # "University"


class ObservationLevelPoliticsEnum(str, Enum):
    agreement = 'agreement' # "Agreement/Treaty"
    speech = 'speech' # "Speech"
    election = 'election' # "Election"
    law = 'law' # "Law/Proposition"
    party = 'party' # "Party"
    poll = 'poll' # "Poll"


class ObservationLevelScienceEnum(str, Enum):
    article = 'article' # "Article/Paper"
    citation = 'citation' # "Citation"
    domain = 'domain' # "Domain"
    book = 'book' # "Book"
    newspaper = 'newspaper' # "Newspaper"
    patent = 'patent' # "Patent"
    journal = 'journal' # "Journal/Magazine"
    word = 'word' # "Word"
    post = 'post' # "Post/Tweet"
    langugage = 'langugage' # "Language"
    crs = 'crs' # "Coordinate Reference System"
    protein = 'protein' # "Protein"
    meteor = 'meteor' # "Meteor"


class ObservationLevelEconomicsEnum(str, Enum):
    contract = 'contract' # "Contract"
    grant = 'grant' # "Grant"
    procurement = 'procurement' # "Procurement"
    product = 'product' # "Product"
    transaction = 'transaction' # "Transaction"
    transfer = 'transfer' # "Transfer"
    bill = 'bill' # "Money Bill"
    occupation = 'occupation' # "Occupation"
    sector = 'sector' # "Sector"


class ObservationLevelEducationEnum(str, Enum):
    scholarship = 'scholarship' # "Scholarship"
    test = 'test' # "Test/Exam"


class ObservationLevelEventsEnum(str, Enum):
    alert = 'alert' # "Alert"
    attack = 'attack' # "Attack"
    act = 'act' # "Act"
    concert = 'concert' # "Concert"
    disinvitation = 'disinvitation' # "Disinvitation"
    disaster = 'disaster' # "Natural Disaster (earthquake, flood, fire, etc)"
    birth = 'birth' # "Birth"
    death = 'death' # "Death"
    request = 'request' # "Request/Complaint"
    protest = 'protest' # "Protest"
    match = 'match' # "Match"


class ObservationLevelArtEnum(str, Enum):
    album = 'album' # "Album"
    movie = 'movie' # "Movie/Film/Clip/Show"
    photo = 'photo' # "Photo/Picture"
    song = 'song' # "Song"
    statue = 'statue' # "Statue"
    painting = 'painting' # "Painting/Drawing/Illustration"
    poem = 'poem' # "Poem"
    roller_coaster = 'roller_coaster' # "Roller Coaster"


class ObservationLevelInfrastructureEnum(str, Enum):
    dam = 'dam' # "Dam"
    satellitte = 'satellitte' # "Satellite"
    street_road = 'street_road' # "Street/Avenue/Road/Highway"


class ObservationLevelTransportationEnum(str, Enum):
    automobile = 'automobile' # "Car/Bus/Truck/Motorcycle"
    train = 'train' # "Train"
    aircraft = 'aircraft' # "Plane/Helicopter"
    ship = 'ship' # "Ship"


class ObservationLevelSecurityEnum(str, Enum):
    gun = 'gun' # "Gun"


class ObservationLevelDemographicEnum(str, Enum):
    age = 'age' # "Age"
    race = 'race' # "Race/Skin color"
    sex = 'sex' # "Sex"


class ObservationLevelImageEnum(str, Enum):
    pixel = 'pixel' # "Pixel/Grid"
    polygon = 'polygon' # "Polygon"


class ObservationLevelHistoryEnum(str, Enum):
    empire = 'empire' # "Empire"


class ObservationLevelOthersEnum(str, Enum):
    other = 'other' # "Other"


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
