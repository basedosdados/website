---
title: BDMEP Usage Guide
description: >-
  Usage guide for BDMEP Meteorological Data. This material contains information on the most important variables, frequently asked questions, and usage examples for the dataset
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Text
---

# Introduction

> This guide contains detailed information about the data. For questions about accessing or using the platform, consult our [Frequently Asked Questions page](/faq).

This dataset has two microdata tables:  
- **Microdata:** Each row represents a collection of measurements from a station at a given time. The columns provide information on precipitation, pressure, radiation, temperature, humidity, and wind.  
- **Station:** Each row represents a meteorological station. The columns provide geographic information about that station.

# Considerations for analysis

## Calculation method
Before performing operations with BDMEP data, it is crucial to understand how each measure was calculated. Some columns present average values, while others contain maximum or minimum values. The choice of the appropriate variable will depend on the specific needs of the analysis.

## Empty rows, failures, and missing data
INMET-BDMEP data have gaps, such as empty rows caused by sensor and communication problems at the meteorological stations. These gaps can be identified by all value columns being null. It is important to account for these gaps when performing analyses.

## Time conversion
All time information is in UTC. To convert it to official Brasília time, subtract 3 hours. For example, 12:00 UTC is equivalent to 9:00 Brasília time.

## Raw and unvalidated data
Data from the automatic stations are raw and do not undergo a consistency validation process.

# Limitations
* The microdata table made available by DB includes exclusively data from automatic stations.
* Measurements refer to a single point in space. Extrapolating the data to larger areas should be done with weighting.

# Inconsistencies
No inconsistencies have been reported in this dataset yet.

# Observations over time
Each row represents a compilation of measurements taken by a meteorological station over a one-hour interval. The columns provided are aggregations of that period, allowing users to track the evolution of weather conditions over time at the stations.

# Duplicate rows
No duplicate rows have been reported in the tables of this dataset yet.

# Crosswalks
The microdata table can be linked to the station table through the `id_estação` column, enabling geolocation of the data. This makes it possible to cross the data externally with georeferenced tables or tables that have geolocation elements, such as a postal code column. In addition, the station table provides the municipality identifier, expanding the possibilities for crosswalks.

# Downloading the data
The microdata table is larger than 10GB. Depending on the computer's capacity, processing the data may overload the machine. We therefore recommend using queries in BigQuery to process the data in the cloud before downloading it. Filter by the partition column (year) and select only the relevant columns.

# Collection instrument
The data are collected by automatic meteorological stations (EMA). Data collection is carried out through sensors that measure the meteorological parameters to be observed. Measurements are taken at one-minute intervals and integrated over a one-hour period. The data collected by the EMAs are automatically sent to INMET headquarters in Brasília every hour.

# Changes in collection
These tables have been consistent since 2000; we have no record of changes to the collection method.

# Updates
The data are updated at the original source every hour. At Data Basis, we update this information monthly.

# Treatments applied by DB:
In this guide, the treatments are described in more accessible language. In addition, [the extraction and treatment code](https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/br_inmet_bdmep/flows.py) and the [modifications made in BigQuery](https://github.com/basedosdados/queries-basedosdados/blob/main/models/br_inmet_bdmep/br_inmet_bdmep__microdados.sql) are available in the GitHub repository for reference.
The treatments applied to the microdata table were:
* Renaming columns to conform to DB's style manual.
* Replacing invalid codes ("-9999") with null values.
* Adding the station identifier (id_estação) to the microdata table.
* Adjusting the format of the date and time columns for compatibility with BigQuery.

# Supporting materials
* [Technical note on the operation of INMET's meteorological station network](http://www.cemtec.ms.gov.br/wp-content/uploads/2019/02/Nota_Tecnica-Rede_estacoes_INMET.pdf) 
* [INMET notice - find out how to access meteorological data](https://portal.inmet.gov.br/noticias/saiba-como-acessar-os-dados-meteorol%C3%B3gicos-dispon%C3%ADveis-no-site-do-inmet?utm_source=chatgpt.com)
