---
title: Guia de uso dos dados de CNPJ
description: >-
  Guia de uso dos dados de CNPJ. Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto da RAIS 
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

Esse conjunto possui quatro tabelas de microdados:  
- **Empresas:** Cada linha representa uma empresa e seus atributos. As colunas descrevem seus atributos, como natureza jurídica e tipo de quadro societário. 
- **Sócios:** Cada linha representa um sócio de uma empresa. As colunas descrevem características do sócio e qualificam a sua relação com a empresa.
- **Estabelecimentos:** Cada linha representa um estabelecimento de operação de uma empresa. As colunas detalham informações sobre localização, atividade econômica e informações de contato.
- **Simples:** Cada linha representa uma empresa e indica se a empresa está no Simples Nacional ou MEI.  

A tabela que relaciona todas elas é a tabela Empresas. Uma empresa pode ter vários sócios, vários estabelecimentos e pode ser qualificada como Simples Nacional ou MEI. 

As tabelas Empresas, Sócios e Estabelecimentos são divulgadas no formato de fotografias. Para cada data, tem-se um retrato do Cadastro Nacional das Pessoas Jurídicas (CNPJs) e seus atributos.

# Considerações para análises
## Diferença entre estabelecimentos e empresas
Uma empresa pode ter vários estabelecimentos. A coluna `cnpj_basico` se refere à empresa, e a coluna `cnpj` se refere ao estabelecimento. Logo, a coluna `cnpj_basico` da empresa se repete em proporção ao número de estabelecimentos na tabela Estabelecimentos. Algumas informações da tabela Empresa, como a natureza jurídica, podem ser atribuídas aos estabelecimentos. Para isso, é necessário cruzar os dados da tabela empresa com os de seus estabelecimentos.

## Filtrando CNPJs ativos
Para filtrar apenas os CNPJs ativos, use a coluna `situacao_cadastral`.

# Limitações
Os dados estão disponíveis apenas a partir de 23-11-2021. Registros anteriores a essa data não podem ser acessados. Porém, a base é cumulativa e não exclui registros. Ela apenas atualiza a situação cadastral e os atributos dos CNPJs. Assim, mesmo sem poder acompanhar mudanças antes de 23-11-2021, é possível consultar todos os CNPJs já abertos no Brasil.

# Inconsistências
Ainda não temos reportadas inconsistências

# Observações ao longo tempo
Os dados são divulgados no formato de fotografias. Para cada data, tem-se um retrato do CNPJs e seus atributos. Com exceção da tabela Simples, a coluna data informa a data na qual os dados foram extraídos. Os dados anteriores a 2021-11-23 são apresentados com o status dessa data.

# Linhas duplicadas
Na maioria dos arquivos disponíveis pela Receita Federal, há apenas algumas dezenas de linhas duplicadas nos dados. Essas duplicações vêm da fonte original e representam menos de 0,1% do total, o que normalmente não afeta as análises.

No entanto, em duas datas específicas, os arquivos da Receita Federal contêm um número significativo de linhas duplicadas::
  - Tabela socios na data 2024-09-18: foram encontradas 4.625.789 linhas duplicadas
  - Tabela estabelecimentos na data 2024-10-16: foram encontradas 8.100.851 linhas duplicadas
Essas linhas duplicadas não foram removidas das tabelas. Durante os testes de integridade, percebeu-se que o número de CNPJs únicos foi menor do que o registrado em datas anteriores. Isso indica que as duplicações podem ter substituído CNPJs que deveriam estar presentes nas tabelas.

# Cruzamentos
As tabelas podem ser cruzadas usando as colunas `cnpj_básico` e `data`.  É necessário entender as chaves únicas de cada tabela para evitar duplicações.

# Download dos dados
Os microdados somam mais de 300 GB. Para evitar sobrecarregar seu computador, recomendamos usar queries no BigQuery para processar os dados em nuvem antes de baixá-los. Filtre pelas colunas de partição (como ano e UF) e selecione apenas as colunas relevantes.

# Instrumento de coleta
O instrumento de coleta atual é o Documento Básico de Entrada (DBE), usado pela Receita Federal para registrar, alterar ou encerrar o cadastro de pessoa jurídica.
  
# Mudanças na coleta
Não houve mudanças na metodologia de coleta desde 2021 até o momento de elaboração deste guia (08-01-2025).

# Atualizações
Os dados são atualizados após o dia 15 de cada mês. Nossa plataforma realiza verificações automáticas diárias para atualizações.

# Dados identificados
Os dados de CPF dos sócios são disponibilizados de maneira anonimizada. Não é possível obter a base identificada. 

# Tratamentos feitos pela BD:
Neste guia, os tratamentos são descritos em uma linguagem mais acessível. De maneira complementar, os [códigos de tratamento](https://github.com/basedosdados/pipelines/blob/main/pipelines/datasets/br_me_cnpj/tasks.py#L50C1-L50C74) e as [modificações feitas no BigQuery](https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_me_cnpj) estão disponíveis no repositório do GitHub para consulta.

## Tabela Empresas
- Troca de ',' por '.' na coluna `capital_social`
- Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna `cnpj_basico`
- Preenchimento de zeros (0) a esquerda com comprimento máximo de 4 dígitos na coluna `natureza_juridica`

## Tabela Sócios
- Adequação da coluna `data_entrada_sociedade` ao padrão ano-mês-dia (%Y-%m-%d)
- Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna `cnpj_basico`
- Troca valor que identifica valores nulos de cpf de "***000000***" para ""

## Tabela Estabelecimentos
- Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna `cnpj_basico`
- Preenchimento de zeros (0) a esquerda com comprimento máximo de 4 dígitos na coluna `cnpj_ordem`
- Preenchimento de zeros (0) a esquerda com comprimento máximo de 2 dígitos na coluna `cnpj_dv`
- Criação da coluna `cnp` com a junção das valores das colunas `cnpj_basico`, `cnpj_ordem` e `cnpj_dv`
- Criação da coluna `id_municipio` de 7 dígitos do IBGE a partir da coluna `id_municipio_rf` (ID município da Receita Federal)
- Adequação das colunas `data_situacao_cadastral`, `data_situacao_especial` e `data_inicio_atividade` ao padrão ano-mês-dia (%Y-%m-%d)

## Tabela Simples
- Troca de valores N por 0 e S por 1 na coluna `opcao_simples`
- Troca de valores N por 0 e S por 1 na coluna `opcao_mei`
- Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna `cnpj_basico`
- Adequação das colunas `data_opcao_simples`, `data_exclusao_simples`, `data_opcao_mei` e `data_exclusao_mei` ao padrão ano-mês-dia (%Y-%m-%d)



# Materiais de apoio
* [Avaliação de confidencialidade das informações constantes nos Dados Abertos do Cadastro Nacional de Pessoa Jurídica (CNPJ)](https://www.gov.br/receitafederal/dados/nota-cocad-rfb-86-2024.pdf/)
* [Tutorial da BD sobre como acessar e analisar dados de CNPJ usando SQL, Python ou R](https://www.youtube.com/watch?v=WQruVEizTlc&t=1782s)