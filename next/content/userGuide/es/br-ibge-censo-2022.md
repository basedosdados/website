---
title: Guía de uso del conjunto del Censo 2022
description: >-
  Guía de uso de la Relación Anual de Informaciones Sociales (RAIS). Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto de la RAIS 
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

Esta base posee 2 tablas con microdatos: 
- **Microdatos de Establecimientos:** Cada fila representa un establecimiento en un año determinado. Las columnas describen características de la empresa y sus empleados.
- **Microdatos de Vínculos:** Cada fila representa un vínculo laboral en un año determinado. Las columnas describen características del tipo de vínculo, del empleado y de la empresa contratante.

# Consideraciones para los análisis
## Vínculos y filtrado de datos
La tabla de Vínculos incluye todos los vínculos registrados por una empresa durante el año. Por lo tanto, si un empleado fue despedido y otro fue contratado en el mismo año, ambos tendrán una fila para el mismo puesto en la empresa. Si el objetivo es evaluar el total de empleados activos en un sector o región, es necesario utilizar la columna `vinculo_ativo_3112` para filtrar únicamente los vínculos que están activos en la fecha indicada.

# Limitaciones
* Los datos disponibles se limitan a los trabajadores con vínculo laboral formal, y no incluyen información sobre trabajadores informales o autónomos.
* Los datos públicos están anonimizados.

# Inconsistencias
## Columnas quantidade_vinculos_ativos y tamanho_estabelecimento
Las columnas `quantidade_vinculos_ativos` y `tamanho_estabelecimento` de la tabla de establecimientos presentan información discrepante entre sí. La primera tiene un valor entero que representa el total de vínculos de ese establecimiento, y la segunda es una categoría definida por el total de vínculos. Sin embargo, encontramos varios casos en los que la cantidad de vínculos no está dentro del rango definido por el tamaño del establecimiento. Aún no se sabe por qué ocurre esta inconsistencia.

# Observaciones a lo largo del tiempo
En estas tablas no es posible dar seguimiento a las variables a lo largo del tiempo; para realizar comparaciones entre años es necesario agregar los microdatos disponibles en el conjunto de microdatos del Censo.

# Filas duplicadas
Hasta el momento no se han encontrado indicios de filas duplicadas en las tablas de este conjunto.

# Cruces
Las tablas del censo pueden cruzarse con otras utilizando los recortes geográficos; contamos con información geolocalizada a nivel de sector censal. El cruce con otras bases que tengan información de municipios también es posible.

# Descarga de los datos
La mayor parte de las tablas del censo no son muy grandes; algunas se pueden descargar directamente desde nuestra plataforma, mientras que otras deben descargarse vía Python o R.

# Instrumento de recolección
La recolección de la información se realizó, en general, mediante entrevista presencial (entrevista directa, cara a cara, con los residentes del domicilio). Además de esta modalidad tradicional, para el Censo Demográfico 2022 se abrió la posibilidad de recolección por Internet. El censista podía ofrecer esta alternativa a pedido del residente, cuando hubiera restricciones de acceso a áreas específicas (por ejemplo, en condominios cerrados), o cuando surgiera cualquier otra dificultad para realizar la recolección en la modalidad de entrevista presencial. También hubo un aumento en la recolección entre los Pueblos y Comunidades Tradicionales, donde se relevó, por primera vez, a las comunidades quilombolas.

# Cambios en la recolección
Como los datos de este conjunto se refieren únicamente a 2022, la metodología de recolección es la misma para todo el conjunto.

# Actualizaciones
Los datos del censo 2022 no tienen actualizaciones, pero el IBGE pone a disposición nuevos conjuntos de datos con frecuencia. Los próximos conjuntos están programados según el [calendario](https://censo2022.ibge.gov.br/panorama/calendario.html?localidade=BR).

# Tratamientos realizados por BD
El tratamiento de las tablas es mínimo: 
* Inclusión del id_municipio.
* Unión de la información de domicilios, población, área, tasa de alfabetización, edad mediana, índice de envejecimiento, población indígena y población quilombola en una única tabla de municipio.
* Creación de las columnas `idade_anos` y `grupo_idade` para facilitar operaciones numéricas en las tablas que contienen información de edad.

# Materiales de apoyo
* [Notas técnicas sobre el censo 2022](https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html?=&t=notas-tecnicas): Información relevante sobre cómo se realizó cada parte de la investigación, muy importante para obtener contexto y útil como inspiración para análisis.
