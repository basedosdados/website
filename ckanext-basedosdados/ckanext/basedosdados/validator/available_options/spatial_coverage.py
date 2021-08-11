from .attr_enum import AttrEnum

class ContinentEnum(AttrEnum):
    
    all             = {"label": "Todos"}
    africa          = {"label": "África"}
    north_america   = {"label": "América do Norte"}
    central_america = {"label": "América Central"}
    south_america   = {"label": "América do Sul"}
    asia            = {"label": "Ásia"}
    europe          = {"label": "Europa"}
    oceania         = {"label": "Oceania"}
    antarctica       = {"label": "Antártica"}


class CountryEnum(AttrEnum):
    
    # country codes from ISO 3166
    # https://www.iban.com/country-codes
    
    bra = {"label": "Brasil"}
    arg = {"label": "Argentina"}
    bol = {"label": "Bolívia"}
    chl = {"label": "Chile"}
    col = {"label": "Colômbia"}

    can = {"label": "Canadá"}
    usa = {"label": "Estados Unidos da América"}
    mex = {"label": "México"}
    
    deu = {"label": "Alemanha"}
    esp = {"label": "Espanha"}
    fra = {"label": "França"}
    ita = {"label": "Itália"}
    prt = {"label": "Portugal"}
    gbr = {"label": "Reino Unido"}
    rus = {"label": "Rússia"}


    chn = {"label": "China"}
    ind = {"label": "Índia"}
    tha = {"label": "Tailândia"}
    jpn = {"label": "Japão"}
    mys = {"label": "Malásia"}
    idn = {"label": "Indonésia"}
    zaf = {"label": "África do Sul"}
    
    aus = {"label": "Austrália"}

class Admin1Enum(AttrEnum):
    
    # por enquanto só para Brasil

    id_uf_12 = {"label": "AC"}
    id_uf_27 = {"label": "AL"}
    id_uf_13 = {"label": "AM"}
    id_uf_16 = {"label": "AP"}
    id_uf_29 = {"label": "BA"}
    id_uf_23 = {"label": "CE"}
    id_uf_53 = {"label": "DF"}
    id_uf_32 = {"label": "ES"}
    id_uf_52 = {"label": "GO"}
    id_uf_21 = {"label": "MA"}
    id_uf_31 = {"label": "MG"}
    id_uf_50 = {"label": "MS"}
    id_uf_51 = {"label": "MT"}
    id_uf_15 = {"label": "PA"}
    id_uf_25 = {"label": "PB"}
    id_uf_26 = {"label": "PE"}
    id_uf_22 = {"label": "PI"}
    id_uf_41 = {"label": "PR"}
    id_uf_33 = {"label": "RJ"}
    id_uf_24 = {"label": "RN"}
    id_uf_11 = {"label": "RO"}
    id_uf_14 = {"label": "RR"}
    id_uf_43 = {"label": "RS"}
    id_uf_42 = {"label": "SC"}
    id_uf_28 = {"label": "SE"}
    id_uf_35 = {"label": "SP"}
    id_uf_17 = {"label": "TO"}

class Admin2Enum(AttrEnum):
    
    # por enquanto só para capitais de UFs no Brasil
    
    id_municipio_1100205 = {"label": "Porto Velho"}
    id_municipio_1200401 = {"label": "Rio Branco"}
    id_municipio_1302603 = {"label": "Manaus"}
    id_municipio_1400100 = {"label": "Boa Vista"}
    id_municipio_1501402 = {"label": "Belém"}
    id_municipio_1600303 = {"label": "Macapá"}
    id_municipio_1721000 = {"label": "Palmas"}
    id_municipio_2111300 = {"label": "São Luís"}
    id_municipio_2211001 = {"label": "Teresina"}
    id_municipio_2304400 = {"label": "Fortaleza"}
    id_municipio_2408102 = {"label": "Natal"}
    id_municipio_2507507 = {"label": "João Pessoa"}
    id_municipio_2611606 = {"label": "Recife"}
    id_municipio_2704302 = {"label": "Maceió"}
    id_municipio_2800308 = {"label": "Aracaju"}
    id_municipio_2927408 = {"label": "Salvador"}
    id_municipio_3106200 = {"label": "Belo Horizonte"}
    id_municipio_3205309 = {"label": "Vitória"}
    id_municipio_3304557 = {"label": "Rio de Janeiro"}
    id_municipio_3550308 = {"label": "São Paulo"}
    id_municipio_4106902 = {"label": "Curitiba"}
    id_municipio_4205407 = {"label": "Florianópolis"}
    id_municipio_4314902 = {"label": "Porto Alegre"}
    id_municipio_5002704 = {"label": "Campo Grande"}
    id_municipio_5103403 = {"label": "Cuiabá"}
    id_municipio_5208707 = {"label": "Goiânia"}
    id_municipio_5300108 = {"label": "Brasília"}


