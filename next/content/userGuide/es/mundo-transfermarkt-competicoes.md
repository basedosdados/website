---
title: Guía de uso de datos de Campeonatos de Fútbol
description: >-
  Guía de uso de datos de Campeonatos de Fútbol. Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto.
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Introducción

> Esta guía contiene información detallada sobre los datos. Para dudas sobre el acceso o uso de la plataforma, consulte nuestra [página de Preguntas Frecuentes](/faq).

Este conjunto cuenta con dos tablas de microdatos:  
- **Brasileirão Série A:** Cada fila representa un partido. Las columnas incluyen información sobre las características del partido, los resultados y las estadísticas del juego 
- **Copa do Brasil:** Cada fila representa un partido. Las columnas incluyen información sobre las características del partido, los resultados y las estadísticas del juego 

# Consideraciones para los análisis
## Fuentes y compilación de los datos
Las tablas presentan información compilada por Transfermarkt. Para entender cómo se elaboraron y estructuraron estas estadísticas, es necesario revisar los métodos de compilación.

# Limitaciones
* Las tablas contienen la información disponible en el sitio de Transfermarkt que nuestro equipo seleccionó para incluir. Si considera que alguna información que sería muy útil para su análisis no está disponible en esta base, pero sí está disponible en el sitio de Transfermarkt, ¡por favor contáctenos para que lo sepamos! 

# Inconsistencias
Aún no se han reportado inconsistencias

# Observaciones a lo largo del tiempo
Cada fila representa un partido, por lo que es posible seguir la evolución de un equipo a lo largo de una temporada, o incluso a lo largo de los años.

# Filas duplicadas
Aún no se han encontrado indicios de filas duplicadas en las tablas de este conjunto

# Cruces
Las tablas copa_brasil y brasileirao_serie_a pueden cruzarse a través de las columnas time_mandante y time_visitante. Además, estas tablas no tienen muchos cruces con otras tablas del datalake. Es posible utilizar la información temporal (año y fecha) para algunos casos.

# Descarga de los datos
Estas tablas son pequeñas, por lo que es posible descargar los datos directamente desde la plataforma


# Institución responsable
Transfermarkt.com

# Instrumento de recolección
Transfermarkt obtiene información detallada sobre los partidos de fútbol mediante una combinación de fuentes:
* Equipo de Datos: Un equipo dedicado de más de 50 entusiastas del fútbol de diversas partes del mundo realiza investigaciones detalladas y actualiza constantemente la información
* Contribuciones de la Comunidad: Los usuarios registrados pueden proponer correcciones y actualizaciones.
* Fuentes Oficiales y Socios: El sitio también utiliza datos de fuentes oficiales, como ligas, federaciones y clubes, además de socios especializados en estadísticas deportivas.

# Cambios en la recolección
Los datos recolectados cambiaron bastante a lo largo del tiempo. Entre 2003 y 2006, los datos registrados eran básicos, como fechas, estadios, jornadas y resultados. La información sobre árbitros, público, técnicos y estadísticas del juego estaba completamente ausente.
A partir de 2007, el registro de datos comenzó a expandirse, con la inclusión de los árbitros y, gradualmente, de los técnicos y las posiciones de los equipos. Los datos de público comenzaron a aparecer de manera consistente en 2012, mientras que las estadísticas financieras y demográficas, como los valores de los equipos y las edades promedio, pasaron a ser más detalladas entre 2013 y 2016.
A partir de 2017, la base alcanzó un alto nivel de completitud, cubriendo estadísticas detalladas, como tiros, tiros de esquina, atajadas y fueras de juego. Sin embargo, en 2024 se observó una leve disminución en algunas columnas, como público máximo y estadísticas del juego, aunque la base sigue siendo significativamente más completa que en los primeros años. 

# Actualizaciones
Los datos se actualizan en la fuente oficial de manera constante; como no todos los datos están automatizados, no existe un patrón fijo. En BD actualizamos los datos de la última jornada semanalmente

# Tratamientos realizados por BD:
BD realiza un proceso de web scraping en el sitio de Transfermarkt. Nuestro estándar es no realizar modificaciones en los datos recolectados. Si desea evaluar cómo se realiza nuestro web scraping, el código está aquí: https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/mundo_transfermarkt_competicoes/utils.py#L371 . El código completo del pipeline (con otras etapas además de la extracción, como la verificación de actualizaciones, la carga de los datos en BigQuery, la materialización vía dbt y la ejecución de pruebas de calidad de los datos) está aquí: https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/mundo_transfermarkt_competicoes/flows.py

# Materiales de apoyo
* [FAQ de Transfermarkt](https://www.transfermarkt.com/intern/faq) 
* [Proceso de ingreso de datos de Transfermarkt](https://www.transfermarkt.us/intern/datenpflegeGuide)
