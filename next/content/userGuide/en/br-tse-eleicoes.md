---
title: Brazilian Elections Usage Guide
description: >-
  Usage guide for Brazilian Elections data. This material contains information on the most important variables, frequently asked questions, and usage examples for the dataset.
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

With more than 20 tables, this dataset can seem complex at first glance. To make it easier, we organized the information into thematic groups and detail the content of each table.

## Candidates
- **`candidato`**: Microdata table. Each row represents a candidacy in an election. The columns contain information about the candidate and their candidacy.
- **`bens_candidato`**: Microdata table. Each row represents an asset declared by a candidate in an election. If the candidate runs in more than one election, repeated items may appear. The columns describe the item and its value.
- **`despesas_candidato`**: Microdata table. Each row represents an expense receipt of a candidate in an election. The columns describe the expense details.
- **`receitas_candidato`**: Microdata table. Each row represents a campaign revenue item of a candidate in an election. The columns provide information about the revenue, such as donor data and tax details.
- **`resultados_candidato`, `resultados_candidato_municipio`, `resultados_candidato_municipio_zona`, `resultados_candidato_secao`**: Aggregated tables with a similar structure. Each row represents the result of a candidate in an election. The difference lies in the aggregation level: election total, by municipality, by zone, or by polling section. The columns show the total votes, position details, and whether the candidate was elected.

## Parties
- **`partidos`**: Microdata table. Each row represents a party within an electoral scope in an election. The columns indicate the party's status and any coalitions or federations formed for each position.
- **`receitas_comite` and `receitas_orgao_partidario`**: Microdata tables with a similar structure. Each row represents a campaign revenue item. The difference lies in the entity that received the revenue: committee or party body. The columns provide information about the revenue, such as donor data and tax details.
- **`resultados_partido_municipio`, `resultados_partido_municipio_zona`, `resultados_partido_secao`**: Aggregated tables with a similar structure. Each row represents the result of a party for a given position in an election. The difference lies in the aggregation level: by municipality, by zone, or by polling section. The columns show the total votes, separating nominal votes and party-list votes.

## General information about the elections
- **`vagas`**: Aggregated table. Each row represents a position in an electoral unit in an election. The columns indicate the total number of seats for that position.
- **`perfil_eleitorado_local_votacao`, `perfil_eleitorado_municipio_zona`, `perfil_eleitorado_secao`**: Aggregated tables with a similar structure. Each row represents a stratum of voters' sociodemographic profile (gender, age, marital status, education). The difference lies in the aggregation level: by municipality, by zone, or by polling section. The columns indicate the sociodemographic profile, biometric registration status, and the total number of voters.
- **`detalhes_votacao_municipio`, `detalhes_votacao_municipio_zona`, `detalhes_votacao_secao`**: Aggregated tables with a similar structure. Each row represents voting details in an election. The difference lies in the aggregation level: by municipality, by zone, or by polling section. The columns indicate the total number of abstentions and votes by type.
- **`local_secao`**: Microdata table. Each row represents a polling section in a given year. This is the only table not provided by the TSE; it was created by an external organization. The columns include estimates of the geographic location point of each polling section.

# Considerations for analysis
## Transfers between candidates in the revenue table
Candidates can transfer funds to one another, which causes the same revenue item to appear more than once.

## id_municipio column
Some records have the `id_municipio nulo` column, because the TSE registers municipalities abroad that do not have an IBGE code. In these cases, only the `id_municipio_tse` column is filled in.

## Candidate status
Candidacies can be rejected by the electoral courts. To filter only candidates who actually ran in an election, use the filter `situacao = 'deferida'`.

## Campaign finance reporting
The data are entered manually, which can generate inconsistencies, missing values, or duplicates, especially during campaign periods.

## Proportion of valid votes for the Senate
In years when the Senate election involves two seats, the proportion of valid votes in the `detalhes_votacao_municipio`, `detalhes_votacao_municipio_zona`, and `detalhes_votacao_secao` tables can exceed 100%.
This occurs because, in those years, each voter can vote for two different candidates, and the TSE counts each vote individually as a valid vote for the position. As a result, the same voter appears twice in the count, which raises the proportion of valid votes above 100%.

## Supplementary elections
There can be more than one elected mayor, governor, or president within the same term (for example, 2020–2024). This occurs when the electoral courts annul more than 50% of valid votes and call a supplementary election to elect a new representative. For analysis, use the `tipo_eleição` column to distinguish ordinary and supplementary elections within the same electoral cycle.

## ano column
The ano column indicates the year of the electoral cycle originally scheduled (e.g., 2020), even if the election actually took place later. For example, the `data_eleicao` column may show a date in 2022, while the `ano` column remains at 2020.

# Limitations
The TSE tables do not include information on elections for the conselho tutelar (municipal children and adolescent guardianship council).

# Inconsistencies
Beyond the expected pattern in years with two Senate seats, we identified a few dozen rows in the `detalhes_votacao_secao` table where the proportion of valid votes exceeds 100% with no known cause. This set of cases is very small relative to the total number of rows in the table, and to date we have not found an explanation for it. We recommend treating these records as residual and analyzing them with caution if they have a direct impact on your application.

# Observations over time

- To track candidates over the years, you can use the `titulo_eleitoral` column. This identifier tracks individuals consistently, overcoming the limitation of other associated IDs that change between elections. It identifies candidates in 99.5% of cases. However, it is worth noting that null values or two different identifiers for the same candidate can occur in some cases.

- To track parties, you need to account for name changes and mergers over time.

# Duplicate rows
Duplicate rows are removed during DB's processing.

# Cross-referencing
Pay attention to the columns that uniquely identify entities and tables:
- **Candidacies**: To cross-reference information from the same election, the `ano`, `tipo_eleicao`, and `sequencial_candidato` columns form a unique key for data from 2010 onward. For earlier periods, you can use the `titulo_eleitor`, `ano`, and `tipo_eleicao` columns. This combination is unique in 99.5% of cases, but it is not fully precise, since some candidacies have an empty `titulo_eleitor` column.
- **People:** The same person can have several candidacies registered over the years. To identify a person, we recommend using the `titulo_eleitor` column.
- **Zones**: To cross-reference information from the same year, the `ano`, `id_municipio_tse`, and `zona` columns form a unique key. Zones can change between years and have unique identifiers only within a municipality.
- **Polling sections**: To cross-reference information from the same year, the `ano`, `id_municipio_tse`, `zona`, and `seção` columns form a unique key. Polling sections can change between years and have unique identifiers only within a municipality and a zone.
- **Parties**: They are identified by the `sigla_partido` and `numero_partido` columns.

# Downloading the data
Some tables in this dataset are larger than 1GB, while others are smaller. To avoid overloading your computer, check the size of the tables you are interested in. If they are too large, we recommend using queries in BigQuery to process the data in the cloud before downloading it. Filter by the partition columns (such as year and state, UF) and select only the relevant columns.

# Collection instrument
## Sistema de Candidaturas (CAND)
System used to register candidacies, where parties and coalitions enter candidates' personal data, party affiliation information, criminal record certificates, and other required documentation.

## Sistema de Prestação de Contas Eleitorais (SPCE)
System used to register all campaign revenues and expenses. The SPCE ensures that information is reported in a standardized format and within the deadlines set by the electoral courts.

## Election results
After voting closes, each electronic voting machine generates a Boletim de Urna (polling machine report) with the results tallied at that polling section. The data from these reports are sent to the Regional Electoral Courts (TREs) and then to the TSE for the release of final results.

## Voter profile
During voter registration and registry updates, voters provide personal data such as name, date of birth, gender, education, and address. Electoral registry offices record this information in the Cadastro Nacional de Eleitores (National Voter Registry).

# Changes in collection
The electoral system has undergone several changes over the years, which affected the data collected. See the main changes below:
- **1997**: Addition of gender information;
- **1998**: Disclosure of candidates' CPF (individual taxpayer ID);
- **2014**: Addition of information on race or color;
- **2016**: Ban on donations from CNPJs (companies);
- **2022**: Collection of data on transgender identity;
- **2024**: Discontinuation of the disclosure of candidates' CPF.

# Updates
Most of the data is updated once per regular election (every two years). Revenue and expense data are updated daily during election campaigns.

# Processing done by DB:
In this guide, the processing steps are described in more accessible language. In addition, the [processing code](code-notebook) and the [modifications made in BigQuery](queries-dir) are available in the GitHub repository for reference.
The processing steps performed were:
- Removal of accents and conversion of text to lowercase.
- Removal of duplicate records considering the full set of columns.
- Invalid values, such as "-9999" or "#NULO", were converted to nulls.
- Adjustment of the columns that identify municipalities to the IBGE Municipality ID format (7 digits).
- Inconsistent dates in the `data_nascimento` column (ages below 18 or above 120 years) were replaced with null values.
- Standardization of the `tipo_eleicao` column, changing "eleições municipais" to "eleição ordinária".
- Standardization of the `nacionalidade` column, changing "brasileira nata" to "brasileira".

# Supporting materials
* [TSE open data website with files available for download](https://dadosabertos.tse.jus.br/dataset/)
* [Electoral Statistics Panel with a wide range of filters and simplified analyses](https://sig.tse.jus.br/ords/dwapr/seai/r/sig-eleicao/home?session=17112009236550)
* [Panel for looking up information on candidacies and campaign finance](https://divulgacandcontas.tse.jus.br/divulga/#/home)
* [Siga o Dinheiro (Follow the Money): Panel developed by DB to understand where campaign money comes from and where it is being spent](https://www.sigaodinheiro.org/)
* [DB's Electoral Data Analysis Course](https://info.basedosdados.org/bd-edu-eleicoes)
* [TSE news article about supplementary elections](https://www.tse.jus.br/comunicacao/noticias/2025/Fevereiro/voce-sabe-o-que-e-uma-eleicao-suplementar)

[code-pipeline]: https://github.com/basedosdados/pipelines/tree/main/pipelines/utils/crawler_tse_eleicoes
[code-notebook]: https://github.com/basedosdados/pipelines/blob/main/models/br_tse_eleicoes/code/%5Bdbt%5Dbr_tse_eleicoes.ipynb
[queries-dir]: https://github.com/basedosdados/pipelines/tree/main/models/br_tse_eleicoes
