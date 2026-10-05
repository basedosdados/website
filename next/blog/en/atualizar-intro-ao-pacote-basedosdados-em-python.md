---
title: Introduction to the basedosdados package in Python
description: Explore the data in our public datalake
slug: intro-to-the-basedosdados-python-package
date:
  created: "2021-04-16"
authors:
  - name: Vinicius Aguiar
    role: Data Basis team 💚
    social: https://medium.com/u/2af0c71cb64a
  - name: Fernanda Scovino
    role: Data Basis team 💚
    social: https://medium.com/u/444581849446
thumbnail: /blog/intro-ao-pacote-basedosdados-em-python/image_0.jpg
categories: [tutorial]
medium_slug: https://medium.com/@basedosdados/intro-ao-pacote-basedosdados-em-python-4e05439e936d
published: false
---

<Image src="/blog/intro-ao-pacote-basedosdados-em-python/image_0.jpg"/>

## TL;DR

This article shows **how to use the Data Basis package in Python.** The package lets you reach and analyse more than 70 datasets in our public *datalake*, get information about tables, load data into pandas, and more.

Based on the [workshop "Playing with Data Basis data in Python"](https://www.youtube.com/watch?v=wI2xEioDPgM).

## Reaching Data Basis from Python

Data Basis Mais is our *datalake* of public data, **cleaned, integrated and kept up to date** by our data team — data ready for analysis.

The *datalake* lives in Google BigQuery and costs practically nothing for every user: you have 1 TB per month available for querying. To make life easier for Pythonistas, we built a package for direct access to the repository: **basedosdados**

```sh
# rode para instalar no Python/Jupyter
!pip install basedosdados
```
```python
import basedosdados as bd
```
> **Note.** You need to create a project in Google Cloud in order to query the datalake. The first time you run any function from the package, the instructions will appear and you can follow them step by step. Use the **project ID** that gets generated to run the functions below.

The package has many functions, both for reading data and for publishing it to our Google Cloud project or your own — you can use it to build your own data repository too. The complete list of modules is in [our documentation](https://basedosdados.org/docs/api_reference_python), and you can also see how to contribute by [uploading data to the repository](https://basedosdados.org/docs/colab_data).

## Exploring the package functions

As an illustration, you can list every dataset available in the *datalake* with `list_datasets`. The function returns all datasets, and the `filter_by` parameter narrows them to a search term. Below we search for IBGE data. The `with_description` parameter controls whether each dataset's description is shown as well.

```python
bd.list_datasets(filter_by="ibge", with_description=True)
```
In the same way, you can list the tables in a given dataset with `list_dataset_tables`. You can also get a full view of the columns and their types with `get_table_columns` — all without loading any data into your environment yet.

```python
# Lista as tabelas do conjunto de dados sobre nomes no Brasil
bd.list_dataset_tables(
  dataset_id="br_ibge_nomes_brasil",
  with_description=True
)

# Consultando as colunas de uma das tabelas do conjunto
bd.get_table_columns(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010"
)
```
Before loading, you can even check the total size. Some tables in the repository are very large, so we strongly recommend this step.

```python
bd.get_table_size(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010",
  billing_project_id="seu-id-projeto"
)
```
Finally, `read_table` loads the data into your Python environment. If the dataset in question is very large, you can use `read_sql` instead, which runs a SQL query and loads only the rows you asked for. Both require you to state your `billing_project_id`, the project you enabled at the start, which is billed if you exceed the free limit.

```python
df = bd.read_table(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010",
  billing_project_id="seu-id-projeto"
)
```
In this example we work with [Brazilian names from IBGE's 2010 Demographic Census](/dataset/703f9f0d-caee-4b47-b900-46b1dea2c33c?table=3bc00c7a-28e5-421b-b310-b32bed3dd4d4). According to the Census, Brazil has around 200 million inhabitants carrying more than 130,000 different names. Curious? So were we.

## Building an analysis: what are the most common names in Brazil?

Your guess — Maria or João? Let the data decide.

To answer, we count the frequency of each name in Brazil and sort with the most frequent at the top. Then we build a word cloud to visualise it.

We wrote a `generate_list_sorted_by_freq` function that aggregates the names in the table, counting how often each appears, and sorts the list by frequency. The code follows below.

To create the image we used the `wordcloud` library together with `matplotlib`, both installable via `pip`. `wordcloud` generates an image where the size of each word is set by its frequency, which gives our ranking a nice visual effect.

And the result: **Maria wins.**

<Image src="/blog/intro-ao-pacote-basedosdados-em-python/image_1.jpg" caption="Word cloud of the most frequent names in Brazil. The size of each word corresponds to how common that name is. The largest name in the image is Maria, followed by José, João, Antônio and Francisco."/>

**What do you make of that?** In the next piece we will cover a regional analysis Fred built at the same workshop. See this and other workshops on our [YouTube](https://www.youtube.com/c/BasedosDados).
