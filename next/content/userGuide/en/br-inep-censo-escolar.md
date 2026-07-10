---
title: Usage guide for School Census data
description: >-
  Usage guide for Football Championships data. This material contains information on the most important variables, frequently asked questions, and usage examples for the dataset.
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
- **Schools:** The only table made available by INEP starting in 2021, each row represents a school. The columns include school characteristics, such as available physical infrastructure, the pedagogical staff, pedagogical infrastructure, features of the school year, and aggregated information on enrollments, teachers, and classes.
- **Classes:** Table made available through requests filed under the LAI (Access to Information Law). Each row represents a class active during the school year, and the columns contain information on the subjects taught to the class, the start time of classes, the number of students in the class, and the level of education.
- **Enrollments:** Kept for historical reference, but not updated since 2021. Each row represents an enrollment, and the columns include sociodemographic variables, activities the student engages in, and the mode of transportation used to reach school.
- **Teachers:** Kept for historical reference, but not updated since 2021. Each row represents the assignment of a teacher to a class at a school during a given year, and the columns hold sociodemographic characteristics, information on education and training, and details of the teacher's activity at the school.

# Considerations for analysis
## Variable selection
We do not make all the variables that appear in the Census available. We selected variables that appeared 8 or more times between 2009 and 2020, in addition to other variables we judged to be crucial because they are important identifiers. This means that, if a variable appears in only 2 years in the original source, for example, it was not included in our tables.

## Race and color information
Race and color information in the School Census is filled in by the school, but many records are left blank. This can cause distortions in analyses on this topic using this dataset.

We know this because the SAEB exam also collects students' race, but in a different way: the students themselves report it. School Census and SAEB data end up being quite different because of these different methodologies.

# Limitations
* Data are available from 2009 onward, since that is when the survey adopted a more uniform format. This makes comparison across years easier and ensures greater compatibility.

# Inconsistencies
No inconsistencies have been reported in this dataset yet.

# Observations over time
Students and teachers have anonymized information, so it is not possible to track these entities across years in the enrollment and teacher tables. Schools, on the other hand, are identifiable and can be tracked over the years.
It is also worth noting that the enrollment and teacher tables stopped being made available in 2020.

# Duplicate rows
No evidence of duplicate rows has been found in the tables of this dataset yet.

# Cross-referencing
Within the dataset itself, the tables can be cross-referenced using the keys id_escola, id_turma, and ano. 
In addition, these tables can be complemented with information from other INEP datasets:  
1. **INEP School Indicators**: The INEP School Indicators bring a series of measurements on the quality of education at different levels of aggregation, enabling more detailed analyses of the educational context in schools, municipalities, and states.  
2. **Basic Education Statistical Synopses**: The Basic Education Statistical Synopses present School Census information in an aggregated and simplified way, facilitating quick analyses and comparisons across different levels of education and regions.  
3. **Basic Education Development Index (Ideb)**: The br_inep_ideb dataset provides tables that identify student scores on education-quality assessments, such as the SAEB exams, in addition to information on performance rates, such as pass, fail, and dropout rates, and school performance on the IDEB. Together with the Census tables, one can assess, for example, how schools with more teachers holding a master's degree perform on these exams relative to schools with teachers who do not hold a graduate degree.

# Downloading the data
These tables are too large to download directly; it is very important to select specific columns and apply temporal or geographic filters before downloading the data.

The microdata add up to more than 300 GB. To avoid overloading your computer, we recommend using queries in BigQuery to process the data in the cloud before downloading it. Filter by the partition columns (such as ano and UF) and select only the relevant columns.

# Collection instrument
School Census data are collected in two stages. In the first half of the year, schools fill out five forms (schools, administrators, classes, students, and classroom staff) with information on all basic and vocational education institutions. At the end of the school year, the second stage records students' status, indicating whether they were promoted, held back, transferred, stopped attending, or died.

# Changes in collection
The main change over the years was the replacement of the enrollment, teacher, and school administrator tables with a single school table containing aggregated data. Starting in 2021, this new table included 123 new variables, providing access to some information on enrollments, teachers, and school administrators in summarized form.

# Updates
Data are updated annually, early in the year following data collection.

# Processing done by DB:


# Supporting materials
[INEP website on the School Census](https://www.gov.br/inep/pt-br/areas-de-atuacao/pesquisas-estatisticas-e-indicadores/censo-escolar): Documents and instructions about the School Census, useful for better understanding the context and obtaining complementary materials such as the forms that are filled out, release and collection dates, among other information. 
[DB note on the change in the release of School Census data](https://basedosdados.org/blog/nota-sobre-divulgacao-dos-dados-do-inep): Note laying out DB's position on the change that occurred in 2021
