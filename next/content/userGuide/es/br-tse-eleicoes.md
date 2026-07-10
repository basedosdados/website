---
title: Guía de uso de las Elecciones Brasileñas
description: >-
  Guía de uso de los datos de Elecciones Brasileñas. Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto.
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Introducción

> Esta guía contiene información detallada sobre los datos. Para dudas sobre el acceso o el uso de la plataforma, consulte nuestra [página de Preguntas Frecuentes](/faq).

Al tener más de 20 tablas, este conjunto puede parecer complejo a primera vista. Para facilitarlo, organizamos la información en grupos temáticos y detallamos el contenido de cada tabla.

## Candidatos
- **`candidato`**: Tabla de microdatos. Cada fila representa una candidatura en una elección. Las columnas contienen información sobre el candidato y su candidatura.
- **`bens_candidato`**: Tabla de microdatos. Cada fila representa un bien declarado por un candidato en una elección. Si el candidato participa en más de una elección, pueden aparecer bienes repetidos. Las columnas describen el bien y su valor.
- **`despesas_candidato`**: Tabla de microdatos. Cada fila representa un comprobante de gasto de un candidato en una elección. Las columnas describen los detalles del gasto.
- **`receitas_candidato`**: Tabla de microdatos. Cada fila representa un ingreso de campaña de un candidato en una elección. Las columnas incluyen información sobre el ingreso, como los datos del donante y detalles fiscales.
- **`resultados_candidato`, `resultados_candidato_municipio`, `resultados_candidato_municipio_zona`, `resultados_candidato_secao`**: Tablas agregadas con estructura similar. Cada fila representa el resultado de un candidato en una elección. La diferencia está en el nivel de agregación: total de la elección, por municipio, por zona o por sección. Las columnas muestran el total de votos, detalles del cargo y si el candidato fue electo.

## Partidos
- **`partidos`**: Tabla de microdatos. Cada fila representa un partido en un recorte electoral en una elección. Las columnas indican la situación del partido y las coaliciones o federaciones formadas para cada cargo.
- **`receitas_comite` y `receitas_orgao_partidario`**: Tablas de microdatos con estructura similar. Cada fila representa un ingreso de campaña. La diferencia está en la entidad que recibió el ingreso: comité u órgano partidario. Las columnas incluyen información sobre el ingreso, como los datos del donante y detalles fiscales.
- **`resultados_partido_municipio`, `resultados_partido_municipio_zona`, `resultados_partido_secao`**: Tablas agregadas con estructura similar. Cada fila representa el resultado de un partido para un cargo determinado en una elección. La diferencia está en el nivel de agregación: por municipio, por zona o por sección. Las columnas muestran el total de votos, separando votos nominales y votos de leyenda (lista partidaria).

## Información general sobre las elecciones
- **`vagas`**: Tabla agregada. Cada fila representa un cargo en una unidad electoral en una elección. Las columnas indican el total de escaños disponibles para ese cargo.
- **`perfil_eleitorado_local_votacao`, `perfil_eleitorado_municipio_zona`, `perfil_eleitorado_secao`**: Tablas agregadas con estructura similar. Cada fila representa un estrato del perfil sociodemográfico de los electores (género, edad, estado civil, nivel educativo). La diferencia está en el nivel de agregación: por municipio, por zona o por sección. Las columnas indican el perfil sociodemográfico, la situación respecto a la biometría y el total de electores.
- **`detalhes_votacao_municipio`, `detalhes_votacao_municipio_zona`, `detalhes_votacao_secao`**: Tablas agregadas con estructura similar. Cada fila representa los detalles de la votación en una elección. La diferencia está en el nivel de agregación: por municipio, por zona o por sección. Las columnas indican el total de abstenciones y votos por tipo.
- **`local_secao`**: Tabla de microdatos. Cada fila representa una sección electoral en un año. Esta es la única tabla que no fue publicada por el TSE; fue creada por una organización externa. Las columnas incluyen estimaciones del punto de ubicación geográfica de cada sección electoral.

# Consideraciones para los análisis
## Transferencias entre candidatos en la tabla de ingresos
Los candidatos pueden transferirse fondos entre sí, lo que hace que un mismo ingreso aparezca más de una vez.

## Columna id_municipio
Algunos registros tienen la columna `id_municipio nulo`, ya que el TSE registra municipios en el exterior que no cuentan con código IBGE. En esos casos, solo la columna `id_municipio_tse` está completa.

## Situación del candidato
Las candidaturas pueden ser rechazadas por la justicia electoral. Para filtrar únicamente a los candidatos que efectivamente compitieron en una elección, use el filtro `situacao = 'deferida'`.

## Rendición de cuentas
Los datos se completan manualmente, lo que puede generar inconsistencias, valores ausentes o duplicados, especialmente durante los períodos de campaña.

## Proporción de votos válidos para el Senado
En los años en que la elección para el Senado involucra dos escaños, la proporción de votos válidos en las tablas `detalhes_votacao_municipio`, `detalhes_votacao_municipio_zona` y `detalhes_votacao_secao` puede superar el 100%.
Esto ocurre porque, en esos años, cada elector puede votar por dos candidatos diferentes, y el TSE contabiliza cada voto individualmente como un voto válido para el cargo. Así, un mismo elector aparece dos veces en el conteo, lo que eleva la proporción de votos válidos por encima del 100%.

## Elecciones suplementarias
Puede haber más de un alcalde, gobernador o presidente electo dentro de un mismo mandato (por ejemplo, 2020–2024). Esto ocurre cuando la justicia electoral anula más del 50% de los votos válidos y convoca una elección suplementaria para elegir a un nuevo representante. Para el análisis, use la columna `tipo_eleição` para diferenciar elecciones ordinarias y suplementarias dentro de un mismo ciclo electoral.

## Columna ano
La columna ano indica el año del ciclo electoral originalmente previsto (ej.: 2020), aunque la elección haya ocurrido posteriormente. Por ejemplo, la columna `data_eleicao` puede indicar una fecha en 2022, mientras que la columna `ano` permanece con el valor 2020.

# Limitaciones
Las tablas del TSE no incluyen información sobre elecciones para el conselho tutelar (consejo tutelar de niños y adolescentes).

# Inconsistencias
Además del comportamiento esperado en los años con dos escaños para el Senado, identificamos que existen algunas decenas de filas en la tabla `detalhes_votacao_secao` en las que la proporción de votos válidos supera el 100% sin una causa conocida. Este conjunto de casos es muy pequeño en relación con el total de filas de la tabla y, hasta el momento, no hemos encontrado una explicación para lo ocurrido. Recomendamos tratar estos registros como residuales y analizarlos con cautela si tienen un impacto directo en su aplicación.

# Observaciones a lo largo del tiempo

- Para hacer seguimiento de los candidatos a lo largo de los años, puede usar la columna `titulo_eleitoral`. Este identificador rastrea a los individuos de forma consistente, superando la limitación de otros identificadores asociados que cambian entre elecciones. Identifica a los candidatos en el 99,5% de los casos. Sin embargo, cabe señalar que pueden existir valores nulos o dos identificadores diferentes para un mismo candidato en algunos casos.

- Para hacer seguimiento de los partidos, es necesario considerar los cambios de nombre y las fusiones a lo largo del tiempo.

# Filas duplicadas
Las filas duplicadas se eliminan durante el tratamiento realizado por BD.

# Cruces
Preste atención a las columnas que identifican de manera única a las entidades y tablas:
- **Candidaturas**: Para cruzar información de una misma elección, las columnas `ano`, `tipo_eleicao` y `sequencial_candidato` forman una clave única para los datos a partir de 2010. Para períodos anteriores, puede usar las columnas `titulo_eleitor`, `ano` y `tipo_eleicao`. Esta combinación es única en el 99,5% de los casos, pero no es totalmente precisa, ya que algunas candidaturas tienen la columna `titulo_eleitor` vacía.
- **Personas:** Una misma persona puede tener varias candidaturas registradas a lo largo de los años. Para identificar a una persona, se recomienda usar la columna `titulo_eleitor`.
- **Zonas**: Para cruzar información de un mismo año, las columnas `ano`, `id_municipio_tse` y `zona` forman una clave única. Las zonas pueden cambiar entre años y tienen identificadores únicos solo dentro de un municipio.
- **Secciones**: Para cruzar información de un mismo año, las columnas `ano`, `id_municipio_tse`, `zona` y `seção` forman una clave única. Las secciones pueden cambiar entre años y tienen identificadores únicos solo dentro de un municipio y una zona.
- **Partidos**: Se identifican por las columnas `sigla_partido` y `numero_partido`.

# Descarga de los datos
Algunas tablas de este conjunto tienen más de 1GB, mientras que otras son más pequeñas. Para evitar sobrecargar su computadora, verifique el tamaño de las tablas que le interesan. Si son muy grandes, recomendamos usar consultas en BigQuery para procesar los datos en la nube antes de descargarlos. Filtre por las columnas de partición (como año y estado, UF) y seleccione solo las columnas relevantes.

# Instrumento de recolección
## Sistema de Candidaturas (CAND)
Sistema utilizado para registrar candidaturas, en el que los partidos y coaliciones ingresan datos personales, información sobre afiliación partidaria, certificados de antecedentes penales y demás documentación necesaria de los candidatos.

## Sistema de Rendición de Cuentas Electorales (SPCE)
Sistema utilizado para registrar todos los ingresos y gastos de campaña. El SPCE garantiza que la información se presente de forma estandarizada y dentro de los plazos establecidos por la justicia electoral.

## Resultados electorales
Al finalizar la votación, cada urna electrónica genera un Boletim de Urna (acta de resultados) con los resultados obtenidos en la sección electoral. Los datos de las actas se envían a los Tribunales Regionales Electorales (TRE) y, luego, al TSE para la divulgación de los resultados finales.

## Perfil de los electores
Durante el alistamiento electoral y la revisión del padrón, los electores proporcionan datos personales, como nombre, fecha de nacimiento, género, nivel educativo y dirección. Las oficinas electorales registran esta información en el Cadastro Nacional de Eleitores (Padrón Nacional de Electores).

# Cambios en la recolección
El sistema electoral ha pasado por varios cambios a lo largo de los años, lo que impactó los datos recolectados. A continuación, los principales cambios:
- **1997**: Inclusión de información sobre género;
- **1998**: Divulgación del CPF (identificación tributaria individual) de los candidatos;
- **2014**: Inclusión de información sobre raza o color;
- **2016**: Prohibición de donaciones de CNPJ (empresas);
- **2022**: Recolección de datos sobre transgeneridad;
- **2024**: Interrupción de la divulgación del CPF de los candidatos.

# Actualizaciones
La mayoría de los datos se actualiza una vez por cada elección regular (cada dos años). Los datos de ingresos y gastos se actualizan diariamente durante las campañas electorales.

# Tratamientos realizados por BD:
En esta guía, los tratamientos se describen en un lenguaje más accesible. De manera complementaria, los [códigos de tratamiento](code-notebook) y las [modificaciones realizadas en BigQuery](queries-dir) están disponibles en el repositorio de GitHub para su consulta.
Los tratamientos realizados fueron:
- Eliminación de acentos y conversión del texto a minúsculas.
- Eliminación de registros duplicados considerando el conjunto completo de columnas.
- Los valores inválidos, como "-9999" o "#NULO", se convirtieron en nulos.
- Adecuación de las columnas que identifican municipios al formato ID Municipio IBGE (7 dígitos).
- Las fechas inconsistentes en la columna `data_nascimento` (edades menores de 18 o mayores de 120 años) se sustituyeron por valores nulos.
- Estandarización de la columna `tipo_eleicao`, cambiando "eleições municipais" por "eleição ordinária".
- Estandarización de la columna `nacionalidade`, cambiando "brasileira nata" por "brasileira".

# Materiales de apoyo
* [Sitio de datos abiertos del TSE con archivos disponibles para descargar](https://dadosabertos.tse.jus.br/dataset/)
* [Panel de Estadísticas Electorales con una amplia variedad de filtros y análisis simplificados](https://sig.tse.jus.br/ords/dwapr/seai/r/sig-eleicao/home?session=17112009236550)
* [Panel de consulta de información sobre candidaturas y rendición de cuentas electorales](https://divulgacandcontas.tse.jus.br/divulga/#/home)
* [Siga o Dinheiro (Sigue el Dinero): Panel desarrollado por BD para entender de dónde viene y en qué se está gastando el dinero de las campañas](https://www.sigaodinheiro.org/)
* [Curso de Análisis de Datos Electorales de BD](https://info.basedosdados.org/bd-edu-eleicoes)
* [Noticia del TSE sobre las elecciones suplementarias](https://www.tse.jus.br/comunicacao/noticias/2025/Fevereiro/voce-sabe-o-que-e-uma-eleicao-suplementar)

[code-pipeline]: https://github.com/basedosdados/pipelines/tree/main/pipelines/utils/crawler_tse_eleicoes
[code-notebook]: https://github.com/basedosdados/pipelines/blob/main/models/br_tse_eleicoes/code/%5Bdbt%5Dbr_tse_eleicoes.ipynb
[queries-dir]: https://github.com/basedosdados/pipelines/tree/main/models/br_tse_eleicoes
