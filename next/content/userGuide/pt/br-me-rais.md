---
title: Guia de uso da RAIS
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

Essa base possui 2 tabelas: 
* Microdados Estabelecimentos: cada linha representa um estabelecimento e suas características para cada ano de declaração
* Microdados Vínculos: cada linha representa um vínculo e suas características para cada ano de declaração

# Considerações para análises
## Vínculos e filtragem de dados
A tabela de Vínculos inclui todos os vínculos registrados por uma empresa durante o ano. Portanto, se um empregado foi demitido e outro contratado no mesmo ano, ambos terão uma linha para a mesma posição na empresa. Caso o objetivo seja avaliar o total de empregados ativos em um setor ou região, é necessário utilizar a coluna `vinculo_ativo_3112` para filtrar apenas os vínculos que estão ativos na data mencionada.

## Informações de endereço
Segundo o manual de preenchimento da RAIS, o empregado não fornece informações sobre seu endereço. O campo `id_municipio` se refere ao município da empresa contratante, enquanto `id_municipio_trabalho` é utilizado quando o trabalhador presta serviços fora do município da empresa contratante.

# Limitações
* Os dados disponibilizados são limitados a trabalhadores com vínculo empregatício formal, não incluindo informações sobre trabalhadores informais ou autônomos.
* Os dados públicos são anonimizados

# Inconsistências
## Colunas quantidade_vinculos_ativos e tamanho_estabelecimento
As colunas `quantidade_vinculos_ativos` e `tamanho_estabelecimento` da tabela de estabelecimentos têm informações discrepantes entre si. A primeira tem um valor inteiro representando o total de vínculos daquele estabelecimento, e a segunda é uma categoria definida pelo total de vínculos. No entanto, encontramos vários casos em que a quantidade de vínculos não está dentro da faixa definida pelo tamanho do estabelecimento. Ainda não se sabe por que essa inconsistência ocorre.  

## Coerência entre RAIS e CAGED
A base da RAIS deveria registrar todos os vínculos de trabalho uma vez ao ano, enquanto o CAGED seria responsável por todas as movimentações desses vínculos. Teoricamente, ao somar ou subtrair todas as movimentações registradas no CAGED a partir de um total de vínculos em um determinado ano dado pela RAIS, seria possível chegar ao total do ano seguinte. No entanto, isso não ocorre na prática. Ainda não sabemos por que isso acontece, mas como os dois sistemas operam de forma independente, é provável que cada um acumule diferentes tipos de erros, resultando em divergências nos números.  

## Coluna id_municipio_trabalho
Os valores de `id_municipio_trabalho` nos dados de vínculos estão disponíveis apenas nos anos de 2005-2011 e 2017-2021. Não sabemos o motivo.  

## Dados desatualizados
Às vezes, os dados da RAIS são atualizados fora do calendário esperado, e nossa equipe nem sempre fica sabendo. Se você está confiante de que está fazendo as queries corretas, entre em contato conosco enviando a query e a diferença com o site oficial, para que possamos avaliar a situação e, se necessário, corrigir.  

# Observações ao longo tempo
A cada ano, a base é atualizada, o que faz com que um estabelecimento apareça em todos os anos em que o seu CNPJ esteve ativo. Da mesma forma, um vínculo pode aparecer em mais de um ano se continuar ativo. Como a base é desidentificada (não contém o CNPJ nem o CPF), não é possível acompanhar a evolução dos vínculos ou das empresas ao longo do tempo. O que pode ser analisado é o crescimento ou a redução do número de funcionários com carteira em um determinado setor (CNAE), endereço (CEP), função (CBO) ou outras combinações de diferentes colunas disponibilizadas.

# Linhas duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nessa base. Mas é importante ter claro que a base de Vínculos inclui todos os vínculos que uma empresa teve durante o ano. Assim, se algum empregado foi demitido e outro contratado dentro do mesmo ano, terão 2 linhas para a mesma posição naquela empresa.

# Cruzamentos
Essas tabelas são desidentificadas, ou seja, não temos as informações dos CNPJs nem dos CPFs envolvidos. Isso significa que não é possível fazer um cruzamento entre elas, nem com outras bases de dados que possuam CNPJ. Assim, esse conjunto de dados é interessante de ser cruzado com outras bases através das colunas de CNAE ou de CEP, como o CAGED. 

# Download dos dados
A tabela da RAIS disponibilizada pela BD contém todos os vínculos empregatícios do país desde 1984, o que representa mais de 350 GB armazenados. Um computador normal costuma não ter capacidade de processamento para essa quantidade de dados, por isso é necessário primeiro trabalhar com queries no bigquery (que tem processamento em nuvem) e fazer filtros e agregações antes de baixar os dados. Recomendamos fazer filtros utilizando as colunas de partições (ano, sigla_uf) e selecionar apenas as colunas que sejam do seu interesse.

# Instituição responsável
Ministério do Trabalho e Emprego (MTE)

# Instrumento de coleta
O instrumento de coleta atual é um formulário que deve ser preenchido pelos empregadores do país sobre seus empregados. 

# Mudanças na coleta
Algumas colunas pararam de ser coletadas e outras foram incluídas ao longo do tempo. Para obter os detalhes de quais colunas entraram e saíram ver a coluna de cobertura temporal da coluna no site

# Atualizações
Normalmente, a base completa é atualizada no início do ano seguinte ao período de coleta. Isso significa que os dados referentes a 2022 só estarão disponíveis no início de 2024. O MTE libera primeiro os dados parciais e, posteriormente, os completos. No entanto, ocasionalmente, as atualizações da RAIS (tanto parciais quanto completas) ocorrem fora do calendário previsto, e nossa equipe pode não ser informada a tempo. Se você perceber que nossos dados estão desatualizados, entre em contato conosco.

# Dados identificados
Para obter os dados identificados da RAIS, é preciso realizar uma solicitação por meio deste link ao Ministério do Trabalho. Contudo, vale destacar que o processo pode ser demorado e não há garantia de aprovação.

# Comparação com o dashboard do MTE
Caso os dados do nosso sistema não coincidam com os apresentados no [dashboard](https://app.powerbi.com/view?r=eyJrIjoiYTJlODQ5MWYtYzgyMi00NDA3LWJjNjAtYjI2NTI1MzViYTdlIiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9) do MTE, é importante esclarecer que utilizamos a base diretamente do FTP do MTE. Por isso, ainda não conseguimos identificar quais agrupamentos ou cálculos foram aplicados às variáveis na construção do dashboard.

# Tratamentos feitos pela BD
O tratamento das duas tabelas do conjunto é muito similar: 
* Padronização das colunas que identificam municípios para o formato ID Município IBGE (7 dígitos).
* Adequação das colunas que identificam Unidades Federativas ao padrão de Sigla UF.
* Substituição de códigos inválidos(como “9999” ou “000”) por valores nulos nas colunas de bairros, CBO, CNAE e ano.
* Padronização dos códigos na coluna `tipo_estabelecimento` para garantir consistência entre diferentes anos.

Caso queira entender melhor o tratamento: https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_rais/code

# Materiais de apoio
* [Manual de Orientação](http://www.rais.gov.br/sitio/rais_ftp/ManualRAIS2023.pdf): Tem todas as instruções de como os empregadores devem preencher os campos. Ajuda a compreender o que cada campo representa com mais detalhe. 
* [Site do MTE](http://www.rais.gov.br/sitio/sobre.jsf): Várias informações detalhadas sobre a RAIS 




