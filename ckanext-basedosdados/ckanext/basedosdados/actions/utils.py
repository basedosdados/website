from google.cloud import storage, bigquery
import pandas as pd


def get_users_dict():
    """ Get users from Google Cloud Storage """

    client = storage.Client()
    bucket = client.get_bucket('basedosdados')
    blobs = list(bucket.list_blobs(prefix='staging/br_bd_indicadores/website_user/'))
    map_blobs = {}
    for blob in blobs:
        name = blob.name
        date = name.split('/')[3].split('=')[1]
        map_blobs[date] = blob.public_url

    # get list of ordered dates
    dates = list(map_blobs.keys())
    dates.sort()

    df = pd.read_csv(map_blobs[dates[-1]])

    users = df.to_dict(orient='records')[0]

    return users

def get_consulta_dict():
    """ Get access statistics from Big Query """

    client = bigquery.Client()

    query = '''
        WITH dados AS(
        SELECT timestamp_trunc(`basedosdados.br_bd_indicadores.acessos_tabelas_bigquery`.`estampa_tempo`, month) AS `estampa_tempo`, count(*) AS `count`
        FROM `basedosdados.br_bd_indicadores.acessos_tabelas_bigquery`
        WHERE ((`basedosdados.br_bd_indicadores.acessos_tabelas_bigquery`.`tipo_usuario` <> 'admin'
            OR `basedosdados.br_bd_indicadores.acessos_tabelas_bigquery`.`tipo_usuario` IS NULL)
            AND `basedosdados.br_bd_indicadores.acessos_tabelas_bigquery`.`estampa_tempo` >= timestamp "2020-01-01 00:00:00 America/Sao_Paulo")
        GROUP BY `estampa_tempo`
        ORDER BY `estampa_tempo` ASC)

        SELECT DATE(estampa_tempo) AS month, count
        From dados
    '''
    query_job = client.query(query)
    df = query_job.to_dataframe()
    # convert month to string
    df['month'] = df['month'].astype(str)
    result = df.set_index('month').to_dict(orient='index')

    return result
