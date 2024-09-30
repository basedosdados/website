---
title: Análise da Atividade Econômica do Estado do Rio de Janeiro e da influência da capital
description: Explorando dados da RAIS para analisar as principais atividades econômicas do estado e sua relação com a capital
date:
  created: '2024-04-10T15:00:00'
authors:
  - name: Laryssa Bertin Ribeiro
    role: Autora
    social: https://medium.com/@lary.bertin
thumbnail: /blog/analise-da-atividade-economica-do-estado-do-rio-de-janeiro-e-da-influencia-da-capital/image_4.webp
categories: [analise]
medium_slug: >-
  https://medium.com/basedosdados/an%C3%A1lise-da-atividade-econ%C3%B4mica-do-estado-do-rio-de-janeiro-e-da-influ%C3%AAncia-da-capital-95ed6b5910b5
---

## TL;DR

Este relatório apresenta uma investigação detalhada sobre os dados relacionados às principais atividades econômicas do Estado do Rio de Janeiro, focando na relação com sua capital.

O estudo também avalia a dinâmica da geração dos empregos ativos ao longo de um período determinado. Utilizando dados da [Relação Anual de Informações Sociais](https://basedosdados.org/dataset/3e7c4d58-96ba-448e-b053-d385a829ef00?table=c3a5121e-f00d-41ff-b46f-bd26be8d4af3) (RAIS), o trabalho emprega análises estatísticas para compreender a evolução desses padrões e suas implicações na relação com os demais municípios do estado do Rio de Janeiro.

> Este artigo foi produzido como Projeto Final do Curso de Análise de Dados Públicos com SQl e Sheets, da Base dos Dados. Para saber mais sobre o curso, acesse [aqui](https://info.basedosdados.org/bd-edu-sql)

## Introdução

Segundo a [Pesquisa Mensal de Emprego](https://www.data.rio/documents/4e6901873b314e2bacce25f8645046bd/explore) (PME), do IBGE, em 2016 o grupamento _Educação, Saúde e Administração Pública_ ocupava 23,3% dos empregos na cidade do Rio de Janeiro (680 mil); _Outros Serviços_ empregavam 19,9% (581 mil); os _Serviços Prestados às Empresas_, 18,7% (548 mil); o _Comércio_, 17,0% (496 mil); a Indústria,11,2% (328 mil); a _Construção_, 5,7% (166 mil) e os _Serviços Domésticos_, 3,7% (108 mil).

Segundo o IBGE, em fevereiro de 2016 haviam 5 milhões e 910 mil pessoas em idade ativa (PIA) no Município do Rio de Janeiro. Essa população ficou ligeiramente estável durante o ano. Desse total de pessoas em idade ativa, 49,4% encontravam-se ocupadas (nível de ocupação), 2,7% desocupadas e 47,8% não estavam economicamente ativas. O rendimento médio real da população ocupada no município foi estimado em R$ 3.038,40, o que traduzia a renda per capita do carioca.

Em relação à população ocupada, os empregados com carteira assinada no setor privado representaram 47,0% (1.373 mil), os empregados sem carteira assinada no setor privado, 7,2% (210 mil), os trabalhadores por conta própria, 21,8% (636 mil) e os Militares ou funcionários públicos estatutários, 13,5% (395 mil).

Os CNAEs foram oficializados através da Resolução do IBGE/CONCLA (Figura 1), do dia 4 de setembro de 2006. Direcionada tecnicamente pelo IBGE (Instituto Brasileiro de Geografia e Estatística), o CNAE é coordenado pela Secretaria da Receita Federal. Formado por uma combinação de 7 números, eles representam a junção de seções, grupos, divisões, classes e subclasses.

A primeira versão do detalhamento das subclasses CNAE foi definida em 1998, com a denominação CNAE-Fiscal. Passou por ajustes em 2001 (versão CNAE-Fiscal 1.0) e em 2002 (versão CNAE-Fiscal 1.1), esta última acompanhando alterações pontuais na estrutura da CNAE (versão CNAE 1.0) em função de ajustes na classificação internacional versão ISIC/CIIU 3.1 (Figura 2).

<Image src="/blog/analise-da-atividade-economica-do-estado-do-rio-de-janeiro-e-da-influencia-da-capital/image_0.webp"/>

## Metodologia

Este estudo baseia-se na análise de dados provenientes da base [Relação Anual de Informações Sociais](https://ftp.ibge.gov.br/Trabalho_e_Rendimento/Pesquisa_Mensal_de_Emprego/Municipio_RJ/Comentarios/2016/pme-rj_201602comentarios.pdf) (RAIS), que é um relatório de informações socioeconômicas solicitado pela Secretaria de Trabalho do Ministério da Economia brasileiro às pessoas jurídicas e outros empregadores anualmente. O relatório possui periodicidade anual e apresenta informações sobre todos os estabelecimentos formais e vínculos celetistas e estatutários no Brasil. A geração das estatísticas da RAIS 2021 contou, portanto, com duas fontes de captação de dados: o eSocial e o GDRAIS, com as seguintes definições:

- **Estoque de empregos formais**: Diz respeito ao número de vínculos ativos em 31/12 do ano anterior, ou seja, um retrato do mercado de trabalho.
- **Estabelecimentos**: A obrigatoriedade de declaração da RAIS é por cada estabelecimento, permitindo análise de suas principais características como: setor de atividade econômica, natureza jurídica e localização geográfica. Desde 1995, os estabelecimentos sem empregados passaram a ser obrigados a enviar a chamada RAIS negativa.
- **Grupamento de Atividades Econômicas**: Classificação derivada da agregação das Seções da Classificação Nacional de Atividades Econômicas (CNAE2.0).

Foram utilizadas consultas SQL e o datalake público da Base dos Dados, que pode ser acessado pela plataforma BigQuery para coletar e visualizar os dados relevantes. A consulta SQL específica utilizada para extrair os dados necessários para a análise básica, que trata dos vínculos ativos no período de 2018 a 2022 para cada CNAE no estado do Rio de Janeiro, está apresentada abaixo:

__Consulta A__

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

<Image src="/blog/analise-da-atividade-economica-do-estado-do-rio-de-janeiro-e-da-influencia-da-capital/image_1.webp" caption="Tabela A1: Empregos por CNAEs, estado do Rio de Janeiro, 2018 a 2022"/>

__Consulta B__

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

## Desenvolvimento e resultados

A economia de uma região geográfica influencia a quantidade de empregos gerados. A cidade do Rio de Janeiro possui uma grande região metropolitana e uma grande influência em outras cidades do estado.

Um dos objetivos da **Consulta A** foi identificar as atividades econômicas que representam mais de 50% dos empregados gerados no estado do Rio de Janeiro. A pesquisa estabeleceu como uma linha de corte para efeitos dessa pesquisa 35 CNAEs, de um total de 1.318, com 52,82% do estoque total de empregos no início de 2022 conforme a **Tabela A1**.

Dessa forma, o**Gráfico A** foi gerado para identificar as principais atividades econômicas geradoras de empregos no estado do Rio de Janeiro a partir da **Tabela A2,** que apresenta os grupamentos das principais atividades econômicas.

<Image src="/blog/analise-da-atividade-economica-do-estado-do-rio-de-janeiro-e-da-influencia-da-capital/image_2.webp" caption="Gráfico A: Principais atividades econômicas com mais de 50% dos empregos"/>

<Image src="/blog/analise-da-atividade-economica-do-estado-do-rio-de-janeiro-e-da-influencia-da-capital/image_3.webp" caption="Tabela A2: Empregos por Grupamentos, estado do Rio de Janeiro"/>

Um dos objetivos da **Consulta B** foi identificar as principais atividades econômicas que geraram mais empregos na cidade do Rio de Janeiro, conforme é possível observar na **Tabela B**. Com o somatório do total de empregos gerados no estado e na cidade ao longo do período 2018 a 2022, foi possível elaborar o **Gráfico B** para identificar sua relação dinâmica.

O DataMPE Brasil, serviço para a produção e disseminação de dados e informações relevantes para o desenvolvimento dos pequenos negócios criado pelo SEBRAE Rio de Janeiro, utilizando os dados da Relação Anual de Informações Sociais (RAIS), identificou que o número de empregados cadastrados no estado foi 3.938.871 em 2021, o que representa uma variação de 4.56% em relação ao ano anterior. A remuneração média do trabalhador no ano de 2021 foi de R$ 2.333,58, e o número de estabelecimentos cadastrados foi 560.871, o que representa uma variação de 2.84% em relação ao ano anterior.

No Estado de Rio De Janeiro, os setores econômicos que mais reuniram trabalhadores em 2021 foram a _Administração Pública_, _Defesa e Seguridade Social_ (730.013), o _Comércio Varejista_ (598.989), e _Educação_ (231.811).

No mesmo ano, 42.9% dos trabalhadores eram mulheres, com uma remuneração média por pessoa de R$ 3186,91; 57.1% correspondiam a homens, com remuneração média de R$ 3780,99.

De acordo com os dados da Receita Federal do Brasil (RFB), do total de estabelecimentos com registro até 2023, 10.3% correspondem a _Outros_ (214.564 estabelecimentos), 62.8% correspondem a _Micro Empresário Individual_ _(MEI)_ (1.312.029 estabelecimentos), 22.5% correspondem a _Microempresa (ME)_ (470.895 estabelecimentos), e 4.44% correspondem a _Empresa de Pequeno Porte (EPP)_ (92.755 estabelecimentos).

Cerca de 13,2 milhões de pessoas trabalhavam como microempreendedores individuais (MEIs) no Brasil em 2021, o equivalente a 69,7% do total de empresas e outras organizações e 19,2% do total de ocupados formais. Em 2021, do total de 673 classes da CNAE 2.0, o MEI esteve presente em 206. Mais da metade dos MEIs (55,7%) estão presentes nas 15 primeiras classes e quase 75% nas 30 primeiras. Cerca de metade dos MEIs (50,2%) estava presente no setor de Serviços em 2021. O Comércio ‘reparação de veículo automotores e motocicletas’ respondeu por 29,3%, sendo essa atividade a que apresentou o maior quantitativo de empregados dos MEIs (48,3%).

O Rio de Janeiro foi a unidade da federação com maior proporção de MEIs em relação ao total de ocupados formais (26%), seguida pelo Espírito Santo (24,8%).

Consultamos o site da [Receita federal](https://www8.receita.fazenda.gov.br/simplesnacional/aplicacoes/atbhe/estatisticassinac.app/EstatisticasOptantesPorCNAE.aspx?tipoConsulta=2&optanteSimei=&anoConsulta=MjAyMg%3D%3D) que contém informações sobre a quantidade de MEIs por CNAE. A pesquisa encontrou 35 CNAEs com 67,42% do total de microempresários individuais em 18/11/2023.

<Image src="/blog/analise-da-atividade-economica-do-estado-do-rio-de-janeiro-e-da-influencia-da-capital/image_4.webp" caption="Gráfico B: Relação de emprego cidade/estado do Rio de Janeiro"/>

## Conclusão

A análise revela a significativa influência das atividades econômicas ligadas à Administração Pública no panorama econômico do Estado do Rio de Janeiro, evidenciada pelo **Gráfico A**. É plausível que muitas dessas atividades sejam conduzidas por empresas que oferecem serviços técnicos ou administrativos complementares às entidades estatais, organizações públicas e governos municipais e estaduais.

Para avançar no entendimento desse cenário, futuras pesquisas podem se concentrar na identificação dos centros de influência das atividades econômicas públicas, possibilitando comparações com os padrões de distribuição salarial em todo o estado do Rio de Janeiro.

Além disso, o **Gráfico B** sugere uma correlação econômica entre o estado do Rio de Janeiro e sua capital. Para aprofundar essa análise, é fundamental expandir a série histórica e realizar comparações mais abrangentes das atividades econômicas em pesquisas futuras.
