---
title: Patch Notes - January/February 🎲
description: Keep up with the technical updates at Data Basis
slug: patch-notes-january-february
date:
  created: "2026-02-07T15:00:00"
authors:
thumbnail: /blog/patchnotes_dez/thumb_patchnotes.png
categories: [institucional]
medium_slug: >-
published: true
order: 0
---


Hello, *databaser*!

We start the year with a run of updates aimed at the quality and availability of Data Basis data. Here is what we shipped for you in January and February.

<Image src="/blog/patchnotes_janeiro/patchnotes_janeiro.png" />

## Datasets and tables updated

### [Population data](https://data-basis.org/dataset/d30222ad-7a5c-4778-a1ec-f0785371d1ca)

IBGE's most recent data on the Brazilian population is now at Data Basis: municipality-level data with the institute's population estimates. You can join it against many other indicators to build comparisons.

### [Greenhouse gas emissions in Brazil](https://data-basis.org/dataset/9a22474f-a763-4431-8e3d-667908a1c7ab)

The latest version of the Greenhouse Gas Emission and Removal Estimation System (SEEG) is now at Data Basis: municipality-level data covering emissions by emitting sector, economic activity and more, now running through 2024.

### [SAEB microdata](https://data-basis.org/dataset/e083c9a2-1cee-4342-bedc-535cbad6f3cd)

The latest update of the Basic Education Assessment System (Saeb) is at Data Basis, processed and ready for analysis. These are the individual, anonymised records of the assessments INEP applies to students, teachers and head teachers at public and private schools across Brazil.

### [Ministry of Health population data](https://data-basis.org/dataset/1e2b9a88-9dc7-4f0e-a3a5-e8d2a13869bf)

The Ministry of Health also publishes annual population estimates for municipalities, broken down by sex and age group. The most recent data, for 2025, is now available through Data Basis.

### [Literacy Assessment microdata](https://data-basis.org/dataset/073a39d4-89cf-4068-b1e8-34ed0d9c0b72)

Inep has defined a national literacy standard based on the Alfabetiza Brasil survey (2023). The indicator is calculated from the results of assessments run by state and municipal systems, in technical cooperation with Inep, and standardised on the Saeb scale.

The data covers 2023 and 2024, with results and targets for states and municipalities, along with public-network literacy rates by municipality and network.

### [Pnad-C education microdata](https://data-basis.org/dataset/9fa532fb-5681-4903-b99d-01dc45fd527a?table=18fbf773-f43f-4876-8511-8b3b2f0d42a6)

The 2024 education data from the Annual Supplementary Survey is ready for analysis at Data Basis. Collected quarterly by IBGE, it complements the School Census with information on school attendance, illiteracy, educational attainment and access to education, including outside the formal system.

## Metadata fixes and the update metric

**What changed in practice?**

We eliminated the false positives in the monitoring dashboard, so alerts about stale tables now reflect reality.

**Technical detail:**

*   **Before:** the discrepancy between the "update frequency" metadata and the date of the last load into the database generated incorrect alerts for tables that were in perfect order.
*   **After:** the metadata was adjusted to match the actual behaviour of the pipelines.
*   **Technical impact:** the calculation (frequency vs. last update) now runs on correct parameters, cleaning up the monitoring metric.

**Why we did it**

To restore trust in the data quality dashboards, with accurate observability of update status.

## Routine pipeline maintenance

**What changed in practice?**

We restored pipelines that failed over the end-of-year break, including modelling fixes, extraction adjustments (particularly around the year rollover) and the resolution of errors in automated tests.

**Technical detail:**

*   **Before:** execution failures were blocking updates to several datasets because of test errors, model build problems and incorrect metadata.
*   **After:**
    *   **Fixes applied (PRs #1355 and #1357):** adjustments to the professionals model (CNES), a fix to the extraction of dengue microdata (SINAN) and a fix to the NCM IDs (Comex Stat).
    *   **Investigation and adjustments:** resolution of test errors (Estban, Cafir), metadata updates (CVM) and duplicate/string-matching analysis (Denatran).
    *   **Mapping:** identification of new breakages for the backlog (Bolsa Família, BDMEP and others).
*   **Technical impact:** pipeline integrity restored and the daily ingestion flow back to normal.

**Why we did it**

To prioritise and resolve the service interruptions that accumulated over the year rollover, keeping the most-used data available.

## Updating and fixing the Education Indicators tables

**What changed in practice?**

Data updated and fixed, including the removal of duplicate rows in the education indicators tables.

**Technical detail:**

*   **Before:** education indicator tables with stale and duplicated data.
*   **After:** data updated and duplicates removed, restoring the integrity of the information.

## Refactoring and stabilising flows (new architecture)

**What changed in practice?**

We migrated the data flows to the new architecture with assisted monitoring and immediate correction of failures on the first run, making the system more robust.

**Technical detail:**

*   **Before:** flows adapted only preliminarily, or still on the old architecture, and prone to implementation errors.
*   **After:** flows refactored, validated in production, with runtime fixes applied in the same PR.
*   **Technical impact:** adherence to the new architecture process, and stability in pipeline execution.

**Why we did it**

To reduce the incidence of incorrect data in production and ensure the public datalake stays reliable.
