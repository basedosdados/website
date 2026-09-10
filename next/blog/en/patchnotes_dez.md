---
title: Patch Notes - December 🎲
description: Keep up with the technical updates at Data Basis this month
slug: patch-notes-december
date:
  created: "2025-12-07T15:00:00"
authors:
thumbnail: /blog/patchnotes_dez/thumb_patchnotes.png
categories: [institucional]
medium_slug: >-
published: true
order: 0
---


Hello, databaser!

We are reaching the end of the year with some interesting updates — including the debut of this new Patch Notes format, which we will publish periodically to stay transparent with our community and share technical news about our public datalake, data, services and more. Here we go.

<Image src="/blog/patchnotes_dez/patchnotes_dez.png" />

## Pipeline fixes

We fixed problems that were blocking the automatic update of **7 datasets**, covering **23 tables**. Some of the highlights:

*   **Inflation data ([IPCA](https://data-basis.org/dataset/ea4d07ca-e779-4d77-bcfa-b0fd5ebea828?table=f1fd2eb7-467a-403b-8f1c-2de8eff354e6), [INPC](https://data-basis.org/dataset/92945390-3b20-40e7-b71b-f6b58f3dc754), [IPCA-15](https://data-basis.org/dataset/a7d9442f-a591-477e-82a1-bcf780ccd0dc))**
    *   Datasets updated: `br_ibge_ipca`, `br_ibge_ipca_br_ibge_inpc` and `"br_ibge_ipca15`
    *   Tables updated:
        * Month Brazil;
        * Month Category Brazil;
        * Month Category Municipality;
        * Metropolitan Region.
    *   Changes:
        *   Filled in the last-checked, last-updated-at-source and last-updated-at-Data-Basis metadata for every table;
        * Enabled schedules;
        * Monitored the first pipeline run after the PR merged.

*   **[National Construction Registry](https://data-basis.org/dataset/062621e9-5aa0-4903-852d-619ae54393d2) (CNO)**
    *   Dataset: ``br_rf_cno``
    *   Changes:
        *   Tested different resource allocations on the pod running the flow in Kubernetes;
        * Monitored the first pipeline run after the PR merged.
*   **[Investment Funds](https://data-basis.org/dataset/9c5a820f-09dd-4519-adfd-611819163ae0) (CVM)**
    *   Dataset: ``br_cvm_fi``
    *   Changes:
        *   Debugged the problem preventing the Flow from registering;
        * Monitored the first pipeline run after the PR merged.


**Why this matters.**
When a pipeline runs into trouble, data can go stale. These fixes are part of our continuous work to keep the datalake as current as possible.


## RAIS update

Partial data from RAIS Establishments [2024](https://data-basis.org/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=86b69f96-0bfe-45da-833b-6edc9a0af213) is now live. That means access to the most recent establishment data on Brazil's formal labour market, covering employment relationships, pay, sectors and much more. If you had an analysis built on the previous RAIS, it is time to refresh the charts.

## Education Indicators data update

We updated INEP's [Education Indicators](https://data-basis.org/dataset/63f1218f-c446-4835-b746-f109a338e3a1?table=cd65b1d2-45e8-432b-afe8-c3a706addbe8) dataset, filling in the last-checked, last-updated-at-source and last-updated-at-Data-Basis metadata for every table.

Tables updated:

* Brazil (2024);
* State (2024);
* Region (2024);
* Brazil Transition Rate (2022);
* State Transition Rate (2022);
* Municipality Transition Rate (2022);
* Region Transition Rate (2022).


Education indicators are central to research, public policy and regional analysis. With the 2024 data now available, you can follow recent developments in Brazilian education at national, state and regional level, with clear metadata so you always know the provenance and the date of the last update.


## Refactored DBT logs

We refactored the execution logs of DBT (our data transformation tool) to be cleaner, more structured and more informative. We can now identify errors faster, without digging through several platforms or reproducing failures locally.

**Why this matters.**
For our engineering team it means less time debugging and more time building new pipelines. For you, databaser, it means more reliable pipelines and a consistently sound database.

- - - 

Want to keep up with our analyses, interviews, classes and tutorials too? Subscribe to [BDletter](https://info.basedosdados.org/newsletter) — it arrives free in your inbox.
