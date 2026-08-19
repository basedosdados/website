---
title: Usage Guide for Football Championships Data
description: >-
  Usage guide for Football Championships data. This material contains information about the most important variables, frequently asked questions, and examples of how to use the dataset.
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
- **Brasileirão Série A:** Each row represents a match. The columns provide information on match characteristics, results, and game statistics 
- **Copa do Brasil:** Each row represents a match. The columns provide information on match characteristics, results, and game statistics 

# Considerations for analysis
## Data sources and compilation
The tables present information compiled by Transfermarkt. To understand how these statistics were produced and structured, it is necessary to review the compilation methods.

# Limitations
* The tables contain the information available on the Transfermarkt website that our team selected to include. If you find that some information that would be useful for your analysis is not available in this dataset but is available on the Transfermarkt website, please get in touch so we can find out! 

# Inconsistencies
No inconsistencies have been reported so far

# Observations over time
Each row represents a game, so it is possible to track a team's evolution over the course of a season, or even over the years.

# Duplicate rows
No evidence of duplicate rows has been found in this dataset's tables so far

# Joins
The copa_brasil and brasileirao_serie_a tables can be joined using the time_mandante and time_visitante columns. In addition, these tables do not have many joins with other tables in the datalake. It is possible to use time-related information (year and date) in some cases.

# Data download
These tables are small, so it is possible to download the data directly from the platform


# Responsible institution
Transfermarkt.com

# Collection instrument
Transfermarkt obtains detailed information about football matches through a combination of sources:
* Data Team: A dedicated team of more than 50 football enthusiasts from various parts of the world conducts detailed research and constantly updates the information
* Community Contributions: Registered users can propose corrections and updates.
* Official Sources and Partners: The site also uses data from official sources, such as leagues, federations, and clubs, in addition to partners specialized in sports statistics.

# Changes in collection
The data collected has changed considerably over time. Between 2003 and 2006, the data recorded were basic, such as dates, stadiums, rounds, and scores. Information about referees, attendance, coaches, and game statistics was completely absent.
Starting in 2007, data recording began to expand, with the inclusion of referees and, gradually, coaches and team standings. Attendance data began to appear consistently in 2012, while financial and demographic statistics, such as team values and average ages, became more detailed between 2013 and 2016.
From 2017 onward, the dataset reached a high level of completeness, covering detailed statistics such as shots, corner kicks, saves, and offsides. However, in 2024, a slight decline was observed in some columns, such as maximum attendance and game statistics, although the dataset remains significantly more complete than in the early years. 

# Updates
The data are updated at the official source on an ongoing basis; since not all of the data collection is automated, there is no fixed schedule. At DB, we update the data for the latest round weekly

# Processing performed by DB:
DB performs a web scraping process on the Transfermarkt website. Our standard practice is not to make changes to the collected data. If you would like to review how our web scraping is done, the code is here: https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/mundo_transfermarkt_competicoes/utils.py#L371 . The complete pipeline code (including other steps beyond extraction, such as checking for updates, uploading the data to BigQuery, materialization via dbt, and running data quality tests) is here: https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/mundo_transfermarkt_competicoes/flows.py

# Supporting materials
* [Transfermarkt FAQ](https://www.transfermarkt.com/intern/faq) 
* [Transfermarkt data entry process](https://www.transfermarkt.us/intern/datenpflegeGuide)
