---
title: Patch Notes - Enero/Febrero 🎲
description: Manténgase al día de las actualizaciones técnicas de BD
slug: patch-notes-enero-febrero
date:
  created: "2026-02-07T15:00:00"
authors:
thumbnail: /blog/patchnotes_dez/thumb_patchnotes.png
categories: [institucional]
medium_slug: >-
published: true
order: 0
---


¡Hola, *databaser*!

Empezamos el año con una serie de actualizaciones importantes para garantizar la calidad y la disponibilidad de los datos de BD. Conozca las novedades técnicas que implementamos en enero y febrero.

<Image src="/blog/patchnotes_janeiro/patchnotes_janeiro.png" />

## Conjuntos y tablas actualizados

### [Datos de población](https://basedelosdatos.org/dataset/d30222ad-7a5c-4778-a1ec-f0785371d1ca)

Los datos más recientes del IBGE sobre la población brasileña ya están en BD: datos a nivel de municipio con las estimaciones de población del instituto. Puede cruzarlos para crear comparaciones con muchos otros indicadores.

### [Emisiones de gases de efecto invernadero en Brasil](https://basedelosdatos.org/dataset/9a22474f-a763-4431-8e3d-667908a1c7ab)

Los datos de la versión más reciente del Sistema de Estimación de Emisiones y Remociones de Gases de Efecto Invernadero (SEEG) ya están en BD: datos a nivel de municipio con información sobre emisiones por sector emisor, actividad económica y mucho más, ahora hasta 2024.

### [Microdatos del SAEB](https://basedelosdatos.org/dataset/e083c9a2-1cee-4342-bedc-535cbad6f3cd)

La última actualización del Sistema de Evaluación de la Educación Básica (Saeb) ya está en BD, con datos tratados y listos para su análisis. Son los registros individuales y anonimizados de las evaluaciones que el INEP aplica a alumnos, docentes y directores de escuelas públicas y privadas de Brasil.

### [Datos de población del Ministerio de Salud](https://basedelosdatos.org/dataset/1e2b9a88-9dc7-4f0e-a3a5-e8d2a13869bf)

El Ministerio de Salud también publica estimaciones anuales de población para los municipios, desagregadas por sexo y grupos de edad. Ahora puede acceder también a los datos más recientes, de 2025, a través de BD.

### [Microdatos de la Evaluación de Alfabetización](https://basedelosdatos.org/dataset/073a39d4-89cf-4068-b1e8-34ed0d9c0b72)

El Inep definió un estándar nacional de alfabetización a partir de la encuesta Alfabetiza Brasil (2023). El indicador se calcula con los resultados de las evaluaciones realizadas por los sistemas estatales y municipales, en cooperación técnica con el Inep, y estandarizados en la escala del Saeb.

Son datos de 2023 y 2024 con resultados y metas de los estados y municipios, además de las tasas de alfabetización de la red pública por municipio y red.

### [Microdatos de educación de la Pnad-C](https://basedelosdatos.org/dataset/9fa532fb-5681-4903-b99d-01dc45fd527a?table=18fbf773-f43f-4876-8511-8b3b2f0d42a6)

Los datos de 2024 de la Encuesta Suplementaria Anual referidos a educación ya están listos para su análisis en BD. Recogidos trimestralmente por el IBGE, complementan el Censo Escolar con información sobre asistencia escolar, analfabetismo, escolaridad y acceso a la educación, incluso fuera del sistema formal.

## Corrección de metadatos y métrica de actualización

**¿Qué cambió en la práctica?**

Eliminamos los "falsos positivos" del panel de monitoreo, de modo que las alertas de tablas desactualizadas ahora reflejan la realidad.

**Detalles técnicos:**

*   **Antes:** la discrepancia entre el metadato de "frecuencia de actualización" y la fecha de la última carga en la base generaba alertas incorrectas para tablas que estaban en perfecto estado.
*   **Después:** los metadatos se ajustaron para corresponder al comportamiento real de las pipelines.
*   **Impacto técnico:** la fórmula de cálculo (frecuencia vs. última actualización) ahora opera sobre parámetros correctos, saneando la métrica de monitoreo.

**¿Por qué lo hicimos?**

Para restaurar la confianza en los dashboards de calidad de datos, con una observabilidad precisa del estado de actualización.

## Mantenimientos periódicos de pipelines

**¿Qué cambió en la práctica?**

Restablecimos pipelines que fallaron durante el receso de fin de año, con correcciones de modelado, ajustes de extracción (especialmente por el cambio de año) y resolución de errores en pruebas automatizadas.

**Detalles técnicos:**

*   **Antes:** los fallos de ejecución bloqueaban la actualización de varios conjuntos de datos por errores de prueba, problemas en la construcción de modelos y metadatos incorrectos.
*   **Después:**
    *   **Correcciones aplicadas (PRs #1355 y #1357):** ajustes en el modelado de profesionales (CNES), corrección en la extracción de microdatos de dengue (SINAN) y arreglo de los IDs de NCM (Comex Stat).
    *   **Investigación y ajustes:** resolución de errores de prueba (Estban, Cafir), actualización de metadatos (CVM) y análisis de duplicidad/string matching (Denatran).
    *   **Mapeo:** identificación de nuevas roturas para incluir en el backlog (Bolsa Família, BDMEP, etc.).
*   **Impacto técnico:** integridad de las pipelines recuperada y flujo de ingesta diaria normalizado.

**¿Por qué lo hicimos?**

Para priorizar y resolver las interrupciones de servicio acumuladas durante el cambio de año, garantizando la disponibilidad de los datos más consultados.

## Actualización y arreglo de las tablas de Indicadores Educativos

**¿Qué cambió en la práctica?**

Actualización y arreglo de datos, incluida la eliminación de datos duplicados en las tablas de indicadores educativos.

**Detalles técnicos:**

*   **Antes:** tablas de indicadores educativos con datos desactualizados y duplicados.
*   **Después:** datos actualizados y duplicidades eliminadas, garantizando la integridad de la información.

## Refactorización y estabilización de flows (nueva arquitectura)

**¿Qué cambió en la práctica?**

Migramos los flujos de datos a la nueva arquitectura con monitoreo asistido y corrección inmediata de fallos en la primera ejecución, aumentando la robustez del sistema.

**Detalles técnicos:**

*   **Antes:** flows adaptados preliminarmente o todavía en la arquitectura antigua, sujetos a errores de implementación.
*   **Después:** flows refactorizados, validados en producción y con correcciones de runtime aplicadas en el mismo PR.
*   **Impacto técnico:** cumplimiento del nuevo proceso de arquitectura y estabilidad en la ejecución de las pipelines.

**¿Por qué lo hicimos?**

Para reducir la incidencia de datos incorrectos en producción y asegurar la fiabilidad del datalake público.
