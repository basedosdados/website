---
title: Patch Notes - Diciembre 🎲
description: Manténgase al día de las actualizaciones técnicas de BD este mes
slug: patch-notes-diciembre
date:
  created: "2025-12-07T15:00:00"
authors:
thumbnail: /blog/patchnotes_dez/thumb_patchnotes.png
categories: [institucional]
medium_slug: >-
published: true
order: 0
---


¡Hola, databaser!

Llegamos al final del año con algunas actualizaciones interesantes, incluido el estreno de este nuevo formato de Patch Notes, que publicaremos periódicamente para mantener la transparencia con nuestra comunidad e informar sobre novedades técnicas en nuestro datalake público, los datos, los servicios y más. ¡Vamos allá!

<Image src="/blog/patchnotes_dez/patchnotes_dez.png" />

## Correcciones en pipelines

Corregimos problemas que impedían la actualización automática de **7 conjuntos de datos**, con un total de **23 tablas**. Algunos de los destacados:

*   **Datos de inflación ([IPCA](https://basedelosdatos.org/dataset/ea4d07ca-e779-4d77-bcfa-b0fd5ebea828?table=f1fd2eb7-467a-403b-8f1c-2de8eff354e6), [INPC](https://basedelosdatos.org/dataset/92945390-3b20-40e7-b71b-f6b58f3dc754), [IPCA-15](https://basedelosdatos.org/dataset/a7d9442f-a591-477e-82a1-bcf780ccd0dc))**
    *   Conjuntos de datos actualizados: `br_ibge_ipca`, `br_ibge_ipca_br_ibge_inpc` y `"br_ibge_ipca15`
    *   Tablas actualizadas:
        * Mes Brasil;
        * Mes Categoría Brasil;
        * Mes Categoría Municipio;
        * Región Metropolitana.
    *   Actualizaciones:
        *   Relleno de los metadatos de última verificación, última actualización en la fuente y última actualización en BD para todas las tablas;
        * Activación de schedules;
        * Seguimiento de la primera ejecución de la pipeline tras el cierre del PR.

*   **[Catastro Nacional de Obras](https://basedelosdatos.org/dataset/062621e9-5aa0-4903-852d-619ae54393d2) (CNO)**
    *   Conjunto de datos: ``br_rf_cno``
    *   Actualizaciones:
        *   Probamos distintas asignaciones de recursos en el pod que ejecuta el flow en Kubernetes;
        * Seguimiento de la primera ejecución de la pipeline tras el cierre del PR.
*   **[Fondos de Inversión](https://basedelosdatos.org/dataset/9c5a820f-09dd-4519-adfd-611819163ae0) (CVM)**
    *   Conjunto de datos: ``br_cvm_fi``
    *   Actualizaciones:
        *   Depuración del problema que impide el registro del Flow;
        * Seguimiento de la primera ejecución de la pipeline tras el cierre del PR.


**¿Por qué importa?**
Cuando una pipeline encuentra problemas, los datos pueden quedar desactualizados. Estas correcciones forman parte de nuestro trabajo continuo para mantener el datalake lo más actualizado posible.


## Actualización de la RAIS

Los datos parciales de la RAIS Establecimientos [2024](https://basedelosdatos.org/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=86b69f96-0bfe-45da-833b-6edc9a0af213) ya están disponibles. Eso significa acceso a los datos de establecimientos más recientes del mercado de trabajo formal en Brasil, con información sobre vínculos laborales, remuneraciones, sectores y mucho más. Si ya tenía un análisis con la RAIS anterior, es hora de actualizar los gráficos.

## Actualización de los datos de Indicadores Educativos

Actualizamos el conjunto de [Indicadores Educativos](https://basedelosdatos.org/dataset/63f1218f-c446-4835-b746-f109a338e3a1?table=cd65b1d2-45e8-432b-afe8-c3a706addbe8) del INEP con el relleno de los metadatos de última verificación, última actualización en la fuente y última actualización en BD para todas las tablas.

Tablas actualizadas:

* Brasil (2024);
* Estado (2024);
* Región (2024);
* Brasil Tasa de Transición (2022);
* Estado Tasa de Transición (2022);
* Municipio Tasa de Transición (2022);
* Región Tasa de Transición (2022).


Los indicadores educativos son esenciales para la investigación, las políticas públicas y el análisis regional. Con los datos de 2024 ya disponibles, puede seguir la evolución reciente de la educación brasileña a nivel nacional, estatal y regional, y con metadatos claros para saber siempre la procedencia y la fecha de la última actualización.


## Refactorización de los logs de DBT

Refactorizamos los logs de ejecución de DBT (nuestra herramienta de transformación de datos) para que sean más limpios, estructurados e informativos. Ahora podemos identificar errores más rápido, sin tener que rastrear varias plataformas ni reproducir fallos localmente.

**¿Por qué importa?**
Para nuestro equipo de ingeniería significa menos tiempo depurando y más tiempo para desarrollar nuevas pipelines. Para usted, databaser, significa pipelines aún más fiables y una base de datos siempre consistente.

- - - 

¿Quiere estar al día también de nuestros análisis, entrevistas, clases y tutoriales? Suscríbase a la [BDletter](https://info.basedosdados.org/newsletter), llega gratis a su bandeja de entrada.
