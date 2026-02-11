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

> O guia contém informações detalhadas sobre os dados. Para dúvidas sobre acesso ou uso da plataforma, consulte nossa [página de Perguntas Frequentes](/faq).

Este conjunto de dados possui duas tabelas de microdados: 
- **Microdados Estabelecimentos:** Cada linha representa um estabelecimento em um ano específico. As colunas mostram detalhes sobre a empresa e seus empregados.
- **Microdados Vínculos:** Cada linha representa um vínculo de trabalho em um ano específico. As colunas mostram informações sobre o vínculo, o empregado e a empresa contratante.

# Considerações para análises
## Vínculos e filtragem de dados
A tabela de vínculos mostra todos os vínculos registrados por uma empresa durante o ano. Se um empregado for demitido e outro contratado no mesmo ano, ambos terão uma registro de vínculo para a mesma posição. Para contar os empregados ativos em um setor ou região, use a coluna `vinculo_ativo_3112`.

## Informações de endereço
A RAIS não possui informações sobre o endereço dos empregados. A coluna `id_municipio` se refere ao município da empresa, e a coluna `id_municipio_trabalho` se refere ao município onde o trabalhador presta serviços, caso seja diferente.

## Dados parciais e dados completos
A RAIS é divulgada duas vezes ao ano. Entre a divulgação parcial (setembro) e a completa (início do ano seguinte), o último ano da série sempre aparece com menos registros. Por exemplo, em novembro de 2025, o ano de 2024 mostra cerca de 46 milhões de vínculos, enquanto 2022 e 2023 têm mais de 50 milhões. Isso não significa que o número de vínculos caiu — só quer dizer que os dados de 2024 ainda não foram totalmente liberados.

# Limitações
Os dados são limitados a trabalhadores com vínculo formal e não incluem trabalhadores informais ou autônomos. Os dados públicos são anonimizados.

# Inconsistências
## Colunas `quantidade_vinculos_ativos` e `tamanho_estabelecimento`
Há discrepâncias entre as colunas `quantidade_vinculos_ativos` e `tamanho_estabelecimento`. A primeira mostra o total de vínculos, enquanto a segunda classifica o estabelecimento por número de vínculos. Em alguns casos, a quantidade de vínculos não corresponde à categoria do tamanho do estabelecimento.

## Vínculos de trabalho na RAIS e no CAGED
A RAIS registra vínculos de trabalho anualmente e o CAGED registra movimentações durante o ano. Teoricamente, somando ou subtraindo as movimentações do CAGED ao total de vínculos da RAIS, seria possível calcular o total do ano seguinte, mas isso não acontece. Como os sistemas operam de forma independente, as divergências podem ser causadas por erros acumulados em cada um. 

## Coluna id_municipio_trabalho
A coluna `id_municipio_trabalho` está preenchida apenas entre 2005-2011 e 2017-2021. Não se sabe o motivo.  

## Dados desatualizados
Às vezes, os dados da RAIS são atualizados fora do calendário esperado e nossa equipe nem sempre fica sabendo. Se você está confiante de que está fazendo as queries corretas, entre em contato conosco enviando a query e a diferença com o site oficial, para que possamos avaliar a situação e, se necessário, corrigir.  

# Observações ao longo tempo
A cada ano, o conjunto de dados é atualizado, fazendo com que um estabelecimento ou vínculo apareça em todos os anos em que esteve ativo. Como os dados são anonimizados, não é possível acompanhar a evolução de vínculos ou empresas ao longo do tempo, mas é possível analisar o número de empregados com carteira de trabalho em diferentes setores ou locais.

# Linhas duplicadas
Não foram encontradas linhas duplicadas neste conjunto de dados. No entanto, a tabela Microdados Vínculos inclui todos os vínculos de uma empresa, então, se um empregado foi demitido e outro contratado no mesmo ano, terão duas linhas para a mesma posição.

# Cruzamentos
Os dados são anonimizadas, não contendo CNPJs nem CPFs. Isso limita os cruzamentos com outros conjuntos, mas é possível usar colunas como `cnae` e `cep` para tal.

# Download dos dados
Os microdados somam mais de 350 GB. Para evitar sobrecarregar seu computador, recomendamos usar queries no BigQuery para processar os dados em nuvem antes de baixá-los. Filtre pelas colunas de partição (como `ano` e `sigla_uf`) e selecione apenas as colunas relevantes.

# Instrumento de coleta
O instrumento de coleta atual é um formulário que deve ser preenchido pelos empregadores sobre seus empregados.

# Mudanças na coleta
Algumas colunas foram adicionadas ou retiradas ao longo do tempo. A partir do ano de 2022 as empresas do grupo 3 do eSocial ficaram desobrigadas a declarar a RAIS pelo seu programa usual. Assim não é recomendável a comparação dos resultados desse ano com os resultados do anos anteriores.

# Atualizações
Os dados têm atualização parcial e completa. A atualização parcial ocorre em setembro do ano de coleta e a completa ocorre até o início do ano seguinte ao ano de coleta. Isso significa que os dados referentes a 2023, que foram coletados em 2024, ficaram parcialmente disponíveis em setembro de 2024 e a versão completa foi disponibilizada até o início de 2025. Às vezes, a atualização pode ocorrer fora do calendário previsto. Se perceber que os dados estão desatualizados, entre em contato com nossa equipe.

# Dados identificados
Os dados são anonimizados, não contendo CNPJs nem CPFs. Para obter dados identificados da RAIS, é necessário solicitar ao MTE. O processo pode ser demorado e não há garantia de aprovação.

# Tratamentos feitos pela BD
Neste guia, os tratamentos são descritos em uma linguagem mais acessível. De maneira complementar, os [códigos de tratamento](https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_rais/code) e as [modificações feitas no BigQuery](https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_rais) estão disponíveis no repositório do GitHub para consulta. 
Os tratamentos realizados foram: 
* Adequação das colunas que identificam municípios ao formato ID Município IBGE (7 dígitos);
* Adequação das colunas que identificam Unidades Federativas ao padrão de sigla UF;
* Substituição de códigos inválidos (como “9999” ou “000”) por valores nulos nas colunas de `bairros`, `cbo`, `cnae` e `ano`;
* Padronização dos códigos na coluna `tipo_estabelecimento` para garantir consistência entre diferentes anos.

# Materiais de apoio
* [Manual de orientação para os empregadores sobre como preencher os campos do formulário](http://www.rais.gov.br/sitio/rais_ftp/ManualRAIS2023.pdf)
* [Informações detalhadas sobre a RAIS no site do MTE](http://www.rais.gov.br/sitio/sobre.jsf)
* [Dashboard do MTE com números consolidados da RAIS completa](https://app.powerbi.com/view?r=eyJrIjoiZmJmMDVhODctMTEwOS00YTVhLWJhNzItOWE3NmVlMWEwMTUxIiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9)
* [Dashboard do MTE com números consolidados da RAIS parcial](https://app.powerbi.com/view?r=eyJrIjoiNjk3M2IwZDYtOGQzMS00YmE1LWE3M2MtZWRjODA4NTk3YTQ2IiwidCI6IjNlYzkyOTY5LTVhNTEtNGYxOC04YWM5LWVmOThmYmFmYTk3OCJ9)
* [Sistema Dardo: sistema que utilizamos para validação das tabelas disponibilizadas](https://bi.mte.gov.br/bgcaged/)
