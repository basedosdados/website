---
title: Guía de uso de Comex Stat
description: >-
  Guía de uso de las Estadísticas de Comercio Exterior en Datos Abiertos (Comex Stat). Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto de datos de Comex Stat
date:
  created: "2025-10-25T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Thais Filipi
    role: Texto
---

# Introducción

> Esta guía contiene información detallada sobre los datos. Para dudas sobre el acceso o el uso de la plataforma, consulte nuestra [página de Preguntas Frecuentes](/faq).

Este conjunto de datos tiene cuatro tablas de microdatos:
- **Municipio Exportación:** Cada fila representa la agregación de los registros de exportación por año, mes, categoría del producto (SH4), país de destino, unidad federativa y municipio de la empresa exportadora.
- **Municipio Importación:** Cada fila representa la agregación de los registros de importación por año, mes, categoría del producto (SH4), país de origen del bien importado, unidad federativa y municipio de la empresa importadora.
- **NCM Exportación:** Cada fila representa la agregación de los registros de exportación por año, mes, medio de transporte, aduana, país, categoría del producto (NCM) y la unidad federativa en la que se produjo la mercancía exportada.
- **NCM Importación:** Cada fila representa la agregación de los registros de importación por año, mes, medio de transporte, aduana, país, categoría del producto (NCM) y la unidad federativa de destino de la importación realizada.

# Consideraciones para los análisis
## Categorías de producto
- El Sistema Armonizado (SA) es un sistema internacional de clasificación y codificación de mercancías, generalmente con códigos de 6 dígitos. Tiene varios niveles de detalle. Los dos primeros dígitos corresponden al capítulo, los dos siguientes a la partida y los dos últimos a la subpartida de la mercancía. En las tablas ```municipio_exportacao``` y ```municipio_importacao```, la columna de clasificación es SH4, lo que significa que solo tenemos la agregación a nivel de partida de la mercancía. La traducción de este código se realiza a través de los [Directorios Mundiales de BD](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=2399179d-0e74-4f1b-a940-7e418cafa02f), que tiene 6 dígitos.
-  La Nomenclatura Común del Mercosur (NCM) es un desdoblamiento del SA. De los ocho dígitos que componen la NCM, los seis primeros están formados por el Sistema Armonizado, mientras que los dos últimos corresponden a secciones específicas en el ámbito del MERCOSUR. Traducir mediante los [Directorios Mundiales](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=3027c0d8-d17b-443f-a295-1de6ff65d5cc).
- Cada producto está asociado a una unidad de medida (```id_unidade```) que define cómo deben interpretarse los valores (por ejemplo, kilogramo neto, unidad o tonelada métrica neta). Es posible traducir la columna ```id_unidade``` de las tablas ```ncm_exportação``` y ```ncm_importacao``` mediante los [Directorios Mundiales](https://basedosdados.org/dataset/afc7c3a1-8691-4f3b-8566-bdce90f1100d?table=3027c0d8-d17b-443f-a295-1de6ff65d5cc).

## Datos de ```id_municipio``` y ```sigla_uf```
- En ```municipio_exportacao``` y ```municipio_importacao```, la columna de municipio se refiere al domicilio fiscal de la empresa responsable de la exportación o importación, no al lugar donde se produjo la mercancía exportada ni al destino de la importación. La ```sigla_uf``` en estas tablas corresponde al valor de ```id_municipio```.
- En ```ncm_exportacao``` y ```ncm_importacao```, la columna de UF se refiere al lugar de producción de la mercancía (exportación) o al destino de la importación, independientemente de la ubicación de la sede de la empresa que realizó la exportación o importación.

# Corrección de valores nulos de UF y municipio
Los valores nulos de ```id_municipio``` y ```sigla_uf``` se corrigen y completan correctamente solo después de la corrección anual de los datos por parte de la secretaría responsable.

## Datos de ```id_pais``` en las tablas de importación
La importación considera el origen de la mercancía, y no el país de la empresa que realizó la venta. En la mayoría de los casos, el país sede de la empresa que vende la mercancía es el mismo país donde se fabrica la mercancía. Sin embargo, hay casos en que esto no ocurre.

## Valor FOB
```valor_fob_dolar``` se refiere únicamente al valor de la mercancía. Los costos de flete y seguro de importación se detallan en ```valor_frete``` y ```valor_seguro```.

## URFs y vía
No se debe confundir las Unidades de la Receita Federal de Despacho (URFs) con una vía específica, como por ejemplo, los puertos, ya que algunos puertos tienen más de un recinto aduanero.

# Limitaciones
Los registros no están identificados por las empresas o personas físicas que participan en la exportación o importación de bienes, lo que limita las posibilidades de análisis (como por CNAE o tamaño de la empresa, por ejemplo).

# Inconsistencias
Aparecen divergencias en la comparación de datos entre países. En el intercambio bilateral de Brasil, es común identificar discrepancias entre las cifras publicadas por cada socio.

# Observaciones a lo largo del tiempo
Es posible seguir las tendencias de la balanza comercial en los diferentes niveles de observación de las tablas, tanto mes a mes como por año. La agregación de los datos mensuales consolidados permite obtener los resultados anuales del comercio exterior.

# Filas duplicadas
Sin información por el momento.

# Cruces de datos
Los datos están anonimizados y no contienen información de CNPJ o CPF de los agentes de importación y exportación. Esto limita los cruces con otros conjuntos de datos, pero es posible usar las columnas ```id_pais```, ```sigla_uf``` e ```id_municipio```.

# Descarga de los datos
El total de las tablas ocupa cerca de 9 GB, por lo que se recomienda seguir buenas prácticas de procesamiento de datos en la medida de lo posible. Para evitar sobrecargar su computadora, recomendamos usar consultas en BigQuery para procesar los datos en la nube antes de descargarlos. Filtre por las columnas de partición (como ```ano```, ```mes```, ```sigla_uf``` y ```sigla_pais_iso3```) y seleccione solo las columnas relevantes.

# Instrumento de recolección
Las estadísticas de comercio exterior se elaboran a partir de datos de registros administrativos, alimentados mediante declaración por las partes involucradas en las operaciones de exportación e importación –empresas, agentes de aduana, instituciones financieras, transportistas, agentes de carga, personas físicas, etc.– en los sistemas oficiales [Siscomex](https://www.gov.br/siscomex/pt-br) y [Portal Único de Siscomex](https://portalunico.siscomex.gov.br/portal/), que gestionan el comercio exterior brasileño.

# Cambios en la recolección
- **Cambios en el sistema de recolección en 2018**
	- A partir de 2018, hubo un cambio en la herramienta de ingreso de los datos de exportación, del NOVOEX al Portal Único. En el nuevo sistema, los casos de embarque anticipado sin factura pueden quedar sin registro de UF ("UF No Declarada"). Solo después de la emisión de la factura es posible corregir la información de UF, lo que hace que los valores nulos de este campo estén sobredimensionados en los meses más recientes. Consulte el Manual de Uso de Comex para más detalles.
- **Cambio de metodología sobre la fecha de referencia de bienes importados y exportados en 2018** 
	- A partir de 2018, la fecha de referencia de los datos de exportación pasó a ser la fecha en que la carga se considera completamente exportada (Fecha de CCE); de 1997 a 2017 era la fecha de Despacho Aduanero.

# Actualizaciones
Los datos de Comex se actualizan en los primeros días hábiles de cada mes. Aunque la secretaría competente publica boletines semanales, estos deben desestimarse cuando se publica la versión mensual consolidada. En Base de los Datos hay una pipeline programada para buscar y actualizar los datos diariamente. Si nota que los datos están desactualizados, comuníquese con nuestro equipo.

# Datos identificados
Los datos están anonimizados y no contienen información de CNPJ o CPF. Los registros administrativos y aduaneros que alimentan Comex Stat tienen una finalidad probatoria, fiscalizadora y de validez jurídica, bajo la responsabilidad de los órganos competentes.

# Tratamientos realizados por BD
En esta guía, los tratamientos se describen en un lenguaje más accesible. De manera complementaria, los [códigos de tratamiento](https://github.com/basedosdados/pipelines/tree/main/pipelines/datasets/br_me_comex_stat) y las [modificaciones realizadas en BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_comex_stat) están disponibles en el repositorio de GitHub para su consulta.
Los tratamientos realizados fueron: 
* Corrección de códigos municipales específicos en estados con inconsistencias históricas (SP, MS, GO y DF), garantizando la alineación con el estándar del IBGE (7 dígitos);
* Estandarización de los nombres de las columnas según el [Manual de Estilo de BD](https://basedosdados.org/docs/style_data);
* Conversión de la columna ```mes``` al tipo entero (int64)
* Sustitución de códigos inválidos (como "ND" o "9300000") por valores nulos en las columnas ```sigla_uf``` e ```id_municipio```;
* Estandarización de códigos en columnas específicas:
	* ```id_ncm``` (8 dígitos, formato string);
	- ```id_sh4``` (4 dígitos, formato string);
	- ```id_pais``` convertido al código ISO3 (```sigla_pais_iso3```) en las tablas donde esto aplica

# Materiales de apoyo
- [Manual de utilización de los datos estadísticos del comercio exterior brasileño](https://balanca.economia.gov.br/balanca/manual/Manual.pdf).
- [Manuales y Notas Metodológicas](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/manuais-e-notas-metodologicas) en el sitio del Ministerio de Desarrollo, Industria, Comercio y Servicios.
- [Totales para validación](https://www.gov.br/mdic/pt-br/assuntos/comercio-exterior/estatisticas/base-de-dados-bruta) de los datos en Estadísticas de Comercio Exterior en Datos Abiertos
- Análisis realizados por BD con Comex Stat ([soja](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_comex_stat_municipio_exportacao_20230626.ipynb) y [café](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_me_comex_stat_20251006.sql)).


