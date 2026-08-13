---
title: Guía de uso de la RAIS
description: >-
  Guía de uso de la Relação Anual de Informações Sociais (RAIS). Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto de datos de la RAIS 
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Introducción

> Esta guía contiene información detallada sobre los datos. Si tiene dudas sobre el acceso o el uso de la plataforma, consulte nuestra [página de Preguntas Frecuentes](/faq).

Este conjunto de datos tiene dos tablas de microdatos: 
- **Microdatos de Establecimientos:** Cada fila representa un establecimiento en un año específico. Las columnas muestran detalles sobre la empresa y sus empleados.
- **Microdatos de Vínculos:** Cada fila representa un vínculo laboral en un año específico. Las columnas muestran información sobre el vínculo, el empleado y la empresa contratante.

# Consideraciones para los análisis
## Vínculos y filtrado de datos
La tabla de vínculos muestra todos los vínculos registrados por una empresa durante el año. Si un empleado es despedido y otro es contratado en el mismo año, ambos tendrán un registro de vínculo para el mismo puesto. Para contar los empleados activos en un sector o región, use la columna `vinculo_ativo_3112`.

## Información de dirección
La RAIS no contiene información sobre la dirección de los empleados. La columna `id_municipio` se refiere al municipio de la empresa, y la columna `id_municipio_trabalho` se refiere al municipio donde el trabajador presta servicios, cuando es diferente.

## Datos parciales y datos completos
La RAIS se publica dos veces al año. Entre la publicación parcial (septiembre) y la completa (inicio del año siguiente), el último año de la serie siempre muestra menos registros. Por ejemplo, en noviembre de 2025, el año 2024 muestra alrededor de 46 millones de vínculos, mientras que 2022 y 2023 tienen más de 50 millones. Esto no significa que el número de vínculos haya caído: solo significa que los datos de 2024 aún no se habían publicado en su totalidad.

# Limitaciones
Los datos se limitan a trabajadores con vínculo formal y no incluyen trabajadores informales ni autónomos. Los datos públicos están anonimizados.

# Inconsistencias
## Columnas `quantidade_vinculos_ativos` y `tamanho_estabelecimento`
Existen discrepancias entre las columnas `quantidade_vinculos_ativos` y `tamanho_estabelecimento`. La primera muestra el total de vínculos, mientras que la segunda clasifica el establecimiento por número de vínculos. En algunos casos, la cantidad de vínculos no corresponde a la categoría de tamaño del establecimiento.

## Vínculos laborales en la RAIS y en el CAGED
La RAIS registra vínculos laborales anualmente y el CAGED registra los movimientos durante el año. En teoría, sumando o restando los movimientos del CAGED al total de vínculos de la RAIS, sería posible calcular el total del año siguiente, pero eso no ocurre. Como los sistemas operan de forma independiente, las divergencias pueden deberse a errores acumulados en cada uno.

## Columna id_municipio_trabalho
La columna `id_municipio_trabalho` está completa solo entre 2005-2011 y 2017-2021. Se desconoce el motivo.  

## Datos desactualizados
A veces, los datos de la RAIS se actualizan fuera del calendario previsto y nuestro equipo no siempre se entera. Si tiene la certeza de que está haciendo las consultas correctas, contáctenos enviando la consulta y la diferencia respecto al sitio oficial, para que podamos evaluar la situación y, si es necesario, corregirla.  

# Observaciones a lo largo del tiempo
Cada año, el conjunto de datos se actualiza, de modo que un establecimiento o vínculo aparece en todos los años en que estuvo activo. Como los datos están anonimizados, no es posible seguir la evolución de vínculos o empresas a lo largo del tiempo, pero sí es posible analizar el número de empleados registrados formalmente en diferentes sectores o localidades.

# Filas duplicadas
No se encontraron filas duplicadas en este conjunto de datos. Sin embargo, la tabla de Microdatos de Vínculos incluye todos los vínculos de una empresa, por lo que, si un empleado fue despedido y otro contratado en el mismo año, habrá dos filas para el mismo puesto.

# Cruces con otros conjuntos de datos
Los datos están anonimizados y no contienen CNPJ ni CPF. Esto limita los cruces con otros conjuntos de datos, pero es posible usar columnas como `cnae` y `cep` para ese fin.

# Descarga de los datos
Los microdatos suman más de 350 GB. Para evitar sobrecargar su computadora, recomendamos usar consultas en BigQuery para procesar los datos en la nube antes de descargarlos. Filtre por las columnas de partición (como `ano` y `sigla_uf`) y seleccione solo las columnas relevantes.

# Instrumento de recolección
El instrumento de recolección actual es un formulario que los empleadores deben completar sobre sus empleados.

# Cambios en la recolección
Algunas columnas se han agregado o eliminado a lo largo del tiempo. A partir de 2022, las empresas del grupo 3 del eSocial dejaron de estar obligadas a declarar la RAIS por su programa habitual. Por eso, no se recomienda comparar los resultados de ese año con los de años anteriores.

# Actualizaciones
Los datos tienen una actualización parcial y una completa. La actualización parcial ocurre en septiembre del año de recolección, y la completa ocurre hasta el inicio del año siguiente al año de recolección. Esto significa que los datos correspondientes a 2023, recolectados en 2024, estuvieron parcialmente disponibles en septiembre de 2024, y la versión completa se publicó hasta comienzos de 2025. A veces, la actualización puede ocurrir fuera del calendario previsto. Si nota que los datos están desactualizados, contacte a nuestro equipo.

# Datos identificados
Los datos están anonimizados y no contienen CNPJ ni CPF. Para obtener datos identificados de la RAIS, es necesario solicitarlos al MTE. El proceso puede ser lento y no hay garantía de aprobación.

# Tratamientos realizados por BD
En esta guía, los tratamientos se describen en un lenguaje más accesible. De manera complementaria, los [códigos de tratamiento](https://github.com/basedosdados/pipelines/tree/main/models/br_me_rais/code) y las [modificaciones realizadas en BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_rais) están disponibles en el repositorio de GitHub para consulta. 
Los tratamientos realizados fueron: 
* Adecuación de las columnas que identifican municipios al formato ID Municipio IBGE (7 dígitos);
* Adecuación de las columnas que identifican Unidades Federativas al estándar de sigla UF;
* Sustitución de códigos inválidos (como "9999" o "000") por valores nulos en las columnas `bairros`, `cbo`, `cnae` y `ano`;
* Estandarización de los códigos en la columna `tipo_estabelecimento` para garantizar consistencia entre diferentes años.

# Materiales de apoyo
* [Manual de orientación para los empleadores sobre cómo completar los campos del formulario](http://www.rais.gov.br/sitio/rais_ftp/ManualRAIS2023.pdf)
* [Información detallada sobre la RAIS en el sitio del MTE](http://www.rais.gov.br/sitio/sobre.jsf)
* [Panel del MTE con cifras consolidadas de la RAIS completa](https://app.powerbi.com/view?r=eyJrIjoiZmJmMDVhODctMTEwOS00YTVhLWJhNzItOWE3NmVlMWEwMTUxIiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9)
* [Panel del MTE con cifras consolidadas de la RAIS parcial](https://app.powerbi.com/view?r=eyJrIjoiNjk3M2IwZDYtOGQzMS00YmE1LWE3M2MtZWRjODA4NTk3YTQ2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9)
* [Sistema Dardo: sistema que utilizamos para la validación de las tablas publicadas](https://bi.mte.gov.br/bgcaged/)
