---
title: Cómo empezar un análisis geoespacial con datos de BD y QGIS
description: Aprenda a importar datos de BD en QGIS para crear mapas y visualizaciones
slug: analisis-geoespacial-con-qgis
date:
  created: "2022-10-07"
authors:
  - name: Gustavo Alcântara
    social: https://github.com/gustavoalcantara
    role: Autor
  - name: Giovane Caruso
    social: https://medium.com/@giovanecaruso
    role: Edición
thumbnail: /blog/como-fazer-uma-analise-geoespacial-com-qgis/image_0.png
categories: [tutorial]
medium_slug: https://medium.com/@basedosdados/como-come%C3%A7ar-uma-an%C3%A1lise-geoespacial-com-dados-da-bd-e-o-qgis-4792877950e0
published: true
---

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_0.png" caption="Mapa con la cantidad de cabezas de ganado por estado en Brasil"/>

## TL;DR

En este artículo mostramos cómo usar los datos del paquete geobr, ya tratados y disponibles en el *datalake* público de Base de los Datos, junto con un Sistema de Información Geográfica (SIG) para construir análisis geoespaciales con más facilidad. Siga el paso a paso con un ejemplo práctico: cuántas cabezas de ganado había en cada estado brasileño en 2017.

## ¿Qué son los datos de geobr?

`geobr` es un paquete de R que permite acceder fácilmente a los shapefiles del Instituto Brasileño de Geografía y Estadística (IBGE) y a otros datos espaciales de Brasil. Ya tratado y disponible en BD, este conjunto permite análisis con distintos niveles de observación: biomas, escuelas, microrregiones, polígonos de sector censal y mucho más.

Con datos de geobr elaboramos, por ejemplo, el análisis de los resultados geolocalizados de la prueba de matemáticas del SAEB de 2019 en Ceará.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_1.png" caption="Competencia media por escuela en Ceará"/>

Además de acceder a estos datos en Python, R y por BigQuery usando SQL, es posible exportarlos en `.csv` y cargarlos en su Sistema de Información Geográfica (SIG) preferido.

Un SIG es un conjunto de software y hardware que permite visualizar y analizar datos geográficos para comprender relaciones, patrones y tendencias. Existen muchos tipos. En este artículo usamos [QGIS](https://qgis.org/pt_BR/site/about/index.html) por ser una plataforma de código abierto, colaborativa y gratuita para el análisis de datos geoespaciales.

## Cómo construir su análisis con datos de geobr y QGIS

Para mostrar cómo empezar a construir su propio análisis, usamos los datos del [Censo Agropecuario](/dataset/55a39c28-58f3-4804-827d-6eee5ed27b6b?table=5366d485-e7db-4367-911a-a6a0198dda13), la principal investigación estadística y territorial sobre la producción agropecuaria del país, también tratados y estandarizados en BD.

El proceso es sencillo: para saber cuántas cabezas de ganado había en cada estado brasileño en 2017, ejecute la consulta siguiente en BigQuery y descargue el resultado en un archivo `.csv`.

```sql
SELECT censo.sigla_uf, sum(quantidade_bovinos_total) as gado, geometria
FROM basedosdados.br_ibge_censo_agropecuario.municipio AS censo
JOIN basedosdados.br_geobr_mapas.uf AS geo
ON censo.sigla_uf = geo.sigla_uf #join da variável sigla_uf
WHERE ano = 2017
GROUP BY censo.sigla_uf, geo.sigla_uf, geometria
```
A partir del resultado de la consulta puede descargar el `.csv` en su computadora.

Ahora vamos a cargar el archivo `.csv` con la geometría espacial en QGIS. Haga clic en `Añadir capa` y después en `Añadir capa de texto delimitado`.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_2.png" caption="Añadir capa y Añadir capa de texto delimitado en QGIS"/>

Con la ventana `Administrador de fuentes de datos` abierta, busque su archivo `.csv` donde lo haya guardado.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_3.png" caption="Administrador de fuentes de datos de QGIS"/>

Una vez cargado el `.csv`, la **Definición de la geometría** debe estar establecida como **Well Known Text** *(WKT)*. Después basta con indicar la variable de geometría en el `campo de geometría`.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_4.png" caption="Definición de la geometría"/>

La salida, o **Muestra de datos**, debe coincidir con el esquema de la imagen anterior. Puede verse que el campo de geometría define lo que representa cada fila. Como trabajamos con multipolígonos, la latitud y la longitud de cada multipolígono están en esa variable.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_5.png" caption="Muestra de datos"/>

Tras hacer clic en **añadir**, se obtiene un mapa con la cantidad de cabezas de ganado por estado en 2017, como en la imagen siguiente.

<Image src="/blog/como-fazer-uma-analise-geoespacial-com-qgis/image_6.png" caption="Mapa con la cantidad de cabezas de ganado por estado en Brasil. Fuente: IBGE, Censo Agropecuario, 2017."/>

Con el mapa a la vista resulta fácil identificar que Mato Grosso es el estado con mayor cantidad de cabezas de ganado de Brasil. Puede exportar el mapa en un archivo *.png* o *.tif* y continuar con su análisis.

Conviene recordar que también es posible relacionar más de una base de datos con los archivos de geometría espacial de geobr a través de BD. Puede seguir el mismo proceso para cualquier base con datos a nivel de municipio, regiones y establecimientos de salud, microrregiones, mesorregiones, escuelas y mucho más.

¿Tiene alguna duda sobre cómo usar los datos de geobr, o cualquier otro conjunto de BD? Tenemos un equipo preparado para ayudarle en nuestro canal de Discord. ¡Venga a formar parte!
