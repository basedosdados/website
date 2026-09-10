---
title: How to reach Data Basis data in Power BI
description: How to connect the public Data Basis datalake to Power BI to build charts, visualisations and dashboards.
slug: how-to-use-data-basis-data-in-power-bi
date:
  created: "2021-07-30"
authors:
  - name: Victor Viana
    role: Author
    social: https://medium.com/@ovictorviana
thumbnail: /blog/como-acessar-dados-da-bd-no-power-bi/image_11.gif
categories: [tutorial]
medium_slug: >
  https://medium.com/basedosdados/como-acessar-dados-da-bd-no-power-bi-aeeea9a9bdc0
published: true
---

## TL;DR

Power BI is one of the most popular tools for building dashboards from relational data, and [Data Basis]() is one of the largest public data lakes in Brazil. Together they make a good environment for analysing and visualising data. This article shows how easy it is to reach Data Basis datasets for use in Power BI, and walks through the steps.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_0.png"/>

## Connecting to Google BigQuery

[Google BigQuery](https://cloud.google.com/bigquery?hl=pt_br) is Google's cloud database service, where the Data Basis datasets are stored inside a public datalake called `basedosdados`. To reach the data you need a (free) BigQuery project. If you already have one, skip to the next step; if not, we wrote two tutorials to get you there quickly:

1. [Article](https://dev.to/basedosdados/bigquery-101-45pk)
2. [Video](https://www.youtube.com/watch?v=nGM2OwTUY_M)

## Connecting the data in Power BI

This walkthrough shows how to connect the municipal GDP series (the fact table) and municipality information (the dimension table) in [Power BI](https://powerbi.microsoft.com/pt-br/downloads/) in order to build an analysis. That dataset is only an example — the tutorial works for any other dataset in the *datalake*.

### Finding the data on the site

To reach data in the BigQuery interface we use SQL queries, one of the most basic and useful languages for anyone working with data. On the Data Basis site you can search for any dataset and copy the SQL directly from the table page, under "Access the data via BigQuery", to use in the Google BigQuery SQL editor, as in the example below. To learn more about the language, we recommend the free [Udacity](https://www.udacity.com/course/sql-for-data-analysis--ud198) course, or BigQuery's own [tutorials](https://cloud.google.com/bigquery/docs/tutorials).

### Selecting the data in BigQuery

Still on the site, click "Query in BigQuery" to be taken to the [*datalake*](https://console.cloud.google.com/bigquery?p=basedosdados&page=project). The BigQuery interface differs from the site because it is a Google service; we explain each element of that interface in this article.

Click "Compose new query", paste the copied code into the editor and run it. Note that the code sets `LIMIT 100` to pull only the first 100 rows. You can change that parameter, or remove it, to pull more — just take care with very large datasets (RAIS, Population Census), since pulling everything at once is slow and consumes a lot of processing, which can incur costs.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_1.png"/>

```sql
SELECT
  pib.id_municipio,
  --selecionar id do municipio
  pop.ano,
  -- população do muunicipio
  pib.PIB / pop.populacao AS pib_per_capita -- calculo do PIB per capita
FROM
  `basedosdados.br_ibge_pib.municipio` AS pib -- selecionar base de pib dos municipios
JOIN
  `basedosdados.br_ibge_populacao.municipio` AS pop -- join com a base de população
ON
  pib.id_municipio = pop.id_municipio
  AND pib.ano = pop.ano
LIMIT
  100
```
<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_2.png"/>

### Saving the data to a private project

Save the resulting table by clicking **Save**. You can save the query or the view.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_3.png"/>

BigQuery will ask you to create a dataset to save the table into, if you do not have one. If you already know Power BI, it works much like a Power BI dataset. Give yours a clear name. At Data Basis we organise dataset names by geographic scope, institution and subject; you can read more about our naming rules [here](https://basedosdados.org/docs/style_data/#nomea%C3%A7%C3%A3o-de-bases-e-tabelas). The dataset is essentially a "folder" holding all the tables in your project. In this example we chose the generic name "tutorial".

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_4.png"/>

Then select the dataset you created, choose a name for your table and click Save. That simple 😊.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_5.png"/>

Your project will now appear in the left sidebar. Click the arrow next to the project name and your dataset will appear with the table you saved. If it does not, refresh the page.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_6.png"/>

To save another table with municipality information (name, state and so on), repeat the process with the query below. We will call this table `dMunicipio`, saved in the same `tutorial` dataset.

```sql
SELECT
  id_municipio,
  nome,
  id_uf,
  sigla_uf,
  nome_regiao
FROM `basedosdados.br_bd_diretorios_brasil.municipio`
```
### Importing the data into Power BI

- Open Power BI
- Go to Get Data -> More

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_7.png"/>

- Search for `Google BigQuery` -> Connect

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_8.png"/>

- Sign in with your Google account — the same one you used to query BigQuery. Signing in with a different account will not connect.

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_9.png"/>

- Grant access to Power BI
- Go back to Power BI and click connect
- Select the folder named after your dataset
- Select the tables

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_10.png"/>

- Click load
- Choose Import
  - In most cases a direct connection is not necessary, and importing means you do not depend on the database connection.

That is it — you now have your Data Basis datasets available to build your dashboard. :)

<Image src="/blog/como-acessar-dados-da-bd-no-power-bi/image_11.gif"/>
