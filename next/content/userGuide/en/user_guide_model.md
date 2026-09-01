---
title: Usage Guide Template
description: >-
  This template serves as a reference for usage guides. It should describe the standards agreed on with the team. If you think a standard is worth including, feel free to add it here and we will evaluate it.
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Text
---
<!-- In this template, we keep the text from the CNPJ guide so it can be used as an example

General standards:
- Always use the terms "dataset" and "table." Avoid using the words "base" and "data" on their own, to keep clear which element is being referenced.  
- Prioritize direct, concise language. We recommend using ChatGPT to review the text and make it more objective.
 -->


# Introduction
<!-- Every guide starts with this short notice so new users can find their way around.-->
> This guide contains detailed information about the data. For questions about accessing or using the platform, see our [Frequently Asked Questions page](/faq).

<!-- In the introduction, we describe the tables that make up the dataset.
This description must necessarily include: 
  - Whether the table contains microdata or aggregated data 
  - An explanation of what each row of the table represents
  - A summary of the columns
If there is any information that is key to understanding the dataset, it can also be added here. But be careful not to add too much information — the rest of the guide is there to describe the dataset in more detail.  
   -->
This dataset has four microdata tables:  
- **Companies:** Each row represents a company and its attributes. The columns describe attributes such as legal nature and type of ownership structure.  
- **Partners:** Each row represents a partner of a company. The columns describe some characteristics of the partner and qualify their relationship with the company.
- **Establishments:** Each row represents an operating establishment of a company. The columns detail information on location, economic activity, and contact information.
- **Simples:** Each row represents a company and indicates whether the company is enrolled in Simples Nacional or MEI.  

The table that links all of them is the Companies table. A company can have several partners, several establishments, and can be classified as Simples Nacional or MEI. 

The Companies, Partners, and Establishments tables are released as snapshots. For each date, there is a portrait of the National Registry of Legal Entities (CNPJs) and their attributes.

# Considerations for analysis
<!-- Here we include, as topics, various considerations for analysis — this is the most open-ended category of the guide. We try to include frequently asked questions, usage tips, and common points of confusion -->
## Difference between establishments and companies
A company can have several establishments. The `cnpj_basico` column refers to the company, and the `cnpj` column refers to the establishment. As a result, the company's `cnpj_basico` value repeats in proportion to the number of establishments in the Establishments table. Some information from the Companies table, such as legal nature, can be assigned to establishments. To do so, the company table must be merged with its establishments.

## Filtering active CNPJs
To filter only active CNPJs, use the `situacao_cadastral` column.

# Limitations
<!-- Unlike the considerations section, this space is specifically for limitations imposed by the dataset made available. It can be a methodological limitation or one imposed by the time coverage -->
Data are available only from 2021-11-23 onward. Records prior to that date cannot be accessed. However, the database is cumulative and does not exclude records. It only updates the registration status and attributes of the CNPJs. Thus, even without being able to track changes before 2021-11-23, it is possible to look up every CNPJ ever opened in Brazil.

# Inconsistencies
<!-- Here we include information on inconsistencies we have already found in the database. It is useful to include an explanation of the source of the inconsistencies-->
We don't have any reported inconsistencies yet

# Observations over time
<!-- The purpose of this topic is to explain how to track observations over time and to provide a tip or extra information on this topic -->
The data are released as snapshots. For each date, there is a portrait of the CNPJs and their attributes. With the exception of the Simples table, the date column reports the date on which the data were extracted. Data prior to 2021-11-23 are presented with the status as of that date.

# Duplicate rows
<!-- This topic is meant to state explicitly whether there are duplicate rows. It is useful to include information on why this happens and how to work around it-->
There are a few dozen duplicate rows in the dataset. These duplications come from the original source and represent less than 0.1% of the data, which generally does not affect analyses.

# Crosswalks
<!-- Here we cover the particularities of merging the tables in the dataset. This can include internal crosswalks, within the dataset itself, and external crosswalks, with datasets outside this one -->
The tables can be merged using the `cnpj_básico` and `data` columns. It is necessary to understand the unique keys of each table to avoid duplications.

# Downloading the data
<!-- Here we note whether or not direct download of the data is possible. We start the topic by noting the size of the tables and then explaining how to avoid overloads. The goal is to alert people who are not familiar with very large datasets that direct download is sometimes not possible and filters must be applied -->
The microdata total more than 300 GB. To avoid overloading your computer, we recommend using queries in BigQuery to process the data in the cloud before downloading them. Filter by partition columns (such as year and state) and select only the relevant columns.

# Collection instrument
<!-- This topic describes what the data collection instrument is like. This matters because it provides more context for the data and helps identify possible biases and limitations not listed earlier -->
The current collection instrument is the Basic Entry Document (Documento Básico de Entrada, DBE), used by the Receita Federal to register, amend, or close a legal entity's registration.
  
# Changes in collection
<!-- The goal here is to alert users to any changes in the data over the time series, which matters a great deal for analyses to be carried out with quality -->
There have been no changes to the collection methodology from 2021 up to the time this guide was prepared (2025-01-08).

# Updates
<!-- Here we explain how updates are made at the original source, whether at a specific time of year or month, and whether there is a set schedule. This topic matters so users know when to expect the data to be updated-->
The data are updated after the 15th of each month. Our platform runs automatic daily checks for updates.

# Identified data
<!-- The goal of this topic is to tell users whether identified data exist or whether the data are anonymized. Many users are interested in de-anonymized data, but few datasets have this information -->
The partners' CPF data are made available in anonymized form. The identified database cannot be obtained. 

# Processing done by DB:
<!-- Here we describe the processing steps in more direct language, so that even users without programming knowledge know what processing was done. It is still necessary to leave links for anyone who wants to verify the process. If needed, the processing steps can be split across tables-->
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
<!-- Last, we include supporting materials, so users can consult information directly from the original sources or supplement their understanding of the dataset -->
* [Confidentiality assessment of the information contained in the Open Data of the National Registry of Legal Entities (CNPJ)](https://www.gov.br/receitafederal/dados/nota-cocad-rfb-86-2024.pdf/)
* [DB tutorial on how to access and analyze CNPJ data using SQL, Python, or R](https://www.youtube.com/watch?v=WQruVEizTlc&t=1782s)
