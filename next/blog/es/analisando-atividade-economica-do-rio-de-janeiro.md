---
title: La actividad económica del estado de Río de Janeiro y la influencia de su capital
description: Exploramos los datos de la RAIS para analizar las principales actividades económicas del estado y su relación con la capital
slug: actividad-economica-en-rio-de-janeiro
date:
  created: "2024-04-10T15:00:00"
authors:
  - name: Laryssa Bertin Ribeiro
    role: Autora
    social: https://medium.com/@lary.bertin
thumbnail: /blog/analisando-atividade-economica-do-rio-de-janeiro/image_4.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/an%C3%A1lise-da-atividade-econ%C3%B4mica-do-estado-do-rio-de-janeiro-e-da-influ%C3%AAncia-da-capital-95ed6b5910b5
published: true
---

## TL;DR

Este informe investiga las principales actividades económicas del estado de Río de Janeiro, centrándose en su relación con la capital.

También examina la dinámica de generación de empleo activo a lo largo de un período determinado. A partir de los datos de la [Relación Anual de Informaciones Sociales](/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=c3a5121e-f00d-41ff-b46f-bd26be8d4af3) (RAIS), aplica análisis estadístico para comprender cómo evolucionaron esos patrones y qué implican para los demás municipios del estado.

> Este artículo fue producido como Proyecto Final del Curso de Análisis de Datos Públicos con SQL y Sheets, de Base de los Datos. Para saber más sobre el curso, acceda [aquí](https://info.basedosdados.org/bd-edu-cursos)

## Introducción

Según la [Encuesta Mensual de Empleo](https://www.data.rio/documents/4e6901873b314e2bacce25f8645046bd/explore) (PME) del IBGE, en 2016 la agrupación _Educación, Salud y Administración Pública_ ocupaba el 23,3% de los empleos en la ciudad de Río de Janeiro (680 mil); _Otros Servicios_ el 19,9% (581 mil); los _Servicios Prestados a las Empresas_ el 18,7% (548 mil); el _Comercio_ el 17,0% (496 mil); la Industria el 11,2% (328 mil); la _Construcción_ el 5,7% (166 mil) y los _Servicios Domésticos_ el 3,7% (108 mil).

El IBGE registró 5.910.000 personas en edad activa en el municipio de Río de Janeiro en febrero de 2016, cifra que se mantuvo prácticamente estable durante el año. De ese total, el 49,4% estaba ocupado, el 2,7% desocupado y el 47,8% no era económicamente activo. El ingreso medio real de la población ocupada del municipio se estimó en R$ 3.038,40, lo que equivalía al ingreso per cápita del carioca.

Dentro de la población ocupada, los empleados formales del sector privado representaron el 47,0% (1.373 mil), los empleados sin registro del sector privado el 7,2% (210 mil), los trabajadores por cuenta propia el 21,8% (636 mil) y los militares o funcionarios públicos estatutarios el 13,5% (395 mil).

Los CNAE se oficializaron mediante una resolución del IBGE/CONCLA (Figura 1) del 4 de septiembre de 2006. Con dirección técnica del IBGE, el Instituto Brasileño de Geografía y Estadística, el CNAE está coordinado por la Secretaría de Ingresos Federales. Cada código combina siete dígitos que representan secciones, grupos, divisiones, clases y subclases.

La primera versión detallada de las subclases CNAE se definió en 1998 con la denominación CNAE-Fiscal. Recibió ajustes en 2001 (CNAE-Fiscal 1.0) y en 2002 (CNAE-Fiscal 1.1), esta última acompañando cambios puntuales en la estructura del CNAE (CNAE 1.0) derivados de ajustes en la clasificación internacional ISIC/CIIU 3.1 (Figura 2).

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_0.webp"/>

## Metodología

Este estudio analiza los datos de la [Relación Anual de Informaciones Sociales](https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Mensal_de_Emprego/Municipio_RJ/Comentarios/2016/pme-rj_201602comentarios.pdf) (RAIS), una declaración socioeconómica que la Secretaría de Trabajo del Ministerio de Economía de Brasil exige anualmente a las personas jurídicas y otros empleadores. Es de periodicidad anual y cubre todos los establecimientos formales y todos los vínculos contractuales y estatutarios en Brasil. Las estadísticas de la RAIS 2021 se apoyaron en dos fuentes de captación, eSocial y GDRAIS, con las siguientes definiciones:

- **Stock de empleos formales**: el número de vínculos activos al 31 de diciembre del año anterior, es decir, un retrato del mercado laboral.
- **Establecimientos**: la RAIS debe declararse por establecimiento, lo que permite analizar características como el sector de actividad económica, la naturaleza jurídica y la ubicación geográfica. Desde 1995, los establecimientos sin empleados están obligados a enviar la llamada RAIS negativa.
- **Agrupación de Actividades Económicas**: clasificación derivada de la agregación de las Secciones de la Clasificación Nacional de Actividades Económicas (CNAE 2.0).

Utilizamos consultas SQL sobre el datalake público de Base de los Datos, accesible mediante BigQuery, para recopilar y visualizar los datos relevantes. La consulta empleada para extraer los datos del análisis básico, vínculos activos entre 2018 y 2022 para cada CNAE en el estado de Río de Janeiro, se presenta a continuación:

**Consulta A**

```sql
SELECT
  v.cnae_2_subclasse AS CNAE,
  SUM(CASE
      WHEN v.ano = 2017 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2018,
  SUM(CASE
      WHEN v.ano = 2018 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2019,
  SUM(CASE
      WHEN v.ano = 2019 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2020,
  SUM(CASE
      WHEN v.ano = 2020 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2021,
  SUM(CASE
      WHEN v.ano = 2021 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2022,
  v.sigla_uf AS UF,
FROM
  basedosdados.br_me_rais.microdados_estabelecimentos v
WHERE
  v.cnae_2_subclasse IS NOT NULL
  AND v.sigla_uf = 'RJ'
  AND v.ano BETWEEN 2012
  AND 2022
  AND v.quantidade_vinculos_ativos IS NOT NULL
GROUP BY
  v.cnae_2_subclasse,
  v.sigla_uf
ORDER BY
  CNAE DESC;
```
<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_1.webp" caption="Tabla A1: Empleos por CNAE, estado de Río de Janeiro, 2018 a 2022"/>

**Consulta B**

```sql
SELECT
  v.cnae_2_subclasse AS CNAE,
  SUM(CASE
      WHEN v.ano = 2017 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2018,
  SUM(CASE
      WHEN v.ano = 2018 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2019,
  SUM(CASE
      WHEN v.ano = 2019 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2020,
  SUM(CASE
      WHEN v.ano = 2020 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2021,
  SUM(CASE
      WHEN v.ano = 2021 THEN v.quantidade_vinculos_ativos
      ELSE 0
  END
    ) AS Empregos_2022,
  v.sigla_uf AS UF,
  v.id_municipio
FROM
  basedosdados.br_me_rais.microdados_estabelecimentos v
WHERE
  v.cnae_2_subclasse IS NOT NULL
  AND v.sigla_uf = 'RJ'
  AND v.id_municipio = '3304557'
  AND v.ano BETWEEN 2012
  AND 2022
  AND v.quantidade_vinculos_ativos IS NOT NULL
GROUP BY
  v.cnae_2_subclasse,
  v.sigla_uf,
  v.id_municipio
ORDER BY
  CNAE DESC;
```
## Desarrollo y resultados

La economía de una región condiciona cuántos empleos genera. La ciudad de Río de Janeiro tiene una gran región metropolitana y una influencia considerable sobre otras ciudades del estado.

Uno de los objetivos de la **Consulta A** fue identificar las actividades económicas que representan más del 50% de los empleos generados en el estado de Río de Janeiro. A tal efecto, el estudio estableció un corte de 35 CNAE de un total de 1.318, que reúnen el 52,82% del stock total de empleos a comienzos de 2022, según la **Tabla A1**.

A partir de ahí se generó el **Gráfico A** para identificar las principales actividades económicas generadoras de empleo en el estado, con base en la **Tabla A2**, que presenta las agrupaciones de esas actividades.

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_2.webp" caption="Gráfico A: Principales actividades económicas con más del 50% de los empleos"/>

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_3.webp" caption="Tabla A2: Empleos por agrupaciones, estado de Río de Janeiro"/>

Uno de los objetivos de la **Consulta B** fue identificar las principales actividades económicas que generaron más empleos en la ciudad de Río de Janeiro, como se observa en la **Tabla B**. Sumando el total de empleos generados en el estado y en la ciudad entre 2018 y 2022 fue posible elaborar el **Gráfico B** para identificar su relación dinámica.

DataMPE Brasil, un servicio de producción y difusión de datos relevantes para el desarrollo de los pequeños negocios creado por SEBRAE Río de Janeiro, utilizó los datos de la RAIS para establecer que el número de empleados registrados en el estado fue de 3.938.871 en 2021, una variación del 4,56% respecto al año anterior. La remuneración media del trabajador en 2021 fue de R$ 2.333,58, y el número de establecimientos registrados fue de 560.871, una variación del 2,84% respecto al año anterior.

En el estado de Río de Janeiro, los sectores económicos que reunieron más trabajadores en 2021 fueron la _Administración Pública, Defensa y Seguridad Social_ (730.013), el _Comercio Minorista_ (598.989) y la _Educación_ (231.811).

Ese mismo año, el 42,9% de los trabajadores eran mujeres, con una remuneración media de R$ 3.186,91, y el 57,1% eran hombres, con una remuneración media de R$ 3.780,99.

Según los datos de la Receita Federal de Brasil, del total de establecimientos registrados hasta 2023, el 10,3% corresponde a _Otros_ (214.564 establecimientos), el 62,8% a _Microemprendedor Individual (MEI)_ (1.312.029), el 22,5% a _Microempresa (ME)_ (470.895) y el 4,44% a _Empresa de Pequeño Porte (EPP)_ (92.755).

Cerca de 13,2 millones de personas trabajaban como microemprendedores individuales (MEI) en Brasil en 2021, el equivalente al 69,7% del total de empresas y otras organizaciones y al 19,2% del total de ocupados formales. De las 673 clases del CNAE 2.0, el MEI estuvo presente en 206 en 2021. Más de la mitad de los MEI (55,7%) se concentran en las 15 primeras clases y casi el 75% en las 30 primeras. Cerca de la mitad (50,2%) estaba en el sector Servicios en 2021. El Comercio y la reparación de vehículos automotores y motocicletas respondieron por el 29,3%, y esa actividad presentó el mayor número de empleados de MEI (48,3%).

Río de Janeiro fue la unidad de la federación con mayor proporción de MEI respecto al total de ocupados formales (26%), seguida por Espírito Santo (24,8%).

Consultamos el sitio de la [Receita Federal](https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes/atbhe/estatisticassinac.app/EstatisticasOptantesPorCNAE.aspx?tipoConsulta=2&optanteSimei=&anoConsulta=MjAyMg%3D%3D), que contiene información sobre la cantidad de MEI por CNAE. La búsqueda encontró 35 CNAE con el 67,42% del total de microemprendedores individuales al 18 de noviembre de 2023.

<Image src="/blog/analisando-atividade-economica-do-rio-de-janeiro/image_4.webp" caption="Gráfico B: Relación de empleo ciudad/estado de Río de Janeiro"/>

## Conclusión

El análisis revela el peso considerable de las actividades económicas ligadas a la Administración Pública en el panorama económico del estado de Río de Janeiro, como evidencia el **Gráfico A**. Es plausible que muchas de esas actividades las realicen empresas que prestan servicios técnicos o administrativos complementarios a entidades estatales, organizaciones públicas y gobiernos municipales y estatales.

Para avanzar en la comprensión de ese escenario, futuras investigaciones pueden centrarse en identificar los centros de influencia de las actividades económicas públicas, lo que permitiría compararlos con los patrones de distribución salarial en todo el estado de Río de Janeiro.

Además, el **Gráfico B** sugiere una correlación económica entre el estado de Río de Janeiro y su capital. Para profundizar ese análisis es fundamental ampliar la serie histórica y realizar comparaciones más amplias de las actividades económicas en investigaciones futuras.
