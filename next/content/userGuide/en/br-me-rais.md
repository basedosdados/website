---
title: RAIS Usage Guide
description: >-
  Usage guide for the Relação Anual de Informações Sociais (RAIS). This material contains information about the most important variables, frequently asked questions, and usage examples for the RAIS dataset 
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Text
---

# Introduction

> This guide contains detailed information about the data. For questions about accessing or using the platform, see our [Frequently Asked Questions page](/faq).

This dataset has two microdata tables: 
- **Establishment Microdata:** Each row represents an establishment in a specific year. The columns show details about the company and its employees.
- **Employment Record Microdata:** Each row represents an employment record in a specific year. The columns show information about the employment record, the employee, and the hiring company.

# Considerations for analysis
## Employment records and data filtering
The employment record table shows all employment records registered by a company during the year. If an employee is dismissed and another is hired in the same year for the same position, both will have an employment record. To count active employees in a sector or region, use the `vinculo_ativo_3112` column.

## Address information
RAIS does not contain information about employees' home addresses. The `id_municipio` column refers to the company's municipality, and the `id_municipio_trabalho` column refers to the municipality where the employee works, when different.

## Partial and complete data
RAIS is released twice a year. Between the partial release (September) and the complete release (early the following year), the most recent year in the series always shows fewer records. For example, in November 2025, the year 2024 shows about 46 million employment records, while 2022 and 2023 have more than 50 million. This does not mean the number of employment records fell — it only means the 2024 data had not yet been fully released.

# Limitations
The data are limited to workers with a formal employment record and do not include informal or self-employed workers. The public data are anonymized.

# Inconsistencies
## `quantidade_vinculos_ativos` and `tamanho_estabelecimento` columns
There are discrepancies between the `quantidade_vinculos_ativos` and `tamanho_estabelecimento` columns. The first shows the total number of employment records, while the second classifies the establishment by number of employment records. In some cases, the number of employment records does not match the establishment size category.

## Employment records in RAIS and CAGED
RAIS registers employment records annually, while CAGED registers hiring and dismissal movements throughout the year. In theory, adding or subtracting CAGED's movements to RAIS's total employment records should yield the following year's total, but this does not happen. Because the two systems operate independently, the discrepancies may result from errors accumulated in each one.

## `id_municipio_trabalho` column
The `id_municipio_trabalho` column is populated only between 2005-2011 and 2017-2021. The reason is unknown.  

## Outdated data
Sometimes RAIS data are updated outside the expected calendar, and our team does not always find out. If you are confident that you are running the correct queries, contact us with the query and the discrepancy relative to the official site, so that we can assess the situation and correct it if necessary.  

# Observations over time
Each year, the dataset is updated, so that an establishment or employment record appears in every year it was active. Because the data are anonymized, it is not possible to track individual employment records or companies over time, but it is possible to analyze the number of formally registered employees in different sectors or locations.

# Duplicate rows
No duplicate rows were found in this dataset. However, the Employment Record Microdata table includes all employment records for a company, so if an employee was dismissed and another hired in the same year, there will be two rows for the same position.

# Merging with other datasets
The data are anonymized and do not contain CNPJs or CPFs. This limits merges with other datasets, but columns such as `cnae` and `cep` can be used for that purpose.

# Downloading the data
The microdata total more than 350 GB. To avoid overloading your computer, we recommend using BigQuery queries to process the data in the cloud before downloading it. Filter by the partition columns (such as `ano` and `sigla_uf`) and select only the relevant columns.

# Collection instrument
The current collection instrument is a form that employers must fill out about their employees.

# Changes in data collection
Some columns have been added or removed over time. Starting in 2022, eSocial group 3 companies were no longer required to report RAIS through the usual program. Comparing that year's results with results from previous years is therefore not recommended.

# Updates
The data have a partial and a complete update. The partial update occurs in September of the collection year, and the complete update occurs by the beginning of the year following the collection year. This means that data for reference year 2023, collected in 2024, became partially available in September 2024, and the complete version was released by early 2025. Updates can sometimes occur outside the expected calendar. If you notice that the data are outdated, contact our team.

# Identified data
The data are anonymized and do not contain CNPJs or CPFs. To obtain identified RAIS data, you must submit a request to the MTE. The process can be lengthy, and there is no guarantee of approval.

# Processing performed by DB
In this guide, the processing steps are described in more accessible language. In addition, the [processing code](https://github.com/basedosdados/pipelines/tree/main/models/br_me_rais/code) and the [modifications made in BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_rais) are available in the GitHub repository for reference. 
The processing steps performed were: 
* Standardizing the columns that identify municipalities to the IBGE Municipality ID format (7 digits);
* Standardizing the columns that identify Federative Units to the state abbreviation (UF) standard;
* Replacing invalid codes (such as "9999" or "000") with null values in the `bairros`, `cbo`, `cnae`, and `ano` columns;
* Standardizing the codes in the `tipo_estabelecimento` column to ensure consistency across different years.

# Supporting materials
* [Guidance manual for employers on how to fill out the form fields](http://www.rais.gov.br/sitio/rais_ftp/ManualRAIS2023.pdf)
* [Detailed information about RAIS on the MTE website](http://www.rais.gov.br/sitio/sobre.jsf)
* [MTE dashboard with consolidated figures for the complete RAIS](https://app.powerbi.com/view?r=eyJrIjoiZmJmMDVhODctMTEwOS00YTVhLWJhNzItOWE3NmVlMWEwMTUxIiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9)
* [MTE dashboard with consolidated figures for the partial RAIS](https://app.powerbi.com/view?r=eyJrIjoiNjk3M2IwZDYtOGQzMS00YmE1LWE3M2MtZWRjODA4NTk3YTQ2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9)
* [Dardo System: the system we use to validate the tables made available](https://bi.mte.gov.br/bgcaged/)
