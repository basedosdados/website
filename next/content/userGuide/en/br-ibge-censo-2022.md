---
title: Usage guide for the 2022 Census dataset
description: >-
  Usage guide for the Annual Social Information Report (RAIS). This material contains information on the most important variables, frequently asked questions, and usage examples for the RAIS dataset 
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

This dataset has 2 microdata tables: 
- **Establishment Microdata:** Each row represents an establishment in a given year. The columns describe characteristics of the company and its employees.
- **Employment Ties Microdata:** Each row represents an employment tie in a given year. The columns describe characteristics of the type of tie, the employee, and the hiring company.

# Considerations for analysis
## Employment ties and data filtering
The Employment Ties table includes every employment tie registered by a company during the year. Therefore, if an employee was dismissed and another hired for the same position in the same year, both will have a row for that position at the company. If the goal is to assess the total number of active employees in a sector or region, the `vinculo_ativo_3112` column must be used to filter for only the ties that are active on the date indicated.

# Limitations
* The data made available are limited to workers with a formal employment tie, and do not include information on informal or self-employed workers.
* The public data are anonymized.

# Inconsistencies
## Columns quantidade_vinculos_ativos and tamanho_estabelecimento
The `quantidade_vinculos_ativos` and `tamanho_estabelecimento` columns in the establishments table contain information that is inconsistent with each other. The first is an integer representing the total number of ties at that establishment, and the second is a category defined by the total number of ties. However, we found several cases in which the number of ties does not fall within the range defined by the establishment size. It is not yet known why this inconsistency occurs.

# Observations over time
These tables do not allow tracking of variables over time. To make comparisons across years, the microdata available in the Census microdata dataset must be aggregated.

# Duplicate rows
No evidence of duplicate rows has been found in the tables of this dataset so far.

# Cross-referencing
The Census tables can be cross-referenced with others using geographic breakdowns; we have geolocated information at the census tract level. Cross-referencing with other datasets that include municipality information is also possible.

# Downloading the data
Most of the Census tables are not very large; some can be downloaded directly through our platform, while others must be downloaded via Python or R.

# Collection instrument
Data collection was conducted, in general, through in-person interviews (direct, face-to-face interviews with household residents). In addition to this traditional method, the 2022 Demographic Census introduced the possibility of collection via the Internet. The census taker could offer this alternative at the resident's request, when there were access restrictions to specific areas (for example, in gated communities), or when any other difficulty arose in conducting the in-person interview. There was also an increase in data collection among Traditional Peoples and Communities, where quilombola communities were surveyed for the first time.

# Changes in collection
Since the data in this dataset refer only to 2022, the collection methodology is the same across the entire dataset.

# Updates
The 2022 Census data have no updates, but IBGE frequently makes new datasets available. The upcoming datasets are scheduled according to the [calendar](https://censo2022.ibge.gov.br/panorama/calendario.html?localidade=BR).

# Processing done by DB
Processing of the tables is minimal: 
* Inclusion of id_municipio.
* Merging of information on households, population, area, literacy rate, median age, aging index, indigenous population, and quilombola population into a single municipality table.
* Creation of the `idade_anos` and `grupo_idade` columns to facilitate numeric operations on tables that contain age information.

# Supporting materials
* [Technical notes on the 2022 census](https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html?=&t=notas-tecnicas): Relevant information on how each part of the survey was conducted, important for context and useful as inspiration for analyses.
