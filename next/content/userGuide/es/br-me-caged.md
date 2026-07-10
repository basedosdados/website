---
title: Guía de uso del CAGED
description: >-
  Guía de uso del Cadastro Geral de Empregados e Desempregados (CAGED). Este material contiene información sobre las variables más importantes, preguntas frecuentes y ejemplos de uso del conjunto.
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

Este conjunto de datos posee cinco tablas de microdatos, divididas entre dos del antiguo CAGED y tres del nuevo CAGED. Las metodologías del modelo antiguo y del nuevo no son compatibles, lo que afecta los análisis temporales.

- **Microdatos Antiguos:** Cada fila representa un registro de admisión o despido hasta diciembre de 2019. Las columnas describen las características del empleado, del tipo de vínculo laboral y de la empresa.
- **Microdatos Antiguos de Ajustes:** Complementa la tabla Microdatos Antiguos con ajustes de admisiones y despidos mensuales, incluyendo cancelaciones y movimientos fuera de plazo.
- **Microdatos de Movimientos:** Cada fila representa un registro de admisión o despido a partir de enero de 2020. Las columnas describen las características del empleado, del tipo de vínculo laboral y de la empresa.
- **Microdatos de Movimientos Excluidos:** Complementa la tabla Microdatos de Movimientos con cancelaciones de admisiones o despidos. Estas cancelaciones afectan el saldo del CAGED en sentido inverso al del evento original.
- **Microdatos de Movimientos Fuera de Plazo:** Complementa la tabla Microdatos de Movimientos registrando eventos fuera del período regular.

# Consideraciones para los análisis

## Saldo de movimientos

El crecimiento o la reducción de empleos en un grupo puede determinarse mediante la suma de la columna `saldo_movimentacao`. Verifica en esa columna si la fila representa una admisión o un despido.

## Exclusiones y movimientos fuera de plazo

Además de los movimientos regulares, es importante considerar las tablas Microdatos de Movimientos Excluidos y Microdatos de Movimientos Fuera de Plazo para obtener un saldo más preciso. Las cancelaciones afectan el saldo en sentido inverso al del evento original, mientras que los movimientos fuera de plazo incluyen eventos registrados después del período regular.

## Ejemplo de ajuste del saldo con los movimientos fuera de plazo y los movimientos excluidos

Como ejemplo de cómo realizar el procedimiento de ajuste, puede utilizarse la siguiente _query_:

```sql
with tabelas_unidas as (
select *, 0 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao`
union all
select * except (ano,mes), 0 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao_fora_prazo`
union all
select * except (ano,mes, ano_declaracao_movimentacao, mes_declaracao_movimentacao, indicador_exclusao), 1 as indicador_exclusao from `basedosdados.br_me_caged.microdados_movimentacao_excluida`),

tabela_ajustada as (
select *,
case
  when saldo_movimentacao = 1 then 'admissão'
  when saldo_movimentacao = -1 then 'desligamento'
end as admissao_desligamento,
case
  when indicador_exclusao = 0 then saldo_movimentacao
  when indicador_exclusao = 1 then -saldo_movimentacao
end as saldo_movimentacao_ajustado
from tabelas_unidas)

select
ano,
mes,
sum(if(admissao_desligamento = 'admissão', saldo_movimentacao_ajustado, 0)) as qte_admissoes,
sum(if(admissao_desligamento = 'desligamento', saldo_movimentacao_ajustado, 0))as qte_desligamentos,
sum(saldo_movimentacao_ajustado) as saldo,
from tabela_ajustada
where sigla_uf='SP'
group by 1, 2
order by ano, mes
```

# Limitaciones

Los datos se limitan a trabajadores con vínculo laboral formal, y no incluyen información sobre trabajadores informales o autónomos.

# Inconsistencias

## Columna `salario_mensal`

Se identificaron valores fuera de lo esperado, como salarios en el rango de millones de reales para sectores que generalmente no pagan montos tan elevados. Esto puede deberse a errores de registro o a valores atípicos.

## Municipios y unidades federativas no identificados

En todas las tablas existen casos en los que la columna _uf_ (sigla_uf, en BD) tiene el valor 99 y la variable _municipio_ (id_municipio, en BD) tiene el valor 99999.

## Panel de empleos del CAGED

El panel de empleos del [CAGED](https://app.powerbi.com/view?r=eyJrIjoiNWI5NWI0ODEtYmZiYy00Mjg3LTkzNWUtY2UyYjIwMDE1YWI2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9&pageName=ReportSectionb52b07ec3b5f3ac6c749) es la referencia de validación de los ajustes que deben realizarse con las tablas microdados_movimentacao_fora_prazo y microdados_movimentacao_excluida.

# Observaciones a lo largo del tiempo

Cada fila representa una contratación o un despido. Como los datos están desidentificados, no es posible seguir a individuos o empresas a lo largo del tiempo. Lo que sí es posible es seguir el crecimiento o la caída de trabajadores con contrato formal en un determinado sector (`cnae`), ocupación (`cbo`) u otras combinaciones de las columnas disponibles. Además, es importante tener en cuenta que la metodología del CAGED cambió a comienzos de 2020, por lo que los análisis temporales deben realizarse hasta 2019 o a partir de 2020.

# Filas duplicadas

No se encontraron filas duplicadas en este conjunto de datos.

# Cruces

Los datos están anonimizados y no contienen CNPJ ni CPF. Esto limita los cruces con otros conjuntos que sí poseen CNPJ, pero es posible usar columnas como `cnae` e `id_municipio` para realizar cruces interesantes.

# Descarga de los datos

Los microdatos suman más de 20 GB. Para evitar sobrecargar tu computadora, recomendamos usar queries en BigQuery para procesar los datos en la nube antes de descargarlos. Filtra por las columnas de partición (como año y UF) y selecciona solo las columnas relevantes.

# Instrumento de recolección

El Nuevo CAGED compila datos del empleo formal a partir de sistemas como eSocial, CAGED y Empregador Web. Los registros administrativos pasan por un procesamiento antes de ponerse a disposición del público.

# Cambios en la recolección

En 2020, el CAGED pasó por una reformulación, que automatizó la recolección de información y amplió la cobertura. Sin embargo, esto generó una incompatibilidad con las series históricas anteriores. Para más información sobre estas modificaciones, consulta los [materiales de apoyo](https://basedosdados.org/dataset/562b56a3-0b01-4735-a049-eeac5681f056?tab=userGuide#tratamentos-feitos-pela-bd).

# Actualizaciones

Los microdatos se actualizan con un mes de rezago. El calendario de actualizaciones puede consultarse en el [sitio del MTE](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/calendario-de-divulgacao-do-novo-caged).

# Datos identificados

Los datos están anonimizados y no contienen CNPJ ni CPF. Para obtener datos identificados es necesario solicitarlos al MTE. El proceso puede ser demorado y no hay garantía de aprobación.

# Tratamientos realizados por BD:

En esta guía, los tratamientos se describen en un lenguaje más accesible. De manera complementaria, [los códigos de extracción y tratamiento](https://github.com/basedosdados/pipelines/blob/main/models/br_me_caged/code/crawler_caged.py) y las [modificaciones realizadas en BigQuery](https://github.com/basedosdados/pipelines/tree/main/models/br_me_caged) están disponibles en el repositorio de GitHub para consulta.
Los tratamientos realizados fueron:

- Cambio de nombre de las columnas para adecuarlas al manual de estilo;
- Creación de las columnas `ano` y `mes`;
- Creación de las columnas ano_competencia_movimentacao y mes_competencia_movimentacao en las tablas microdados_movimentacao_fora_prazo y microdados_movimentacao_excluida
- Creación de las columnas ano_declaracao_movimentacao y mes_declaracao_movimentacao en la tabla microdados_movimentacao_excluida
- Adecuación de las columnas de unidades federativas al estándar de sigla UF;
- Eliminación de las columnas: `valorsalariofixo`, `unidadesalariocodigo`

# Materiales de apoyo

- [Reportaje de G1 sobre los cambios en el CAGED](https://g1.globo.com/economia/noticia/2021/04/28/serie-historica-do-emprego-formal-nao-pode-ser-comparada-com-novo-caged-dizem-analistas.ghtml): Reportaje de G1 que recoge las consideraciones de especialistas sobre los cambios del CAGED
- [Nota del MTE que explica los principales cambios en el Nuevo CAGED](https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/estatisticas-trabalho/o-pdet/o-que-e-o-novo-caged): Nota del MTE que explica los principales cambios ocurridos en el Nuevo CAGED
