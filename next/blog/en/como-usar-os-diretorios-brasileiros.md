---
title: "Brazilian Directories: how this dataset makes your analysis easier"
description: >-
  A dataset that works as a complete profile of units such as municipality,
  school, state and more.
slug: how-to-use-the-brazilian-directories
date:
  created: "2021-08-16"
authors:
  - name: Crislane Alves
    role: Data Basis team
    social: https://medium.com/@s.alvescrislane
thumbnail: /blog/como-usar-os-diretorios-brasileiros/image_0.jpg
categories: [tutorial]
medium_slug: >-
  https://medium.com/@basedosdados/diret%C3%B3rios-brasileiros-como-essa-base-facilita-sua-an%C3%A1lise-40dc8ce2ca2
published: true
---

A dataset that works as a complete profile of units such as municipality, school, state and more.

<Image src="/blog/como-usar-os-diretorios-brasileiros/image_0.jpg"/>

## TL;DR

This article introduces our [Brazilian Directories](/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=0a2d8187-f936-437d-89db-b4eb3a7e1735) dataset, available in our public datalake alongside many other public datasets already processed, organised and integrated for analysis. It also shows how the dataset makes it easier to join tables from different collections, and how to apply it in your own work, with a practical example.

## The Brazilian Directories dataset

This dataset centralises information about the basic units used in analysis, working as a complete profile of entities such as municipality, school, state, census tracts and more. Its tables link together institutional codes and information from a range of Brazilian bodies.

That matters because Brazilian institutions have no single shared identifier for municipalities. The dataset also resolves IDs and names that change or carry typos across years and institutions, along with new municipality IDs created over time.

For municipalities, for instance, it links records from organisations such as IBGE, the Federal Revenue Service, the Superior Electoral Court (TSE), the Central Bank of Brazil, judicial districts, health regions and others.

Each table in the dataset represents an entity in our public datalake: `UF` (state), `municipio`, `escola`, `distrito`, `setor_censitario`, the `CID-10` and `CID-9` categories, `CBO-2002` and `CBO-1992`, among others.

The directories create relationships between those entities naturally. The municipality table has a `sigla_uf` column, for example, which tells you which state a municipality belongs to. The same applies to `escola`, where you can identify the municipality a given school sits in.

To show how the Brazilian Directories make joining different collections easier, here are two worked examples of how to use it in your analysis, each with a single SQL query in BigQuery.

## Worked examples

### Mobility and transport indicators

In the first example, we join the `municipio` table from the Brazilian Directories with the `tempo_deslocamento_casa_trabalho` table from the [Mobility and Transport Indicators](/dataset/e3edf621-c491-4d74-a03a-15a759f6e638?table=01114371-3b1b-4574-a3ea-3d7d2125b4f2) dataset produced by [Mobilidados](https://mobilidados.org.br/), which holds data on average home-to-work travel time and the percentage of people spending more than an hour on that journey in 2010.

The `id_municipio` column serves as the key. The aim is to add the `regiao` and `municipio` columns to the new dataset, so that beyond the municipality names you can also group by city, macro-region or state and see which have longer or shorter average travel times.

Here is the query:

```sql
SELECT
  t1.ano,
  t2.nome_uf AS estado,
  t2.nome AS municipio,
  t1.tempo_medio_deslocamento
FROM
  `basedosdados.br_mobilidados_indicadores.tempo_deslocamento_casa_trabalho` AS t1
JOIN
  `basedosdados.br_bd_diretorios_brasil.municipio` AS t2
ON
  t1.id_municipio = t2.id_municipio
```
### Brazilian import and export data

In the second example, we use the `pais` table from the Directories with the `municipio_importacao` table from [Comex Stat](/dataset/74827951-3f2c-4f9f-b3d0-56e3aa7aeb39?table=f4b08023-5530-4dc9-bced-3321e8928fd7), which holds detailed Brazilian export and import data drawn from [SISCOMEX](http://www.siscomex.gov.br/). That particular table covers import data broken down by municipality and importing company.

Here the `id_pais` column is the key, used to pull the country **name** from the Directories. Running the query returns the **country name** alongside the **country ID** and **import value** — in other words, where Brazil's imports came from in 2020.

You can use the query below to see the origin of Brazil's imports in 2020:

```sql
SELECT
  t1.ano,
  t1.sigla_uf,
  t2.nome AS pais,
  SUM(valor_fob_dolar) AS importacao
FROM
  `basedosdados.br_me_comex_stat.municipio_importacao` AS t1
JOIN
  `basedosdados.br_bd_diretorios_brasil.pais` AS t2
ON
  t1.id_pais = t2.id_pais
WHERE
  ano = 2020
GROUP BY
  1,
  2,
  3
ORDER BY
  3 DESC
```
Access the Brazilian Directories dataset [here](/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=0a2d8187-f936-437d-89db-b4eb3a7e1735).

Worth remembering: joining datasets is not possible only because the Directories work as a kind of dictionary. Behind that sits the **Data Basis quality standard** — we make all the data compatible so that it can be joined across tables. Cleaning the datasets in our public datalake involves a rigorous process of standardisation and reconciliation.
