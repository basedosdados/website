---
title: Analisando preços de combustíveis com a BD
description: >-
  Veja como analisar a variação média dos preços de combustíveis no Brasil com
  valores corrigidos pelo IPCA
date:
  created: "2021-10-29T15:22:29.489Z"
authors:
  - name: Lucas Moreira
    role: Autor
    social: https://github.com/lucasnascm
  - name: Gustavo Aires
    role: Autor
    social: https://github.com/gustavoairestiago
thumbnail: /blog/analisando-precos-de-combustiveis/image_0.jpg
categories: [analise]
medium_slug: >-
  https://medium.com/@basedosdados/analisando-pre%C3%A7os-de-combust%C3%ADveis-com-a-bd-9524fadbdfb4
published: true
---

<Image src="/blog/analisando-precos-de-combustiveis/image_0.jpg"/>

## TL;DR

Qual o preço do combustível na sua cidade? Neste artigo vamos apresentar os dados da base de pesquisa com preços de distribuição de combustíveis e de gás de cozinha (GLP), divulgados pela [Agência Nacional do Petróleo](https://www.gov.br/anp/pt-br). Além disso, vamos apresentar uma análise da evolução dos preços em relação à inflação, demonstrando como você pode usar a Base dos Dados para analisar como é esse cenário em sua própria cidade, ou no recorte que quiser.

## Entendendo a Série Histórica de Preços

A ANP fornece, a cada semana, a série histórica com os microdados dos preços praticados por diferentes postos de revenda em todo o Brasil. A base inclui informações dos preços da gasolina, etanol, diesel s10, gasolina aditivada, glp, diesel e gnv, desde 2004 até outubro de 2021.

A Base dos Dados disponibiliza estes dados de uma maneira mais intuitiva: tratados, padronizados e compatibilizados. Especificamente, o [script de tratamento](https://github.com/basedosdados/mais/blob/master/bases/br_anp_precos_combustiveis/code/%5Bdados%5D_br_anp_preco_combustiveis.ipynb) dos dados consistiu em unir os _dataframes_ com os diferentes tipos de combustíveis e meses do ano, além de incluir o código do IBGE para os municípios presentes na base — o que facilita o _merge_ com outras informações. A inclusão do código do IBGE também simplifica a visualização da tabela, mudando o formato da data ou ainda compatibilizando o endereço do estabelecimento. Vale ressaltar que a pesquisa abrange 883 municípios, ao longo dos 18 anos de pesquisa. Só em 2021 foram coletadas informações de 22.629 postos de revenda dos 27 estados.

A base contém informações sobre a localização de cada posto (UF, município e endereço completo), especificidades do estabelecimento (CNPJ, nome e bandeira), além do produto e dos preços praticados nas mais de 26 milhões de observações.

## Como consultar esses dados

A BD permite que você acesse todas essas informações com uma simples consulta de SQL no BigQuery, ou através dos nossos pacotes no Python e no R. Por conta do tamanho da base, o download direto pela plataforma não é possível.

Para explorar os dados dessa base, acesse a [página deste conjunto de dados](/dataset/c962b5e4-e71c-4e7c-b172-5e70951be633) em nossa plataforma e confira a seção Consulta aos Dados.

<Image src="/blog/analisando-precos-de-combustiveis/image_2.png" caption="Página do conjunto Preços de Combustíveis — Dados Históricos"/>

<Image src="/blog/analisando-precos-de-combustiveis/image_3.png" caption="Seção consulte esses dados"/>

## Os olhos da cara — Analisando a evolução de preço dos combustíveis no Brasil

As notícias nos últimos meses têm anunciado a constante alta dos combustíveis. Muito se fala da gasolina à R$7, dos impostos, insumos e da cotação do dólar. Nossa análise propõe observar os dados deflacionados e comparados à inflação, isto é, a variação dos preços atuais em relação à variação do índice de preços ao consumidor.

Cumprindo a nossa missão — acessar os dados em um único lugar — conseguimos captar dados do [Índice Nacional de Preços ao Consumidor Amplo (IPCA)](/dataset/c58781fb-1177-448d-87ff-56b5cbf1735c), também disponíveis na BD, além de manipular a nossa base de preços dos combustíveis da Agência Nacional do Petróleo, Gás Natural e Biocombustíveis (ANP).

Com o código SQL(query) abaixo, conseguiremos extrair: o ano e mês de referência das informações; o produto (combustível) e seu preço médio da base da ANP, além de atualizar o preço para os valores atuais com os dados da inflação.

### Etapa #1

```sql
WITH
  sub AS (
  SELECT
    p.produto,
    ip.indice AS indice_atual
  FROM
    basedosdados.br_anp_precos_combustiveis.microdados p
  LEFT JOIN
    basedosdados.br_ibge_ipca.mes_brasil ip
  ON
    p.ano=ip.ano
    AND EXTRACT(MONTH
    FROM
      p.data_coleta)=ip.mes
  WHERE
    p.ano = 2021
    AND EXTRACT(MONTH
    FROM
      p.data_coleta) = 9
  GROUP BY
    1,
    2)
```

Na etapa #1, indicada na query acima, fazemos uma subconsulta para retornar o combustível desejado da base de preços da ANP e o índice de inflação atual do IPCA. Para isso, extraímos o mês da data de coleta dos preços e fazemos uma junção (`join`) com o mês atual da tabela `mes_brasil`, do dataset `br_ibge_ipca`. Fazemos isso filtrando o mês e ano que desejamos utilizar como base para a atualização dos preços. Neste caso, utilizamos `ano=2021` e `mes=9`, mas você pode atualizar essas informações de acordo com os dados disponíveis nas bases.

### Etapa #2

```sql
SELECT
  p.ano,
  EXTRACT(MONTH
  FROM
    p.data_coleta) AS mes,
  p.produto,
  ROUND(AVG(p.preco_venda),3) AS preco_medio,
  ROUND((AVG(sub.indice_atual)/AVG(ip.indice))*AVG(p.preco_venda),3) AS preco_corrigido,
FROM
  basedosdados.br_anp_precos_combustiveis.microdados p
LEFT JOIN
  basedosdados.br_ibge_ipca.mes_brasil ip
ON
  p.ano=ip.ano
  AND EXTRACT(MONTH
  FROM
    p.data_coleta)=ip.mes
INNER JOIN
  sub
ON
  p.produto=sub.produto
WHERE
  ip.mes IS NOT NULL
```

Na etapa #2, deflacionamos os preços dos combustíveis, o que, em resumo, significa corrigi-los para o valor da data de referência de sua escolha. O cálculo é simples: dividimos o índice da inflação do período que desejamos utilizar como base pelo índice da inflação do período ao qual o preço se refere. Para isso, fazemos a junção dos produtos resultantes da subconsulta com os produtos da tabela de preços. Assim, conseguimos dividir o índice base de inflação do mês escolhido com o índice referente aos preços em cada período e multiplicá-lo por cada um dos preços da série histórica.

Por fim, com a consulta executada, iremos obter uma tabela com os preços de combustíveis desde 2004, atualizados para preços de setembro de 2021. Agora esses valores podem ser comparados entre si, com a equivalência dos preços em valores atuais corrigidos pelo IPCA.

### Como criar um gráfico para ilustrar a análise

<Image src="/blog/analisando-precos-de-combustiveis/image_5.png"/>

Iremos demonstrar a construção de um gráfico para comparar a evolução dos preços com a taxa de inflação realizando uma normalização dos valores para 2004. Para isso, utilizamos o [Plotly](https://plotly.com/python/), uma poderosa ferramenta gráfica disponível para diferentes linguagens.

Não estamos analisando aqui o preço médio do combustível, mas a variação dos preços ao longo dos meses, utilizando como base o ano de início dos dados em comparação com o crescimento inflacionário dos preços.

O primeiro passo é instalar e importar os pacotes python. Utilizamos o pacote `basedosdados` para realizar a consulta na base de dados, a biblioteca pandas para o tratamento e manipulação dos dados e plotly para a elaboração da visualização gráfica. Abaixo demonstramos como instalar e importar os pacotes:

```bash
pip install pandas
pip install basedosdados
pip install plotly==5.3.1
```

```python
import pandas as pd
import basedosdados as bd
import plotly.graph_objs as go
```

Com a query abaixo conseguimos extrair: o ano e mês de referência das informações; o produto (combustível) e seu preço médio da base da ANP no mês e em maio de 2004 (data base), além de normalizar o preço e o índice de inflação para os valores da data base.

```python
# define a query dos dados
query = """
WITH
  sub AS (
  SELECT
    p.produto,
    AVG(p.preco_venda) AS preco_04,
    ip.indice AS indice_04
  FROM
    basedosdados.br_anp_precos_combustiveis.microdados p
  LEFT JOIN
    basedosdados.br_ibge_ipca.mes_brasil ip
  ON
    p.ano=ip.ano
    AND EXTRACT(MONTH
    FROM
      p.data_coleta)=ip.mes
  WHERE
    p.ano = 2004
    AND EXTRACT(MONTH
    FROM
      p.data_coleta) = 5
  GROUP BY
    1,
    3)
SELECT
  p.ano,
  EXTRACT(MONTH
  FROM
    p.data_coleta) AS mes,
  p.produto,
  AVG(sub.preco_04) AS preco_2004,
  AVG(p.preco_venda) AS preco_medio,
  ip.indice AS indice_at,
  AVG(sub.indice_04) AS indice_2004,
  AVG(p.preco_venda)/AVG(sub.preco_04) AS preco_normalizado,
  ip.indice/AVG(sub.indice_04) AS indice_normalizado
FROM
  basedosdados.br_anp_precos_combustiveis.microdados p
LEFT JOIN
  basedosdados.br_ibge_ipca.mes_brasil ip
ON
  p.ano=ip.ano
  AND EXTRACT(MONTH
  FROM
    p.data_coleta)=ip.mes
INNER JOIN
  sub
ON
  p.produto=sub.produto
WHERE
  ip.indice IS NOT NULL
GROUP BY
  1,
  2,
  3,
  6
"""
```

Nesta primeira query fazemos uma subconsulta para retornar o combustível da base de preços da ANP, o índice de inflação IPCA e o preço em maio de 2004.

<Image src="/blog/analisando-precos-de-combustiveis/image_6.png"/>

Na segunda consulta, iremos normalizar os preços dos combustíveis e o índice de inflação. No cálculo da normalização, dividimos o preço do período ao qual se refere o dado pelo preço em maio de 2004. Faremos o mesmo com o índice de inflação. Para isso, é preciso fazer a junção dos produtos resultantes da subconsulta com os produtos da tabela de preços, para realizarmos a normalização com os valores necessários da data base e dos preços de cada combustível em cada mês.

```python
# utiliza a API para importar os dados com a query
df = bd.read_sql(query, billing_project_id="basedosdados-dev")
```

Nesse próximo passo, execute a requisição pelo pacote da basedosdados indicando `df` como o objeto que armazenará o `DataFrame`:

```python
# Formata datas
df["date"] = df.apply(lambda x: "%s-%s" % (x["ano"], x["mes"]), axis=1)
df = df.dropna(subset=["mes"])
df["date"] = pd.to_datetime(df["date"]).dt.to_period("m")
df["date"] = df["date"].apply(lambda x: x.strftime("%Y-%m"))
df["date"] = df["date"].replace("-", "_", regex=True)
df[["ano", "mes"]] = df[["ano", "mes"]].astype("int64")
df = df.sort_values(["ano", "mes"])
```

Com as transformações acima, modificamos as datas nos formatos desejáveis (`ano_mes`) para a construção do gráfico e ordenamos os valores de forma ascendente pelas datas.

```python
produto = pd.DataFrame(df["produto"].drop_duplicates()).replace(" ", "_", regex=True)
produto = produto["produto"].values.tolist()

inflacao = pd.DataFrame(df["indice_normalizado"].drop_duplicates())
inflacao = inflacao["indice_normalizado"].values.tolist()
date_in = df["date"].drop_duplicates().values.tolist()
```

Criaremos uma lista com os combustíveis para um laço de criação de listas com datas e preços normalizados de cada combustível e uma lista com os valores normalizados da inflação. Para isso, faremos transformações nas colunas, retirando espaços entre os nomes dos produtos e criando uma lista com valores únicos de produto(combustível).

O laço abaixo cria as listas de preços normalizados e datas para cada combustível.

```python
for i in produto:
    a = df["produto"] == i
    exec("df_{} = df[a]".format(i))
    exec(
        'p_{} = df_{}["preco_normalizado"].drop_duplicates().values.tolist()'.format(
            i, i
        )
    )
    exec('date_{} = df_{}["date"].drop_duplicates().values.tolist()'.format(i, i))
    exec(
        'indice_{} = df_{}["indice_normalizado"].drop_duplicates().values.tolist()'.format(
            i, i
        )
    )
    exec('dind_{} = df_{}["date"].drop_duplicates().values.tolist()'.format(i, i))
```

O plotly cria os gráficos a partir do desenho dos traços (`fig_trace`) de cada produto. Portanto, precisamos configurar cada traço com os parâmetros de cor e largura da linha (você pode alterar esses parâmetros quando quiser). O segundo passo é configurar os valores dos eixos x e y com seus respectivos rótulos. Os valores de “tickvals” devem ser os mesmos da base de dados, o `ticktext` pode ser alterado por você com o formato de valores de sua preferência, esse é somente o rótulo de dados para os valores de `tickvals`. Confira abaixo:

```python
fig = go.Figure()

fig.add_trace(
    go.Scatter(
        x=date_gasolina,
        y=p_gasolina,
        line_color="rgb(255,132,132)",
        line_width=4,
        name="Gasolina",
        showlegend=True,
    )
)

fig.add_trace(
    go.Scatter(
        x=date_etanol,
        y=p_etanol,
        line_color="rgb(43,140,77)",
        line_width=4,
        name="Etanol",
        showlegend=True,
    )
)

fig.add_trace(
    go.Scatter(
        x=date_diesel,
        y=p_diesel,
        line_color="rgb(246,158,76)",
        line_width=4,
        name="Diesel",
        showlegend=True,
    )
)

fig.add_trace(
    go.Scatter(
        x=date_gnv,
        y=p_gnv,
        line_color="rgb(66,176,255)",
        line_width=4,
        name="GNV",
        showlegend=True,
    )
)

fig.add_trace(
    go.Scatter(
        x=dind_diesel,
        y=indice_diesel,
        line_color="rgb(99,99,99)",
        line_width=4,
        line_dash="dot",
        name="Inflação",
        showlegend=True,
    )
)

fig.update_layout(
    template="plotly_white",
    xaxis=dict(
        tickvals=[
            "2004_01",
            "2005_01",
            "2006_01",
            "2007_01",
            "2008_01",
            "2009_01",
            "2010_01",
            "2011_01",
            "2012_01",
            "2013_01",
            "2014_01",
            "2015_01",
            "2016_01",
            "2017_01",
            "2018_01",
            "2019_01",
            "2020_01",
            "2021_01",
        ],
        ticktext=[
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
        ],
        showline=True,
        showgrid=False,
        showticklabels=True,
        scaleanchor="x",
        scaleratio=20,
        linecolor="rgb(204, 204, 204)",
        linewidth=2,
        title="período",
        ticks="outside",
        tickfont=dict(
            family="Ubuntu",
            size=14,
            color="rgb(82, 82, 82)",
        ),
    ),
    yaxis=dict(
        autorange=True,
        tickvals=[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
        ticktext=["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"],
        title="Preço (normalizado 2004-05 = 1)",
        showgrid=True,
        zeroline=True,
        ticks="outside",
        tickfont=dict(family="Ubuntu", size=14, color="rgb(82, 82, 82)"),
        showline=True,
        showticklabels=True,
    ),
    autosize=False,
    height=800,
    width=900,
    showlegend=True,
    plot_bgcolor="white",
)
fig.update_shapes()

fig.update_traces(mode="lines")
fig.show()

fig.write_image("grafico.png")
```

Por fim é só executar `fig.write_image('grafico.png')` para salvar o gráfico no caminho especificado, como demonstramos acima.

Essa e outras análises você consegue acompanhar na íntegra pelo nosso [Github](https://github.com/basedosdados/analises).

A Base dos Dados é uma iniciativa open source e sem fins lucrativos que busca diminuir a distância entre sua pergunta e os dados. Esperamos que você se sinta inspirado em utilizar esse e outros dados. Afinal, muitas outras análises podem ser realizadas.

Compartilhe conosco seus achados em nossas redes sociais ou em nossa comunidade no [Discord](https://discord.gg/WzzzQs9T).
