---
title: Explorando dados de saneamento usando SQL e a BD
description: >-
  Como o acesso à água e as disparidades regionais evoluíram no Brasil ao longo de duas décadas?
date:
  created: "2025-03-14T21:02:04.375Z"
authors:
  - name: Carlos Ferreira
    role: Análise
categories: [analise]
thumbnail: 
medum_slug: https://medium.com/@contato.carlosfpereira/explorando-dados-do-saneamento-brasileiro-com-sql-no-data-lake-da-base-dos-dados-77db515ac189
published: true
order: 2
---

>_Este é um texto publicado por um voluntário da BD. Quer publicar sua análise em nosso blog? Entre em contato via email [contato@basedosdados.org](mailto:contato@basedosdados.org)

A universalização do acesso à água e saneamento básico integra os Objetivos de Desenvolvimento Sustentável (ODS) da Organização das Nações Unidas (ONU). O ODS 6, em específico, dispões diversas metas para a garantia do acesso equitativo e manejo sustentável da água, até 2030.

No Brasil, a análise de indicadores do IBGE e do Sistema Nacional de Informações sobre Saneamento (atual SNISA) nos permite observar os diferentes padrões regionais no acesso a água no território nacional, entre 2001 e 2022.

Utilizaremos a linguagem SQL para extrair as informações necessárias do data lake da Base dos Dados, Organização que agrega bases de dados nacionais e internacionais em um data lake público, facilitando a consulta e o cruzamento entre diversas tabelas.

O objetivo da análise é definir alguns pontos de partida para discussões mais amplas e melhor fundamentadas. Para tal, procuramos analisar não somente as variações numéricas nos indicadores, mas inseri-las de forma contextualizada nas dinâmicas socioeconômicas do país.

...

## Extração e tratamento dos dados

A consulta a seguir, no data lake da Base dos Dados, nos permite extrair os dados necessários, fazendo a junção de 3 tabelas diferentes: Censo 2022, [Diretórios Brasil](https://medium.com/basedosdados/diret%C3%B3rios-brasileiros-como-essa-base-facilita-sua-an%C3%A1lise-40dc8ce2ca2) e Sistema Nacional de Informações sobre Saneamento (SNIS).

```sql
SELECT 
  A.ano,
  B.nome_uf AS UF,
  B.nome AS municipio,
  B.capital_uf,
  B.nome_regiao AS regiao,
  A.populacao,
  C.populacao_atendida_agua,
  C.indice_atendimento_total_agua
FROM `basedosdados.br_ibge_populacao.municipio` AS A
INNER JOIN `basedosdados.br_bd_diretorios_brasil.municipio` AS B
ON A.id_municipio = B.id_municipio
INNER JOIN `basedosdados.br_mdr_snis.municipio_agua_esgoto` AS C
ON A.id_municipio = C.id_municipio AND A.ano = C.ano
WHERE A.ano BETWEEN 2001 AND 2022
ORDER BY A.ano,B.nome_uf;
```

O resultado é a tabela a seguir, que pode ser exportada como arquivo no formato .csv, e tratada em softwares de planilhas (Excel, Google Sheets) ou uma linguagem de programação (R, Python). As tabelas e gráficos aqui expostos foram feitos usando o Excel, porém, é possível usar qualquer uma das ferramentas citadas acima.

## Dados do saneamento

<Image src="/blog/explorando-dados-do-saneamento-brasileiro-com-sql-usando-a-BD/tabela-1.png" />

...

## População atendida com abastecimento de água, por Região, em 2001 e 2022, e variação absoluta.

<Image src="/blog/explorando-dados-do-saneamento-brasileiro-com-sql-usando-a-BD/tabela-2.png" />

Em 2001, o Sudeste (historicamente a região mais populosa e economicamente desenvolvida do país) já liderava o indicador de abastecimento hídrico em números absolutos, cenário que se manteve em 2022. Os estados de São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo iniciaram o período analisado com pouco mais de 50,9 milhões de pessoas atendidas e elevaram o número para 76,9 milhões em 2022.

Já o Nordeste, apesar dos desafios históricos com as secas e ausência de infraestrutura hídrica adequada, conseguiu expandir o acesso à água em mais de 19,6 milhões de pessoas no período analisado.

As demais regiões (Sul, Centro-Oeste e Norte) também demonstraram crescimento significativo. Combinadas, essas três regiões aumentaram a cobertura hídrica em mais de 26,7 milhões de pessoas ao longo dos anos.

## População atendida com abastecimento de água, por Região, em 2001 e 2022, e variação percentual.

<Image src="/blog/explorando-dados-do-saneamento-brasileiro-com-sql-usando-a-BD/tabela-3.png" />

Ao ordenarmos as regiões pela variação percentual, no entanto, observamos uma lógica diferente da tabela anterior, com o Sudeste em último lugar. Dessa forma, apesar da região ter experimentado o maior crescimento absoluto, ela teve o menor em termos percentuais.

Cabe ressaltar um importante destaque para Norte e Nordeste, regiões que lidam com problemas sociais e estruturais crônicos, e estão no primeiro e terceiro lugar, respectivamente. Com o Norte totalizando 178% de aumento e o Nordeste 97%. Dados da [Casa Civil](https://www.gov.br/casacivil/pt-br/novopac/agua-para-todos/infraestrutura-hidrica) revelam que, para o período de 2023 a 2026, será investido um total de R$ 2,1 bilhões em obras de integração do Rio São Francisco com as demais bacias hidrográficas da região.
Isso indica que, apesar dos desafios históricos, os investimentos públicos têm tido resultados positivos na universalização do acesso à água e melhoria na qualidade de vida da população.

Entre elas, em segundo lugar, está o Sul do país, região com altos índices sociais e uma economia agroindustrial bem desenvolvida. A Região Sul totalizou uma variação positiva de 97% para o período observado, tendo saído de 13,9 para 27,4 milhões de pessoas com acesso à água encanada.

## Evolução do número de pessoas atendidas com abastecimento de água, por Região, de 2001 a 2022.

<Image src="/blog/explorando-dados-do-saneamento-brasileiro-com-sql-usando-a-BD/grafico-1.png" caption="Fonte: SNIS. Elaboração própria." />

No gráfico acima, podemos perceber que, apesar da tendência positiva em todas as regiões, o Sudeste tem observado um declínio significativo de 2021 a 2022, onde o total regional foi reduzido de 81,8 para 76,9 milhões de pessoas (-6%).

Essa redução pode indicar um cenário de estresse na capacidade da cobertura hídrica, que é corroborado pelo crescimento desordenado das capitais regionais, em especial, São Paulo e Rio de Janeiro.
Segundo o [Censo de 2022](https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/41797-censo-2022-brasil-tinha-16-4-milhoes-de-pessoas-morando-em-favelas-e-comunidades-urbanas), essas cidades concentravam duas das 5 favelas mais populosas do Brasil, sendo elas: Rocinha (RJ), em 1º lugar, com 72 mil moradores; e Paraisópolis (SP), em 3º lugar, com 58,5 mil moradores.

As demais regiões, apesar de oscilações momentâneas, têm demonstrado uma tendência de estabilização, ou de um ritmo de crescimento mais lento, conforme aponta o gráfico. Isso não quer dizer, no entanto, que os seus problemas já foram resolvidos. Muito pelo contrário.

## Capitais Brasileiras, por percentual de abastecimento de água em relação à população, 2022.

<Image src="/blog/explorando-dados-do-saneamento-brasileiro-com-sql-usando-a-BD/grafico-2.png" caption="Fonte: SNIS. Elaboração própria." />

Uma avaliação das capitais do país, no que diz respeito ao índice de atendimento total de água (indicador que mede a porcentagem da população contemplada pela cobertura hídrica), nos evidencia que apesar dos esforços ao longo dos anos, as disparidades regionais persistem.

Das 27 capitais, as 5 com o pior índice de abastecimento de água estão localizadas no Norte e Nordeste do país, sendo que três delas: Macapá (AP), Rio Branco (AC) e Porto Velho (RO) — todas no Norte — são as únicas que registraram uma cobertura abaixo de 55%. Fortaleza e Maceió, que vêm logo após, registraram, respectivamente, 84,1% e 86,9% no percentual de abastecimento.

Em contraste, das 7 capitais que possuem cobertura hídrica igual a 100%, 4 estão localizadas no Sul e Sudeste: Porto Alegre (RS), Belo Horizonte (MG), Vitória (ES) e Curitiba (PR). Das outras 3 cidades, 2 são capitais do Centro-Oeste: Cuiabá (MT) e Campo Grande (MS). A outra é João Pessoa (PB), a única representação do Nordeste em cobertura integral no abastecimento de água.

...

Portanto, as análises dos dados aqui expostos revelam que, embora o Brasil, como um todo, tenha melhorado em relação ao acesso à água, ainda existem discrepâncias enormes entre as suas diferentes regiões.

Não é a intenção desse texto esgotar o assunto nem propor soluções definitivas. No entanto, é válido dizer que as colocações aqui trazidas não reforçam somente a necessidade de políticas públicas voltadas para a melhoria da gestão hídrica e ampliação da infraestrutura de saneamento do país, mas também suscitam debates acerca de questões multidisciplinares, como regulação do mercado imobiliário, direito à moradia e exclusão socioespacial.

Sendo assim, para a garantia de um futuro mais equitativo e sustentável, é fundamental que as políticas públicas se direcionem tanto às causas quanto aos sintomas desses problemas, de modo a planejar e executar soluções com alguma garantia de eficácia.