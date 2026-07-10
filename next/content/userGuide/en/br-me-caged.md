---
title: CAGED Usage Guide
description: >-
  Usage guide for the Cadastro Geral de Empregados e Desempregados (CAGED). This material contains information on the most important variables, frequently asked questions, and usage examples for the dataset.
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

This dataset has five microdata tables, split between two from the old CAGED and three from the new CAGED. The methodologies of the old and new models are not compatible, which affects time-series analyses.

- **Old Microdata:** Each row represents an admission or dismissal record up to December 2019. The columns describe the characteristics of the employee, the type of employment relationship, and the company.
- **Old Adjustment Microdata:** Complements the Old Microdata table with adjustments to monthly admissions and dismissals, including cancellations and late-filed movements.
- **Movement Microdata:** Each row represents an admission or dismissal record from January 2020 onward. The columns describe the characteristics of the employee, the type of employment relationship, and the company.
- **Excluded Movement Microdata:** Complements the Movement Microdata table with cancellations of admissions or dismissals. These cancellations affect the CAGED balance in the opposite direction of the original event.
- **Late-Filed Movement Microdata:** Complements the Movement Microdata table by recording events filed outside the regular period.

# Considerations for analysis

## Movement balance

Job growth or reduction within a group can be determined by summing the `saldo_movimentacao` column. Check this column to see whether a row represents an admission or a dismissal.

## Exclusions and late-filed movements

Beyond regular movements, it is important to consider the Excluded Movement Microdata and Late-Filed Movement Microdata tables to obtain a more accurate balance. Cancellations affect the balance in the opposite direction of the original event, while late-filed movements include events recorded after the regular period.

## Example of adjusting the balance with late-filed and excluded movements

As an example of how to carry out the adjustment procedure, the following query can be used:

```sql
with tabelas_unidas as (
select *, 0 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao`
union all
select * except (ano,mes), 0 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao_fora_prazo`
union all
select * except (ano,mes, ano_declaracao_movimentacao, mes_declaracao_movimentacao, indicador_exclusao), 1 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao_excluida`),

tabela_ajustada as (
select *,
case
  when saldo_movimentacao = 1 then 'admissão'
  when saldo_movimentacao = -1 then 'desligamento'
end as admissao_desligamento,
case
  when indicador_exclusao = 0 then saldo_movimentacao
  when indicador_exclusao = 1 then -saldo_movimentacao
end as saldo_movimentacao_ajustado
from tabelas_unidas)

select
ano,
mes,
sum(if(admissao_desligamento = 'admissão', saldo_movimentacao_ajustado, 0)) as qte_admissoes,
sum(if(admissao_desligamento = 'desligamento', saldo_movimentacao_ajustado, 0))as qte_desligamentos,
sum(saldo_movimentacao_ajustado) as saldo,
from tabela_ajustada
where sigla_uf='SP'
group by 1, 2
order by ano, mes
```

# Limitations

The data are limited to workers with a formal employment relationship, and do not include information on informal or self-employed workers.

# Inconsistencies

## `salario_mensal` column

Values outside the expected range have been identified, such as salaries in the range of millions of reais for sectors that generally do not pay such high amounts. This may be due to recording errors or outliers.

## Unidentified municipalities and federative units

In all tables, there are cases where the _uf_ column (sigla_uf, in DB) is filled with value 99 and the _municipio_ variable (id_municipio, in DB) is filled with value 99999.

## CAGED jobs panel

The [CAGED](https://app.powerbi.com/view?r=eyJrIjoiNWI5NWI0ODEtYmZiYy00Mjg3LTkzNWUtY2UyYjIwMDE1YWI2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9&pageName=ReportSectionb52b07ec3b5f3ac6c749) jobs panel is the validation reference for the adjustments that should be made using the microdados_movimentacao_fora_prazo and microdados_movimentacao_excluida tables.

# Observations over time

Each row represents a hiring or a dismissal. Because the data are de-identified, it is not possible to track individuals or companies over time. What is possible is to track the growth or decline of formally employed workers in a given sector (`cnae`), occupation (`cbo`), or other combinations of the available columns. It is also important to note that the CAGED methodology changed at the start of 2020, so time-series analyses should be conducted either up to 2019 or from 2020 onward, not across both periods.

# Duplicate rows

No duplicate rows have been found in this dataset.

# Crosswalks

The data are anonymized and contain no CNPJs or CPFs. This limits crosswalks with other datasets that have CNPJs, but columns such as `cnae` and `id_municipio` can be used to build useful crosswalks.

# Downloading the data

The microdata total more than 20 GB. To avoid overloading your computer, we recommend using queries in BigQuery to process the data in the cloud before downloading them. Filter by partition columns (such as year and state) and select only the relevant columns.

# Collection instrument

The New CAGED compiles formal employment data from systems such as eSocial, CAGED, and Empregador Web. The administrative records go through processing before being made available to the public.

# Changes in collection

In 2020, CAGED underwent a redesign, automating information collection and expanding coverage. However, this resulted in incompatibility with earlier historical series. For more information about these changes, see the [supporting materials](https://basedosdados.org/dataset/562b56a3-0b01-4735-a049-eeac5681f056?tab=userGuide#tratamentos-feitos-pela-bd).

# Updates

The microdata are updated with a one-month lag. The update schedule can be found on the [MTE website](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/calendario-de-divulgacao-do-novo-caged).

# Identified data

The data are anonymized and contain no CNPJs or CPFs. To obtain identified data, a request must be submitted to the MTE. The process can be lengthy and there is no guarantee of approval.

# Processing done by DB:

In this guide, the processing steps are described in more accessible language. In addition, the [extraction and processing code](https://github.com/basedosdados/queries-basedosdados-dev/blob/main/models/br_me_caged/code/crawler_caged.py) and the [modifications made in BigQuery](https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_caged) are available in the GitHub repository for reference.
The processing steps performed were:

- Renaming columns to conform to the style manual;
- Creating the `ano` and `mes` columns;
- Creating the ano_competencia_movimentacao and mes_competencia_movimentacao columns in the microdados_movimentacao_fora_prazo and microdados_movimentacao_excluida tables
- Creating the ano_declaracao_movimentacao and mes_declaracao_movimentacao columns in the microdados_movimentacao_excluida table
- Standardizing the federative unit columns to the UF abbreviation format;
- Removing the columns: `valorsalariofixo`, `unidadesalariocodigo`

# Supporting materials

- [G1 report on changes to CAGED](https://g1.globo.com/economia/noticia/2021/04/28/serie-historica-do-emprego-formal-nao-pode-ser-comparada-com-novo-caged-dizem-analistas.ghtml): G1 report gathering experts' considerations on the changes to CAGED
- [MTE note explaining the main changes in the New CAGED](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/o-que-e-o-novo-caged): MTE note explaining the main changes that occurred in the New CAGED
