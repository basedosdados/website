---
title: "Directorios Brasileños: cómo esta base facilita su análisis"
description: >-
  Conozca esta base que funciona como un perfil completo de unidades como
  municipio, escuela, estado y más.
slug: como-usar-los-directorios-brasilenos
date:
  created: "2021-08-16"
authors:
  - name: Crislane Alves
    role: Equipo Base de los Datos
    social: https://medium.com/@s.alvescrislane
thumbnail: /blog/como-usar-os-diretorios-brasileiros/image_0.jpg
categories: [tutorial]
medium_slug: >-
  https://medium.com/@basedosdados/diret%C3%B3rios-brasileiros-como-essa-base-facilita-sua-an%C3%A1lise-40dc8ce2ca2
published: true
---

Conozca esta base que funciona como un perfil completo de unidades como municipio, escuela, estado y más.

<Image src="/blog/como-usar-os-diretorios-brasileiros/image_0.jpg"/>

## TL;DR

En este artículo presentamos nuestra base de [Directorios Brasileños](/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=0a2d8187-f936-437d-89db-b4eb3a7e1735), disponible en nuestro datalake público junto a muchas otras bases públicas ya tratadas, organizadas e integradas para el análisis. También mostramos cómo esta base facilita el cruce entre tablas de distintos conjuntos y cómo aplicarla en su análisis, con un ejemplo práctico.

## La base de Directorios Brasileños

Esta base centraliza la información de las unidades básicas usadas en el análisis y funciona como un perfil completo de entidades como municipio, escuela, estado, sectores censales y más. Sus tablas enlazan códigos institucionales e información de distintas entidades brasileñas.

Esto importa porque no existe un identificador único de municipios compartido entre las instituciones brasileñas. La base también resuelve los cambios de IDs y los nombres con erratas entre años e instituciones, además de los nuevos IDs de municipios que se crean con el tiempo.

Para municipios, por ejemplo, enlaza registros de organizaciones como el IBGE, la Receita Federal, el Tribunal Superior Electoral (TSE), el Banco Central de Brasil, comarcas, regiones de salud y otras.

Cada tabla de esta base representa una entidad de nuestro datalake público, como `UF`, `municipio`, `escola`, `distrito`, `setor_censitario`, las categorías `CID-10` y `CID-9`, `CBO-2002` y `CBO-1992`, entre otras.

Los directorios crean de forma natural relaciones entre esas entidades. La tabla de municipios tiene una columna `sigla_uf`, por ejemplo, que indica a qué estado pertenece el municipio. Lo mismo vale para `escola`, donde se puede identificar en qué municipio está ubicada una escuela.

Para ejemplificar cómo los Directorios Brasileños facilitan el cruce de distintos conjuntos, preparamos dos ejemplos de aplicación que muestran cómo usar esta herramienta en sus análisis, cada uno con una sola consulta SQL en BigQuery.

## Ejemplos de aplicación

### Indicadores de movilidad y transporte

En el primer ejemplo cruzamos la tabla `municipio` de los Directorios Brasileños con la tabla `tempo_deslocamento_casa_trabalho` de la base de [Indicadores de Movilidad y Transporte](/dataset/e3edf621-c491-4d74-a03a-15a759f6e638?table=01114371-3b1b-4574-a3ea-3d7d2125b4f2) de [Mobilidados](https://mobilidados.org.br/), que contiene datos sobre el tiempo medio de desplazamiento casa-trabajo y el porcentaje de personas que dedican más de una hora a ese trayecto en 2010.

Usamos como clave la columna `id_municipio`. El objetivo es añadir las columnas `regiao` y `municipio` al nuevo conjunto, de modo que además del nombre de los municipios se pueda agrupar por ciudad, gran región o estado y ver cuáles tienen un tiempo medio de desplazamiento mayor o menor.

Vea a continuación la consulta utilizada:

```sql
SELECT
  t1.ano,
  t2.nome_uf AS estado,
  t2.nome AS municipio,
  t1.tempo_medio_deslocamento
FROM
  `basedosdados.br_mobilidados_indicadores.tempo_deslocamento_casa_trabalho` AS t1
JOIN
  `basedosdados.br_bd_diretorios_brasil.municipio` AS t2
ON
  t1.id_municipio = t2.id_municipio
```
### Datos de importaciones y exportaciones brasileñas

En el segundo ejemplo usamos la tabla `pais` de los Directorios con la tabla `municipio_importacao` de la base [Comex Stat](/dataset/74827951-3f2c-4f9f-b3d0-56e3aa7aeb39?table=f4b08023-5530-4dc9-bced-3321e8928fd7), que contiene datos detallados de las exportaciones e importaciones brasileñas extraídos de [SISCOMEX](http://www.siscomex.gov.br/). Esa tabla en concreto aborda datos de importación detallados por municipio y empresa importadora.

Aquí la clave es la columna `id_pais`, usada para extraer de los Directorios el **nombre** del país. Al ejecutar la consulta obtendremos, además del **ID del país** y el **valor de la importación**, el **nombre del país**, es decir, el origen de las importaciones de Brasil en 2020.

Puede usar la consulta siguiente para ver el origen de las importaciones de Brasil en 2020:

```sql
SELECT
  t1.ano,
  t1.sigla_uf,
  t2.nome AS pais,
  SUM(valor_fob_dolar) AS importacao
FROM
  `basedosdados.br_me_comex_stat.municipio_importacao` AS t1
JOIN
  `basedosdados.br_bd_diretorios_brasil.pais` AS t2
ON
  t1.id_pais = t2.id_pais
WHERE
  ano = 2020
GROUP BY
  1,
  2,
  3
ORDER BY
  3 DESC
```
Acceda a la base de Directorios Brasileños [aquí](/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=0a2d8187-f936-437d-89db-b4eb3a7e1735).

Conviene recordar que el cruce entre bases no es posible solo porque los Directorios funcionen como una especie de diccionario. Detrás está el **estándar de calidad de Base de los Datos**: compatibilizamos todos los datos para que puedan cruzarse entre tablas. La limpieza de las bases disponibles en nuestro datalake público implica un riguroso proceso de estandarización y compatibilización.
