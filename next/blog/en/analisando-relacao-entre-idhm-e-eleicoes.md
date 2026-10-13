---
title: How does municipal HDI relate to the 2018 presidential vote in São Paulo?
description: An easier, more practical way to analyse the index data
slug: municipal-hdi-and-the-2018-presidential-vote
date:
  created: "2022-04-28T15:00:00"
authors:
  - name: Gustavo Alcântara
    role: Text
    social: https://medium.com/@gustavo.geo
  - name: Giovane Caruso
    role: Editing
    social: https://medium.com/@giovanecaruso
thumbnail: /blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/qual-a-rela%C3%A7%C3%A3o-entre-o-idhm-e-a-vota%C3%A7%C3%A3o-presidencial-de-2018-em-sp-aa9f1305586f
published: true
---

## TL;DR

This short article offers a quick, simple visualisation of how the 2018 presidential vote relates to the Municipal Human Development Index (IDHM) of municipalities in São Paulo state. It shows how to reach and analyse the index data more easily through the public Data Basis *datalake*, and walks through the steps used to build the chart.

<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp"/>

## The Municipal Human Development Index (IDHM)

The IDHM is a composite measure of indicators across three dimensions of human development: longevity, education and income. It runs from 0 to 1 — the closer to 1, the higher the human development. While following the same three dimensions, the Brazilian IDHM adapts the global methodology to the Brazilian context and to the national indicators available, which makes it better suited to assessing development in Brazilian municipalities.

Data Basis publishes data from the [Human Development Atlas (ADH)](http://atlasbrasil.org.br/), the site carrying the IDHM and another 200 indicators, already processed and ready for analysis. **The data covers Brazil, states and municipalities** and can be analysed in Python, R, or in BigQuery via SQL. This analysis uses the [Data Basis R package](https://github.com/basedosdados/sdk/tree/master/r-package). Access the dataset [here](/dataset/mundo-onu-adh).

## Analysing the relationship between IDHM and the presidential vote

> For every good question there is a good analysis to be done.

Whenever you set out to work with data, statistics and analysis, the first thing that matters is a good question. It will save you real time in cleaning and manipulating your dataset. So in this short exercise, with presidential elections approaching, I thought about how the IDHM of São Paulo municipalities might relate to the last presidential election. Is there a relationship between whether a candidate won and the HDI of the municipalities?

### How to present that relationship?

Correlating data is not always straightforward. But with a few lines of code and good libraries in your analysis software, showing the trend or correlation graphically is relatively simple.

My mother tongue in programming is R. I started building analyses in 2016 using R base, and today I use RStudio for its interface and quick manipulation. I like R a great deal, and above all its community, which is always willing to help. Data Basis makes its whole datalake available for access and manipulation in R and other languages.

### Building the dataframe

Now for the fun part: coding. The first step is to build the dataframe that answers the question above. I left the notes in the code itself. If anything is unclear, you can find me on the [Data Basis Discord server](https://discord.com/invite/huKWpsVYx4) — my handle is @gustavoalcantara. Here are the first steps:

```r
# Inicio da Jornada
# Atribuição do projeto na Base dos dados

con <- bigrquery::dbConnect(
  bigquery(),
  billing = "basedosdados-elections",
  project = "basedosdados"
)

# indo para o meu projeto no Google DataLake
basedosdados::set_billing_id("basedosdados-elections")

# query necessária para responder à minha pergunta
query <- "
SELECT
  ano,
  turno,
  sigla_uf,
  sigla_partido,
  id_municipio,
  votos,
  resultado,
  cargo
FROM
  `basedosdados.br_tse_eleicoes.resultados_candidato_municipio`
WHERE
  ano = 2018
  AND sigla_uf = 'SP'
  AND cargo = 'presidente'
"

# atribuição do Dataframe
df <- DBI::dbGetQuery(con, query)
```
With the `dataframe` in hand, the next step is to work out each presidential candidate's share of the vote per municipality, so we can look at the relationship with the IDHM. This code creates the new variable:

```r
# Criação de Variável: Porcentagem das votações
df <- df |>
  dplyr::group_by(id_municipio) |>
  dplyr::mutate(porcentagem = votos / sum(votos) * 100)
```
Part of the point of this piece is that you can also work with a table from outside Data Basis. So I imported a `.csv` from my computer holding the IDHM of São Paulo municipalities, and renamed the municipality variable so we could join on it. Since the aim is to look at a possible relationship between IDHM and vote share, it is easier to see graphically with the variables lined up. Here is the code I used:

```r
# Juntando o IDHM de uma base externa com a base de Eleições
# Lendo a base Externa
idhm <- read.csv("idhm_sp.csv")
# Mudando o nome da variável Cod.IBGE para id_municipio
# para o futuro join
idhm <- idhm |>
  dplyr::rename(id_municipio = "Cod.IBGE")
# Join entre as tabelas
df |>
  dplyr::left_join(idhm,
    by = "id_municipio"
  )
```
Done — the dataframe is ready. It looks like this:

<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_1.webp"/>

### Charting the relationship between IDHM and vote share

With the complete dataframe, building a visualisation of our general question is straightforward. Here is the code and the chart:

```r
# grafico das relacoes
dplyr::filter(df, turno == 2) |>
  dplyr::group_by(id_municipio) |>
  ggplot2::ggplot(aes(
    x = idhm_2010,
    y = porcentagem,
    color = resultado
  )) +
  geom_point() +
  geom_smooth() +
  scale_color_discrete(labels = c("Bolsonaro", "Fernando Haddad")) +
  labs(
    title = "Relação entre IDHM e Porcentagem de Votos em SP",
    x = "IDHM",
    y = "Porcentagem de Votos",
    colour = "Candidato:"
  ) +
  theme(legend.position = "bottom")
```
<Image src="/blog/analisando-relacao-entre-idhm-e-eleicoes/image_0.webp"/>

And there it is. This gives a first read on the relationship between the IDHM in São Paulo state and the 2018 presidential vote. Each dot is a municipality, positioned on the y axis by the percentage of votes each candidate received — blue dots for Fernando Haddad, red for Bolsonaro. Notice how, in municipalities with a high IDHM (above 0.70), the vote share runs in opposite directions for the two candidates. Haddad took his lowest share in those municipalities, while Bolsonaro took his highest, trending upward as the HDI rises.

Does the same pattern hold in other states? Run your own analysis. If you need a hand, Data Basis has a team ready to help — bring your questions to [our Discord community](https://discord.com/invite/huKWpsVYx4).
