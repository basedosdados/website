---
title: Guía de uso del BDMEP
description: >-
  Guía de uso de los Datos Meteorológicos BDMEP. Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Introducción

> Esta guía contiene información detallada sobre los datos. Para dudas sobre el acceso o el uso de la plataforma, consulta nuestra [página de Preguntas Frecuentes](/faq).

Este conjunto tiene dos tablas de microdatos:  
- **Microdatos:** Cada fila representa una colección de mediciones de una estación en un horario. Las columnas contienen información sobre la precipitación, la presión, la radiación, la temperatura, la humedad y el viento.  
- **Estación:** Cada fila representa una estación meteorológica. Las columnas contienen información geográfica de esa estación.

# Consideraciones para los análisis

## Forma de cálculo
Antes de realizar operaciones con los datos del BDMEP, es crucial entender cómo fue calculada cada medida. Algunas columnas presentan valores promedio, mientras que otras contienen valores máximos o mínimos. La elección de la variable adecuada dependerá de las necesidades específicas del análisis.

## Filas vacías, fallas y datos inexistentes
Los datos del INMET-BDMEP tienen fallas, como filas vacías debido a problemas en los sensores y en la comunicación de las estaciones meteorológicas. Estas fallas pueden identificarse porque todas las columnas de valores están nulas. Es importante considerar estas fallas al realizar análisis.

## Conversión de horario
Toda la información de horario está en UTC. Para convertirla al horario oficial de Brasília, es necesario restar 3 horas. Por ejemplo, 12:00 UTC equivale a las 9:00 en horario de Brasília.

## Datos brutos y no validados
Los datos de las estaciones automáticas son brutos y no pasan por un proceso de validación de consistencia.

# Limitaciones
* La tabla de microdatos disponibilizada por BD incluye exclusivamente datos de estaciones automáticas.
* Las mediciones corresponden a un único punto en el espacio. La extrapolación de los datos a áreas mayores debe realizarse con ponderaciones.

# Inconsistencias
Aún no se han reportado inconsistencias en este conjunto de datos.

# Observaciones a lo largo del tiempo
Cada fila representa una compilación de medidas realizada por una estación meteorológica en un intervalo de una hora. Las columnas disponibilizadas son agregaciones de ese período, lo que permite seguir la evolución de las condiciones climáticas a lo largo del tiempo en las estaciones.

# Filas duplicadas
Aún no se han reportado filas duplicadas en las tablas de este conjunto.

# Cruces
La tabla de microdatos puede asociarse con la tabla de estaciones mediante la columna `id_estação`, lo que permite la geolocalización de los datos. Esto posibilita cruces externos con tablas georreferenciadas o que posean elementos de geolocalización, como la columna de código postal. Además, la tabla de estaciones ofrece la identificación del municipio, ampliando las posibilidades de cruces.

# Descarga de los datos
La tabla de microdatos tiene más de 10GB. Dependiendo de la capacidad de la computadora, el procesamiento de los datos puede sobrecargar la máquina. Por eso, recomendamos usar queries en BigQuery para procesar los datos en la nube antes de descargarlos. Filtra por la columna de partición (año) y selecciona solo las columnas relevantes.

# Instrumento de recolección
Los datos son recolectados por estaciones meteorológicas automáticas (EMA). La recolección de datos se realiza mediante sensores para la medición de los parámetros meteorológicos a observar. Las medidas se toman en intervalos de minuto a minuto y se integran en el período de una hora. Los datos recolectados por las EMA son enviados automáticamente a la sede del INMET en Brasília, cada hora.

# Cambios en la recolección
Estas tablas son consistentes desde el año 2000; no tenemos registro de cambios en la forma de recolección.

# Actualizaciones
La actualización de los datos en la fuente original es cada hora. En Base de los Datos actualizamos esta información mensualmente.

# Tratamientos realizados por BD:
En esta guía, los tratamientos se describen en un lenguaje más accesible. De manera complementaria, [los códigos de extracción y tratamiento](https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/br_inmet_bdmep/flows.py) y las [modificaciones realizadas en BigQuery](https://github.com/basedosdados/queries-basedosdados/blob/main/models/br_inmet_bdmep/br_inmet_bdmep__microdados.sql) están disponibles en el repositorio de GitHub para su consulta.
Los tratamientos realizados en la tabla de microdatos fueron:
* Renombramiento de las columnas para adecuarlas al manual de estilo de BD.
* Sustitución de códigos inválidos ("-9999") por valores nulos.
* Inclusión del identificador de la estación (id_estação) en la tabla de microdatos.
* Ajuste del formato de las columnas de fecha y hora para compatibilidad con BigQuery.

# Materiales de apoyo
* [Nota técnica sobre el funcionamiento de la red de estaciones meteorológicas del INMET](http://www.cemtec.ms.gov.br/wp-content/uploads/2019/02/Nota_Tecnica-Rede_estacoes_INMET.pdf) 
* [Nota del INMET - conoce cómo acceder a los datos meteorológicos](https://portal.inmet.gov.br/noticias/saiba-como-acessar-os-dados-meteorol%C3%B3gicos-dispon%C3%ADveis-no-site-do-inmet?utm_source=chatgpt.com)
