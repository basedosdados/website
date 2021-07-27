from typing import AsyncIterable
from .attr_enum import AttrEnum

class SpatialCoverageEnum(AttrEnum):

    world     = {"label": "Mundo"}

    africa          = {"label": "África"}
    north_america   = {"label": "América do Norte"}
    central_america = {"label": "América Central"}
    south_america   = {"label": "América do Sul"}
    asia            = {"label": "Ásia"}
    europe          = {"label": "Europa"}
    oceania         = {"label": "Oceania"}
    middle_east     = {"label": "Oriente Médio"}

    brazil    = {"label": "Brasil"}
    brazil_AC = {"label": "Brasil: AC"}
    brazil_AL = {"label": "Brasil: AL"}
    brazil_AM = {"label": "Brasil: AM"}
    brazil_AP = {"label": "Brasil: AP"}
    brazil_BA = {"label": "Brasil: BA"}
    brazil_CE = {"label": "Brasil: CE"}
    brazil_DF = {"label": "Brasil: DF"}
    brazil_ES = {"label": "Brasil: ES"}
    brazil_GO = {"label": "Brasil: GO"}
    brazil_MA = {"label": "Brasil: MA"}
    brazil_MG = {"label": "Brasil: MG"}
    brazil_MS = {"label": "Brasil: MS"}
    brazil_MT = {"label": "Brasil: MT"}
    brazil_PA = {"label": "Brasil: PA"}
    brazil_PB = {"label": "Brasil: PB"}
    brazil_PE = {"label": "Brasil: PE"}
    brazil_PI = {"label": "Brasil: PI"}
    brazil_PR = {"label": "Brasil: PR"}
    brazil_RJ = {"label": "Brasil: RJ"}
    brazil_RN = {"label": "Brasil: RN"}
    brazil_RO = {"label": "Brasil: RO"}
    brazil_RR = {"label": "Brasil: RR"}
    brazil_RS = {"label": "Brasil: RS"}
    brazil_SC = {"label": "Brasil: SC"}
    brazil_SE = {"label": "Brasil: SE"}
    brazil_SP = {"label": "Brasil: SP"}
    brazil_TO = {"label": "Brasil: TO"}

    usa     = {"label": "Estados Unidos da América"}
    mexico  = {"label": "México"}
    china   = {"label": "China"}
    india   = {"label": "Índia"}

    other    = {"label": "Outro"}
