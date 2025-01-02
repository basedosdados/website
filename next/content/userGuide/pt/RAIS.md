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

Este é um guia de uso da Relação Anual de Informações Sociais (RAIS). Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto da RAIS 

# Introdução
Essa base possui 2 tabelas: 
* Microdados Estabelecimentos: cada linha representa um estabelecimento e suas características para cada ano de declaração
* Microdados Vínculos: cada linha representa um vínculo e suas características para cada ano de declaração

# Considerações para análises
**Colunas quantidade_vinculos_ativos e tamanho_estabelecimento**
As colunas quantidade_vinculos_ativos e tamanho_estabelecimento  da tabela de estabelecimentos tem informações discrepantes entre si. A primeira tem um valor inteiro representando o total de vínculos daquele estabelecimento, a segunda é uma categoria definida pelo total de vínculos, mas mesmo assim encontramos vários casos que a quantidade de vínculos não está dentro da faixa definida pelo tamanho do estabelecimento. Ainda não se sabe por que essa inconsistência. 

**Coerência entre RAIS e CAGED**
A base da RAIS deveria registrar todos os vínculos de trabalho uma vez ao ano, enquanto o CAGED seria responsável por todas as movimentações desses vínculos. Teoricamente, ao somar ou subtrair todas as movimentações registradas no CAGED a partir de um total de vínculos em um determinado ano dado pela RAIS, seria possível chegar ao total do ano seguinte. No entanto, isso não ocorre na prática. Ainda não sabemos porque isso ocorre, mas como os dois sistemas operam de forma independente, é provável que cada um acumule diferentes tipos de erros, o que resulta em divergências nos números.

**Coluna id_municipio_trabalho**
Os valores da  id_municipio_trabalho nos dados vínculos são só disponíveis nos anos 2005-2011 e 2017-2021. Não sabemos o porquê.

**Ponderação nos cálculos**
Esses são dados que incluem todos os vínculos empregatícios do Brasil, não existe necessidade de nenhum tipo de ponderação ou peso. Entretanto, assim como já levantamos na seção sobre linhas duplicadas é importante ressaltar que a tabela de Vínculos inclui todos os vínculos que uma empresa teve durante o ano. Assim, se algum empregado foi demitido e outro contratado dentro do mesmo ano, terão 2 linhas para a mesma posição naquela empresa. Caso o objetivo seja avaliar o total de empregados de um setor ou região é importante utilizar a coluna de vinculo_ativo_3112 para filtrar apenas os vínculos que estão ativos ao mesmo tempo.

# Observações ao longo tempo
A cada ano temos uma atualização da base, assim um estabelecimento aparece em todos os anos que seu cnpj estava ativo, assim como um mesmo vínculo aparece em mais de um ano se continuar ativo. Por conta da base ser desidentificada não é possível acompanhar a evolução dos vínculos ou empresas ao longo do tempo.

# Linhas Duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nessa base. Mas é importante ressaltar que a base de Vínculos inclui todos os vínculos que uma empresa teve durante o ano. 

# Cruzamentos
Essas tabelas são desidentificadas, ou seja, não temos as informações dos CNPJs nem dos CPFs envolvidos. Isso significa que não é possível fazer um cruzamento entre elas, nem com outras bases de dados que possuam cnpj. Esse conjunto de dados é interessante de ser cruzado com outras bases que possuem a informação de CNAE e de CEP, já que não é possível cruzar CNPJs. 

# Download dos dados
Essa base reúne todos os vínculos empregatícios do país desde 1984, totalizando mais de 350 GB de dados armazenados. O volume é grande demais para ser processado em uma máquina comum, tornando indispensável o uso de ferramentas como o BigQuery. Para otimizar o trabalho, recomendamos aplicar filtros nas colunas de partição, como ano e sigla_uf, e selecionar apenas as colunas relevantes para sua análise antes de fazer o download dos dados. Se precisar de todos os anos ou quase todos os estados, recomendamos fazer agregações de seu interesse antes do download. 

# Instituição responsável
Ministério do Trabalho e Emprego (MTE)

# Instrumento de coleta
O instrumento de coleta atual é um formulário que deve ser preenchido pelos empregadores do país sobre seus empregados. 

# Mudanças na coleta
Algumas colunas pararam de ser coletadas e outras foram incluídas ao longo do tempo. Para obter os detalhes de quais colunas entraram e saíram ver a coluna de cobertura temporal da coluna no site

# Atualizações
Às vezes os dados da RAIS são atualizados fora do calendário esperado e nossa equipe nem sempre fica sabendo. Se você está confiante que está fazendo as queries certas, entra em contato conosco enviando a query e a diferença com o site oficial para que a gente possa avaliar a situação e, se necessário, corrigir. 

# Tratamentos feitos pela BD:
O tratamento das duas tabelas do conjunto é muito similar: 
Alterou as colunas que identificam municípios para o padrão de ID Município IBGE - 7 Dígitos
Alterou colunas que identificam Unidades Federativas para o padrão de sigla
Alterou códigos de bairros, cbo, cnae e ano que são considerados inválidos (estilo ‘9999’ ou ‘000’) para vazio
Ajustou o conteúdo da coluna  tipo_estabelecimento  para que os códigos ficassem padronizado entre anos

# Materiais de apoio
[Manual de Orientação](http://www.rais.gov.br/sitio/rais_ftp/ManualRAIS2023.pdf): Tem todas as instruções de como os empregadores devem preencher os campos. Ajuda a compreender o que cada campo representa com mais detalhe. 
[Site do MTE](http://www.rais.gov.br/sitio/sobre.jsf): Várias informações detalhadas sobre a RAIS 