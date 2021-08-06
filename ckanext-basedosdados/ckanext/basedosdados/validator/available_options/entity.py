from enum import Enum
from typing import Union

from .attr_enum import AttrEnum

class EntitySphereEnum(AttrEnum):
    continent        = {'label': "Continente"} #"Continent"}
    country          = {'label': "País"} #"Country"}
    region           = {'label': "Região"} #"Region"}
    state            = {'label': "Estado/Unidade da Federação"} #"State"}
    county           = {'label': "Condado"} #"County"}
    district         = {'label': "Distrito"} #"District"}
    municipality     = {'label': "Município"} #"Municipality"}
    city             = {'label': "Cidade"} #"City"}
    village          = {'label': "Vila/Aldeia"} #"Village"}
    neighborhood     = {'label': "Bairro"} #"Neighborhood"}
    zip_code         = {'label': "CEP"} #"Zip Code"}
    census_tract     = {'label': "Setor censitário"} #"CensusTract"}

class EntityIndividualEnum(AttrEnum):
    person           = {'label': "Pessoa (aluno, professor, político/candidato, jogador, sócio, etc)"} #"Person (student, teacher/professor, politician/candidate, player, partner, etc)"}
    household        = {'label': "Domicílio"} #"Household"}
    name             = {'label': "Nome"} #"Name"}
    animal           = {'label': "Animal (mamífero, micróbio, vírus, etc)"} #"Animal"}
    plant            = {'label': "Planta (árvore, espécie)"} #"Plant"}

class EntityEstablishmentEnum(AttrEnum):
    agency           = {'label': "Agência"} #"Agency"}
    protected_area   = {'label': "Área protegida"} #"Protected Area"}
    band             = {'label': "Banda"}
    library          = {'label': "Biblioteca"} #"Library"}
    notary_office    = {'label': "Cartório"} #"Notary's Office"}
    school           = {'label': "Creche/Escola/Universidade"} #"School"}
    legislature      = {'label': "Congresso/Assembleia Legislativa"}
    police_station   = {'label': "Delegacia"} #"Property"}
    company          = {'label': "Empresa/Companhia"} #"Company"}
    station          = {'label': "Estação"} #"Station"}
    stadium          = {'label': "Estádio"} #"Stadium"}
    terrorist_group  = {'label': "Grupo terrorista"} #"Terrorist Group"}
    hospital         = {'label': "Hospital"} #"Hospital"}
    church           = {'label': "Igreja"}
    property         = {'label': "Imóvel/Propriedade"} #"Property"}
    ministry         = {'label': "Ministério/Departamento"} #"Ministry/Department"}
    museum           = {'label': "Museu"} #"Museum"}
    construction     = {'label': "Obra/Construção"} #"Nongovernmental Organization (NGO)"}
    ngo              = {'label': "Organização Não-Governamental (ONG)"} #"Nongovernmental Organization (NGO)"}
    prison           = {'label': "Presídio/Cadeia"} #"Prison"}
    team             = {'label': "Time"} #"Team"}
    court            = {'label': "Tribunal"} #"Company"}

class EntityPoliticsEnum(AttrEnum):
    agreement        = {'label': "Acordo/Tratado"} #"Agreement/Treaty"}
    speech           = {'label': "Discurso/Fala"} #"Speech"}
    election         = {'label': "Eleição"} #"Election"}
    caucus           = {'label': "Frente Parlamentar/Caucus"}
    law              = {'label': "Lei/Proposição/Matéria"} #"Law/Proposition"}
    party            = {'label': "Partido"} #"Party"}
    poll             = {'label': "Pesquisa de Opinião"} #"Poll"}
    vote             = {'label': "Voto"}

class EntityScienceEnum(AttrEnum):
    article          = {'label': "Artigo/Publicação"} #"Article/Paper"}
    citation         = {'label': "Citação"} #"Citation"}
    domain           = {'label': "Domínio"} #"Domain"}
    document         = {'label': "Documento"}
    iceberg          = {'label': "Iceberg"}
    book             = {'label': "Livro"} #"Book"}
    newspaper        = {'label': "Jornal"} #"Newspaper"}
    drug             = {'label': "Medicamento/Droga"}
    patent           = {'label': "Patente"} #"Patent"}
    journal          = {'label': "Periódico/Revista"} #"Journal/Magazine"}
    word             = {'label': "Palavra"} #"Word"}
    post             = {'label': "Post/Tweet"} #"Post/Tweet"}
    langugage        = {'label': "Língua"} #"Language"}
    crs              = {'label': "Creche"} #"Coordinate Reference System"}
    page             = {'label': "Página"}
    protein          = {'label': "Proteína"} #"Protein"}
    meteor           = {'label': "Meteoro"} #"Meteor"}
    terrain          = {'label': "Terreno"}
    typo             = {'label': "Erro de digitação"}

class EntityEconomicsEnum(AttrEnum):
    contract         = {'label': "Contrato"} #"Contract"}
    donation         = {'label': "Doação"} #"Contract"}
    amendment        = {'label': "Emenda Parlamentar"}
    expenditure      = {'label': "Gasto"}
    item             = {'label': "Item"}
    grant            = {'label': "Prêmio/Concessão/Convênio"} #"Grant"}
    procurement      = {'label': "Licitação"} #"Procurement"}
    product          = {'label': "Produto"} #"Product"}
    transaction      = {'label': "Transação"} #"Transaction"}
    transfer         = {'label': "Transferência"} #"Transfer"}
    bill             = {'label': "Nota de dinheiro"} #"Money Bill"}
    occupation       = {'label': "Ocupação"} #"Occupation"}
    sector           = {'label': "Setor"} #"Sector"}

class EntityEducationEnum(AttrEnum):
    scholarship      = {'label': "Bolsa"} #"Scholarship"}
    exam             = {'label': "Prova/Exame"} #"Test/Exam"}

class EntityEventEnum(AttrEnum):
    alert            = {'label': "Alerta"} #"Alert"}
    attack           = {'label': "Ataque/Atentado"} #"Attack"}
    audit            = {'label': "Auditoria"}
    act              = {'label': "Ato"} #"Act"}
    concert          = {'label': "Concerto/Show"} #"Concert"}
    disinvitation    = {'label': "Cancelamento de convite"} #"Disinvitation"}
    disaster         = {'label': "Desastre Natural (terremoto, enchente/inundação, fogo, etc)"} #"Natural Disaster (earthquake, flood, fire, etc)"}
    war              = {'label': "Guerra/Conflito"}
    territorial_change = {'label': "Mudança Territorial"}
    birth            = {'label': "Nascimento"} #"Birth"}
    death            = {'label': "Morte/Óbito"} #"Death"}
    request          = {'label': "Pedido/Solicitação/Reclamação"} #"Request/Complaint"}
    protest          = {'label': "Protesto"} #"Protest"}
    match            = {'label': "Partida"} #"Match"}
    sanction         = {'label': "Sanção/Multa"} #"Match"}

class EntityArtEnum(AttrEnum):
    album            = {'label': "Álbum"} #"Album"}
    movie            = {'label': "Filme/Série/Clipe"} #"Movie/Film/Clip/Show"}
    photo            = {'label': "Foto"} #"Photo/Picture"}
    song             = {'label': "Música"} #"Song"}
    statue           = {'label': "Estátua"} #"Statue"}
    painting         = {'label': "Pintura/Desenho/Ilustração"} #"Painting/Drawing/Illustration"}
    poem             = {'label': "Poema"} #"Poem"}

class EntityInfrastructureEnum(AttrEnum):
    dam              = {'label': "Represa/Barragem"} #"Dam"}
    satellitte       = {'label': "Satélite"} #"Satellite"}
    street_road      = {'label': "Rua/Avenida/Estrada"} #"Street/Avenue/Road/Highway"}
    roller_coaster   = {'label': "Montanha-Russa"} #"Roller Coaster"}

class EntityTransportationEnum(AttrEnum):
    automobile       = {'label': "Carro/Ônibus/Caminhão/Moto"} #"Car/Bus/Truck/Motorcycle"}
    train            = {'label': "Trem"} #"Train"}
    aircraft         = {'label': "Avião/Helicóptero"} #"Plane/Helicopter"}
    ship             = {'label': "Embarcação/Navio"} #"Ship"}

class EntitySecurityEnum(AttrEnum):
    gun              = {'label': "Arma"} #"Gun"}

class EntityDemographicEnum(AttrEnum):
    age              = {'label': "Idade"} #"Age"}
    race             = {'label': "Raça/Cor de pele"} #"Race/Skin color"}
    sex              = {'label': "Sexo"} #"Sex"}

class EntityImageEnum(AttrEnum):
    pixel            = {'label': "Pixel/Grid"} #"Pixel/Grid"}
    polygon          = {'label': "Polígono"} #"Polygon"}

class EntityHistoryEnum(AttrEnum):
    empire           = {'label': "Império"} #"Empire"}

class EntityOtherEnum(AttrEnum):
    other            = {'label': "Outro"} #"Other"}

EntityEnum = Union[
    EntitySphereEnum,
    EntityIndividualEnum,
    EntityEstablishmentEnum,
    EntityPoliticsEnum,
    EntityScienceEnum,
    EntityEconomicsEnum,
    EntityEducationEnum,
    EntityEventEnum,
    EntityArtEnum,
    EntityInfrastructureEnum,
    EntityTransportationEnum,
    EntitySecurityEnum,
    EntityDemographicEnum,
    EntityHistoryEnum,
    EntityOtherEnum,
    EntityImageEnum
]
