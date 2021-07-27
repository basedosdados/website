
from .attr_enum import AttrEnum

class DirectoryColumnEnum(AttrEnum):
 
    br_state        = {"label": "br_bd_diretorios_brasil.uf:sigla_uf"}
    br_municipality = {"label": "br_bd_diretorios_brasil.municipio:id_municipio"}
    br_district     = {"label": "br_bd_diretorios_brasil.distrito:id_distrito"}
    br_census_tract = {"label": "br_bd_diretorios_brasil.setor_censitario:id_setor_censitario"}
    br_school       = {"label": "br_bd_diretorios_brasil.escola:id_escola"}
    
    datetime_date   = {"label": "br_bd_data_tempo.data:data"}
    datetime_year   = {"label": "br_bd_data_tempo.ano:ano"}
    datetime_month  = {"label": "br_bd_data_tempo.mes:mes"}
    datetime_day    = {"label": "br_bd_data_tempo.dia:dia"}

    datetime_time   = {"label": "br_bd_data_tempo.tempo:tempo"}
    datetime_hour   = {"label": "br_bd_data_tempo.hora:hora"}
    datetime_minute = {"label": "br_bd_data_tempo.minuto:minuto"}
    datetime_second = {"label": "br_bd_data_tempo.segundo:segundo"}
    