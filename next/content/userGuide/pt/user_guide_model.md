---
title: Modelo de Guia de Uso
description: >-
  Este modelo serve como referência de guia de uso. Nele devem estar descritas as padronizações definidas com a equipe. Caso ache interessante incluir alguma padronização pode incluir aqui que avaliaremos.  
date:
  created: "2024-11-28T18:18:06.419Z"
thumbnail: 
categories: [guia-de-uso]
authors:
  - name: Laura Amaral
    role: Texto
---
<!-- Nesse modelo vamos deixar as os textos do guia do CNPJ para que seja usada como exemplo

Padronizações gerais:
- Utilizar sempre os termos "conjunto" e "tabela". O uso isolado das palavras "base" e "dados" deve ser evitado para garantir clareza sobre o elemento referido.  
- Priorizar uma linguagem direta e concisa. Recomenda-se utilizar o ChatGPT para revisar e tornar o texto mais objetivo.
 -->


# Introdução
<!-- Todo guia começa com esse pequeno aviso para que os usuários novos possam se achar.-->
> O guia contém informações detalhadas sobre os dados. Para dúvidas sobre acesso ou uso da plataforma, consulte nossa [página de Perguntas Frequentes](/faq).

<!-- Na introdução descrevemos as tabelas que compõe o conjunto.
Essa descrição inclui necessáriamente: 
  - Se a tabela é de microdados ou dados agregagos 
  - Explicação do que cada linha da tabela representa
  - Um resumo das colunas
Caso tenha alguma informação muito chave para entender o conjunto, elas também podem ser adicionadas aqui. Mas se atente para não adicionar informação demais, temos o guia todo para descrever melhor o conjunto.  
   -->
Esse conjunto possui quatro tabelas de microdados:  
- **Empresas:** Cada linha representa uma empresa e seus atributos. As colunas descrevem seus atributos como natureza jurídica e tipo de quadro societário.  
- **Sócios:** Cada linha representa um sócio de uma empresa. As colunas descrevem algumas características do sócio e qualificam a relação com a empresa.
- **Estabelecimentos:** Cada linha representa um estabelecimento de operação de uma empresa. As colunas detalham informações sobre localização, atividade econômica e informações de contato.
- **Simples:** Cada linha representa uma empresa e indica se a empresa está no Simples Nacional ou MEI.  

A tabela que relaciona todas elas é a tabela Empresas. Uma empresa pode ter vários sócios, vários estabelecimentos e pode ser qualificada como Simples Nacional ou MEI. 

As tabelas Empresas, Sócios e Estabelecimentos são divulgadas no formato de fotografias. Para cada data, tem-se um retrato do Cadastro Nacional das Pessoas Jurídicas (CNPJs) e seus atributos.

# Considerações para análises
<!-- Aqui incluímos em tópicos diversas considerações para análises, essa é a categoria mais aberta do guia. Tentamos incluir as perguntas frequentes, dicas de uso e confusões comuns -->
## Diferença entre estabelecimentos e empresas
Uma empresa pode ter vários estabelecimentos. A coluna `cnpj_basico` se refere à empresa, e a coluna `cnpj` se refere ao estabelecimento. Logo, a coluna `cnpj_basico` da empresa se repete em proporção ao número de estabelecimentos na tabela Estabelecimentos. Algumas informações da tabela Empresa, como a natureza jurídica, podem ser atribuídas aos estabelecimentos. Para isso, é necessário cruzar os dados da tabela empresa com os de seus estabelecimentos.

## Filtrando CNPJs ativos
Para filtrar apenas os CNPJs ativos, use a coluna `situacao_cadastral`.

# Limitações
<!-- Diferente da parte de considerações esse espaço é especificamente para limitações que a base disponibilizada impõe, pode ser uma limitação metodológica ou alguma limitação imposta pela cobertura temporal -->
Os dados estão disponíveis apenas a partir de 23-11-2021. Registros anteriores a essa data não podem ser acessados. Porém, a base é cumulativa e não exclui registros. Ela apenas atualiza a situação cadastral e os atributos dos CNPJs. Assim, mesmo sem poder acompanhar mudanças antes de 23-11-2021, é possível consultar todos os CNPJs já abertos no Brasil.

# Inconsistências
<!-- Aqui incluimos informações de inconsistências que já encontramos na base, é interessante incluir a explicação da fonte das inconsistências-->
Ainda não temos reportadas inconsistências

# Observações ao longo tempo
<!-- Esse tópico tem como objetivo explicar como acompanhar observações ao longo do tempo e trazer alguma dica ou informação extra sobre esse tópico -->
Os dados são divulgados no formato de fotografias. Para cada data, tem-se um retrato do CNPJs e seus atributos. Com exceção da tabela Simples, a coluna data informa a data na qual os dados foram extraídos. Os dados anteriores a 2021-11-23 são apresentados com o status dessa data.

# Linhas duplicadas
<!-- Tópico desenvolvido especificamente para explicitar se existem linhas duplicadas, é interessante incluir informações de por que isso ocorre e como contornar -->
Há algumas dezenas de linhas duplicadas no conjunto de dados. Essas duplicações vêm da fonte original e representam menos de 0.1% dos dados, o que geralmente não impacta as análises.

# Cruzamentos
<!-- Aqui trazemos particularidades do cruzamento das tabelas do conjunto, pode incluir cruzamentos internos, dentro do próprio conjunto, e cruzamentos externos, com bases fora desse conjunto -->
As tabelas podem ser cruzadas usando as colunas `cnpj_básico` e `data`.  É necessário entender as chaves únicas de cada tabela para evitar duplicações.

# Download dos dados
<!-- Nesse ponto ressaltamos a possibilidade ou não de download direto dos dados. Iniciamos o tópico ressaltando o tamanho das tabelas e depois instruindo como evitar sobrecargas. O objetivo é alertar pessoas que não conhecem conjuntos muito grandes que as vezes não é possível fazer um downaload direto e é necessário aplicar filtros  -->
Os microdados somam mais de 300 GB. Para evitar sobrecarregar seu computador, recomendamos usar queries no BigQuery para processar os dados em nuvem antes de baixá-los. Filtre pelas colunas de partição (como ano e UF) e selecione apenas as colunas relevantes.

# Instrumento de coleta
<!-- Esse tópico descreve como é o instrumento de coleta dos dados. Isso é importante por que trás mais contexto para os dados e permite identificar possíveis viéses e limitações que não listamos anteriormente -->
O instrumento de coleta atual é o Documento Básico de Entrada (DBE), usado pela Receita Federal para registrar, alterar ou encerrar o cadastro de pessoa jurídica.
  
# Mudanças na coleta
<!-- Aqui o objetivo é alertar os usuários caso tenha alguma mudança nos dados ao longo da série temporal, isso é muito importante para que análises sejam feitas com qualidade -->
Não houve mudanças na metodologia de coleta desde 2021 até o momento de elaboração deste guia (08-01-2025).

# Atualizações
<!-- Nesse ponto trazemos explicações sobre como é feita a atualização na fonte original, se é em alguma época específica do ano ou do mês e se existe algum calendário. Esse tópico é importante para que os usuários tenham a expectativa de quando o dado deve ser atualizado-->
Os dados são atualizados após o dia 15 de cada mês. Nossa plataforma realiza verificações automáticas diárias para atualizações.

# Dados identificados
<!-- Esse tópico tem como objetivo orientar para os usuários se existem dados identificados ou se os dados são anonimizados. Muitos usuários tem interesse em dados desanonimizados, mas são poucas as bases que tem essas informações -->
Os dados de CPF dos sócios são disponibilizados de maneira anonimizada. Não é possível obter a base identificada. 

# Tratamentos feitos pela BD:
<!-- Aqui descrevemos os tratamentos de maneira mais direta, para que mesmo quem não sabe programação saiba quais foram os tratamentos feitos. Ainda é necessário deixar os links para quem queira fazer a verificação do processo . Se for necessário pode separar os tratamentos em tabelas-->
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
<!-- Por último incluímos materiais de apoio, para que o usuário possa consultar algumas informações direto das fontes originais ou complementar o entendimento da base -->
* [Avaliação de confidencialidade das informações constantes nos Dados Abertos do Cadastro Nacional de Pessoa Jurídica (CNPJ)](https://www.gov.br/receitafederal/dados/nota-cocad-rfb-86-2024.pdf/)
* [Tutorial da BD sobre como acessar e analisar dados de CNPJ usando SQL, Python ou R](https://www.youtube.com/watch?v=WQruVEizTlc&t=1782s)