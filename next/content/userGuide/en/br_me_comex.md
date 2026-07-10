---
title: Comex Stat Usage Guide
description: >-
  Usage guide for the Foreign Trade Statistics in Open Data (Comex Stat). This material contains information on the most important variables, frequently asked questions, and usage examples for the Comex Stat dataset
date:
  created: "2025-10-25T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Thais Filipi
    role: Text
---

# Introduction

> This guide contains detailed information about the data. For questions about accessing or using the platform, see our [Frequently Asked Questions page](/faq).

This dataset has four microdata tables:
- **Municipality Export:** Each row represents the aggregation of export records by year, month, product category (SH4), destination country, state, and municipality of the exporting company.
- **Municipality Import:** Each row represents the aggregation of import records by year, month, product category (SH4), country of origin of the imported good, state, and municipality of the importing company.
- **NCM Export:** Each row represents the aggregation of export records by year, month, mode of transport, customs office, country, product category (NCM), and the state in which the exported good was produced.
- **NCM Import:** Each row represents the aggregation of import records by year, month, mode of transport, customs office, country, product category (NCM), and the destination state of the import.

# Considerations for analysis
## Product categories
- The Harmonized System (HS) is an international system for classifying and coding goods, usually with 6-digit codes. It has several levels of detail. The first two digits refer to the chapter, the next two to the heading, and the last two to the subheading of the good. In the ```municipio_exportacao``` and ```municipio_importacao``` tables, the classification column is SH4, meaning we only have the heading-level aggregation of the good. This code is translated through [DB's World Directories](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=2399179d-0e74-4f1b-a940-7e418cafa02f), which has 6 digits.
-  The Mercosur Common Nomenclature (NCM) is an extension of the HS. Of the eight digits that make up the NCM, the first six come from the Harmonized System, while the last two correspond to specific sections within MERCOSUR. Translate via [World Directories](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=3027c0d8-d17b-443f-a295-1de6ff65d5cc).
- Each product is associated with a unit of measurement (```id_unidade```) that defines how the values should be interpreted (for example, net kilogram, unit, or net metric ton). The ```id_unidade``` column in the ```ncm_exportação``` and ```ncm_importacao``` tables can be translated via [World Directories](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=3027c0d8-d17b-443f-a295-1de6ff65d5cc).

## ```id_municipio``` and ```sigla_uf``` data
- In ```municipio_exportacao``` and ```municipio_importacao```, the municipality column refers to the registered tax address of the company responsible for the export or import — not the place where the exported good was produced or the destination of the import. The ```sigla_uf``` in these tables corresponds to the value of ```id_municipio```.
- In ```ncm_exportacao``` and ```ncm_importacao```, the state column refers to the place of production of the good (export) or the destination of the import, regardless of the location of the headquarters of the company that carried out the export or import.

# Correcting null state and municipality values
Null values of ```id_municipio``` and ```sigla_uf``` are correctly fixed and filled in only after the annual data correction by the responsible secretariat.

## ```id_pais``` data in the import tables
Imports consider the origin of the good, not the country of the company that made the sale. In most cases, the home country of the company selling the good is the same country where the good is manufactured. However, there are cases where this does not happen.

## FOB value
```valor_fob_dolar``` refers only to the value of the good. Freight and import insurance costs are detailed in ```valor_frete``` and ```valor_seguro```.

## URFs and route
The Federal Revenue Customs Clearance Units (URFs) should not be confused with a specific route, such as ports, since some ports have more than one customs facility.

# Limitations
Records are not identified by the companies or individuals involved in exporting or importing goods, which limits the possible analyses (such as by CNAE or company size, for example).

# Inconsistencies
Discrepancies appear when comparing data between countries. In Brazil's bilateral trade, it is common to find discrepancies between the figures published by each partner.

# Observations over time
Trade balance trends can be tracked at the different observation levels of the tables, both month by month and by year. Aggregating the consolidated monthly data yields the annual foreign trade results.

# Duplicate rows
No information at this time.

# Cross-referencing
The data are anonymized and do not contain CNPJ or CPF information for import and export agents. This limits cross-referencing with other datasets, but the ```id_pais```, ```sigla_uf```, and ```id_municipio``` columns can be used.

# Downloading the data
The total tables amount to about 9 GB, so it is recommended to follow good data processing practices as much as possible. To avoid overloading your computer, we recommend using BigQuery queries to process the data in the cloud before downloading it. Filter by the partition columns (such as ```ano```, ```mes```, ```sigla_uf```, and ```sigla_pais_iso3```) and select only the relevant columns.

# Collection instrument
Foreign trade statistics are produced from administrative record data, submitted via declaration by the parties involved in export and import operations – companies, customs brokers, financial institutions, carriers, freight forwarders, individuals, etc. – in the official [Siscomex](https://www.gov.br/siscomex/pt-br) and [Single Siscomex Portal](https://portalunico.siscomex.gov.br/portal/) systems, which manage Brazilian foreign trade.

# Changes in data collection
- **Changes to the collection system in 2018**
	- Starting in 2018, the export data entry tool changed from NOVOEX to the Single Portal. In the new system, cases of early shipment without an invoice may go unrecorded for state ("Undeclared State"). Only after the invoice is issued can the state information be corrected, which causes null values for this field to be overrepresented in the most recent months. See the Comex Usage Manual for more details.
- **Methodology change regarding the reference date of imported and exported goods in 2018** 
	- Starting in 2018, the reference date for export data became the date on which the cargo is considered fully exported (CCE Date) – from 1997 to 2017 it was the Customs Clearance date.

# Updates
Comex data is updated in the first business days of each month. Although the responsible secretariat publishes weekly bulletins, these should be disregarded once the consolidated monthly version is published. Data Basis has a scheduled pipeline that fetches and updates the data daily. If you notice the data is out of date, contact our team.

# Identified data
The data are anonymized and do not contain CNPJ or CPF information. The administrative and customs records that feed Comex Stat serve evidentiary, oversight, and legal validity purposes, under the responsibility of the competent agencies.

# Processing done by DB
In this guide, the processing steps are described in more accessible language. In addition, the [processing code](https://github.com/basedosdados/pipelines/tree/main/pipelines/datasets/br_me_comex_stat) and the [modifications made in BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_comex_stat) are available in the GitHub repository for reference.
The processing steps performed were: 
* Correction of specific municipal codes in states with historical inconsistencies (SP, MS, GO, and DF), ensuring alignment with the IBGE standard (7 digits);
* Standardization of column names according to [DB's Style Manual](https://basedosdados.org/docs/style_data);
* Conversion of the ```mes``` column to integer type (int64)
* Replacement of invalid codes (such as "ND" or "9300000") with null values in the ```sigla_uf``` and ```id_municipio``` columns;
* Standardization of codes in specific columns:
	* ```id_ncm``` (8 digits, string format);
	- ```id_sh4``` (4 digits, string format);
	- ```id_pais``` converted to the ISO3 code (```sigla_pais_iso3```) in the tables where this applies

# Supporting materials
- [Manual for using Brazilian foreign trade statistical data](https://balanca.economia.gov.br/balanca/manual/Manual.pdf).
- [Manuals and Methodological Notes](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/manuais-e-notas-metodologicas) on the website of the Ministry of Development, Industry, Trade, and Services.
- [Totals for validation](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/base-de-dados-bruta) of the data in Foreign Trade Statistics in Open Data
- Analyses done by DB with Comex Stat ([soybeans](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_comex_stat_municipio_exportacao_20230626.ipynb) and [coffee](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_me_comex_stat_20251006.sql)).


