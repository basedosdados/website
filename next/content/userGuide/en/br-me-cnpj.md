---
title: CNPJ data usage guide
description: >-
  Usage guide for the CNPJ data. This material contains information on the most important variables, frequently asked questions, and usage examples for the RAIS dataset
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

This dataset has four microdata tables:  
- **Companies:** Each row represents a company and its attributes. The columns describe attributes such as legal nature and type of ownership structure. 
- **Partners:** Each row represents a partner of a company. The columns describe the partner's characteristics and qualify their relationship with the company.
- **Establishments:** Each row represents an operating establishment of a company. The columns detail information on location, economic activity, and contact information.
- **Simples:** Each row represents a company and indicates whether the company is enrolled in Simples Nacional or MEI.  

The table that links all of them is the Companies table. A company can have several partners, several establishments, and can be classified as Simples Nacional or MEI. 

The Companies, Partners, and Establishments tables are released as snapshots. For each date, there is a portrait of the National Registry of Legal Entities (CNPJs) and their attributes.

# Considerations for analysis
## Difference between establishments and companies
A company can have several establishments. The `cnpj_basico` column refers to the company, and the `cnpj` column refers to the establishment. As a result, the company's `cnpj_basico` value repeats in proportion to the number of establishments in the Establishments table. Some information from the Companies table, such as legal nature, can be assigned to establishments. To do so, the company table must be merged with its establishments.

## Filtering active CNPJs
To filter only active CNPJs, use the `situacao_cadastral` column.

# Limitations
Data are available only from 2021-11-23 onward. Records prior to that date cannot be accessed. However, the database is cumulative and does not exclude records. It only updates the registration status and attributes of the CNPJs. Thus, even without being able to track changes before 2021-11-23, it is possible to look up every CNPJ ever opened in Brazil.

# Inconsistencies
No inconsistencies have been reported in this dataset so far.

# Observations over time
The data are released as snapshots. For each date, there is a portrait of the CNPJs and their attributes. With the exception of the Simples table, the date column reports the date on which the data were extracted. Data prior to 2021-11-23 are presented with the status as of that date.

# Duplicate rows
In most files released by the Receita Federal, there are only a few dozen duplicate rows in the data. These duplications come from the original source and represent less than 0.1% of the total, which normally does not affect analyses.

However, on two specific dates, the Receita Federal files contain a significant number of duplicate rows:
  - Partners table on 2024-09-18: 4,625,789 duplicate rows were found
  - Establishments table on 2024-10-16: 8,100,851 duplicate rows were found
These duplicate rows were not removed from the tables. During integrity testing, it was found that the number of unique CNPJs was lower than that recorded on previous dates. This indicates that the duplications may have replaced CNPJs that should be present in the tables.

# Crosswalks
The tables can be merged using the `cnpj_básico` and `data` columns. It is necessary to understand the unique keys of each table to avoid duplications.

# Downloading the data
The microdata total more than 300 GB. To avoid overloading your computer, we recommend using queries in BigQuery to process the data in the cloud before downloading them. Filter by partition columns (such as year and state) and select only the relevant columns.

# Collection instrument
The current collection instrument is the Basic Entry Document (Documento Básico de Entrada, DBE), used by the Receita Federal to register, amend, or close a legal entity's registration.
  
# Changes in collection
There have been no changes to the collection methodology from 2021 up to the time this guide was prepared (2025-01-08).

# Updates
The data are updated after the 15th of each month. Our platform runs automatic daily checks for updates.

# Identified data
The partners' CPF data are made available in anonymized form. The identified database cannot be obtained. 

# Processing done by DB:
In this guide, the processing steps are described in more accessible language. In addition, the [processing code](https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/br_me_cnpj/tasks.py#L50C1-L50C74) and the [modifications made in BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_cnpj) are available in the GitHub repository for reference.

## Companies table
- Replacement of ',' with '.' in the `capital_social` column
- Left-padding with zeros (0) to a maximum length of 8 digits in the `cnpj_basico` column
- Left-padding with zeros (0) to a maximum length of 4 digits in the `natureza_juridica` column

## Partners table
- Conversion of the `data_entrada_sociedade` column to the year-month-day standard (%Y-%m-%d)
- Left-padding with zeros (0) to a maximum length of 8 digits in the `cnpj_basico` column
- Replacement of the value that identifies null CPF values from "***000000***" to ""

## Establishments table
- Left-padding with zeros (0) to a maximum length of 8 digits in the `cnpj_basico` column
- Left-padding with zeros (0) to a maximum length of 4 digits in the `cnpj_ordem` column
- Left-padding with zeros (0) to a maximum length of 2 digits in the `cnpj_dv` column
- Creation of the `cnp` column by joining the values of the `cnpj_basico`, `cnpj_ordem`, and `cnpj_dv` columns
- Creation of the 7-digit IBGE `id_municipio` column from the `id_municipio_rf` column (Receita Federal municipality ID)
- Conversion of the `data_situacao_cadastral`, `data_situacao_especial`, and `data_inicio_atividade` columns to the year-month-day standard (%Y-%m-%d)

## Simples table
- Replacement of N with 0 and S with 1 in the `opcao_simples` column
- Replacement of N with 0 and S with 1 in the `opcao_mei` column
- Left-padding with zeros (0) to a maximum length of 8 digits in the `cnpj_basico` column
- Conversion of the `data_opcao_simples`, `data_exclusao_simples`, `data_opcao_mei`, and `data_exclusao_mei` columns to the year-month-day standard (%Y-%m-%d)



# Supporting materials
* [Confidentiality assessment of the information contained in the Open Data of the National Registry of Legal Entities (CNPJ)](https://www.gov.br/receitafederal/dados/nota-cocad-rfb-86-2024.pdf/)
* [DB tutorial on how to access and analyze CNPJ data using SQL, Python, or R](https://www.youtube.com/watch?v=WQruVEizTlc&t=1782s)
