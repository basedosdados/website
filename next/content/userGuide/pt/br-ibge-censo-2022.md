---
title: Guia de uso do conjunto do Censo 2022
description: >-
  Guia de uso da Relação Anual de Informações Sociais (RAIS). Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto da RAIS 
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---

# Introdução

> Este é um guia de uso da Relação Anual de Informações Sociais (RAIS). Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto da RAIS 

Essa base possui 2 tabelas com microdados: 
- **Microdados Estabelecimentos:** Cada linha representa um estabelecimento em um determinado ano. As colunas descrevem características sobre a empresa e seus empregados
- **Microdados Vínculos:** Cada linha representa um vínculo de trabalho em um determinado ano. As colunas descrevem características sobre o tipo do vínculo, do empregado e da empresa contratante.

# Considerações para análises
## Vínculos e filtragem de dados
A tabela de Vínculos inclui todos os vínculos registrados por uma empresa durante o ano. Portanto, se um empregado foi demitido e outro contratado no mesmo ano, ambos terão uma linha para a mesma posição na empresa. Caso o objetivo seja avaliar o total de empregados ativos em um setor ou região, é necessário utilizar a coluna `vinculo_ativo_3112` para filtrar apenas os vínculos que estão ativos na data mencionada.

# Limitações
* Os dados disponibilizados são limitados a trabalhadores com vínculo empregatício formal, não incluindo informações sobre trabalhadores informais ou autônomos.
* Os dados públicos são anonimizados

# Inconsistências
## Colunas quantidade_vinculos_ativos e tamanho_estabelecimento
As colunas `quantidade_vinculos_ativos` e `tamanho_estabelecimento` da tabela de estabelecimentos têm informações discrepantes entre si. A primeira tem um valor inteiro representando o total de vínculos daquele estabelecimento, e a segunda é uma categoria definida pelo total de vínculos. No entanto, encontramos vários casos em que a quantidade de vínculos não está dentro da faixa definida pelo tamanho do estabelecimento. Ainda não se sabe por que essa inconsistência ocorre.  


# Observações ao longo tempo
Nessas tabelas não é possível fazer o acompanhamento de variáveis ao longo do tempo, para realizar comparações entre anos é necessário agregar os microdados disponíveis no conjunto de microdados do Censo.

# Linhas duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nas tabelas desse conjunto

# Cruzamentos
As tabelas do censo podem ser cruzadas com outras utlizando os recortes geográficos, temos as informações geolocalizadas para setor censitário. O cruzamento com outras bases que tenham informações de municípios também é possível. 

# Download dos dados
A maior parte das tabelas do censo não são muito grandes, algumas delas é possível fazer o download direto pela nossa plataforma, outras é necessário fazer o download via python ou R. 

# Instrumento de coleta
A coleta das informações foi conduzida, em geral, através de entrevista presencial (entrevista direta – face a face – com os moradores do domicílio). Além desta modalidade tradicional, para o Censo Demográfico 2022 abriu-se a possibilidade de coleta por meio da Internet. O Recenseador poderia oferecer essa alternativa a pedido do morador; ou quando houvesse restrições de acesso a áreas específicas, por exemplo, no caso de condomínios fechados; ou quando fosse encontrada qualquer outra dificuldade para fazer a coleta na modalidade entrevista presencial. Houve também um aumento de coleta nos Povos e Comunidades Tradicionais, onde pesquisou-se, pela primeira vez, as comunidades quilombolas.

# Mudanças na coleta
Como os dados desse conjunto se referem apenas a 2022 a metodologia de coleta é a mesma para todo o conjunto

# Atualizações
Os dados do censo 2022 não tem atualizações, porém o IBGE disponibiliza novos conjuntos de dados frequentemente. Os próximos conjuntos a serem estão programados conforme o [calendário](https://censo2022.ibge.gov.br/panorama/calendario.html?localidade=BR) 

# Tratamentos feitos pela BD
O tratamento nas tabelas é minimo: 
* Inclusão do id_municipio 
* União das informações de domicilios, população, area, taxa de alfabetização, idade mediana, indice de envelhecimento, população indígena, população quilombola em uma única tabela de município 
* Criação da coluna `idade_anos`e `grupo_idade` para facilitar operações numéricas nas tabelas que contém a informação de idade

# Materiais de apoio
* [Notas técnicas sobre o censo 2022](https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html?=&t=notas-tecnicas): Informações relevantes sobre como cada parte da pesquisa foi conduzida, muito importante para obter contexto e útil para inspiração de análises.



