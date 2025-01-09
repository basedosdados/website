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

# Considerações para análises
## Diferença entre estabelecimentos e empresas
Uma empresa é representada pelo `cnpj_basico` e pode ter vários estabelecimentos. Já um estabelecimento é representado pelo CNPJ de 14 dígitos e pertence a uma única empresa. A lógica é: uma empresa tem vários estabelecimentos. Logo, o `cnpj_basico` da empresa se repete em proporção ao número de estabelecimentos.  

Exemplo: a coluna de natureza jurídica não está presente na base de estabelecimentos. Isso ocorre porque a natureza jurídica é um atributo da empresa e não do estabelecimento. Você pode fazer um join para atribuir a natureza jurídica da empresa aos estabelecimentos.

## Filtrando CNPJs ativos
Se quiser filtrar somente os CNPJs ativos em uma determinada data, use a variável `situacao_cadastral`. O valor 2 identifica empresas ativas. Para acessar os outros códigos, consulte o dicionário de dados do conjunto.  

# Limitações
* A Base dos Dados só tem o histórico dessa base a partir de  2021-11-23, isso significa que modificações que ocorreram nos cnpjs anteriormente a 2021 não estão disponíveis. Entretanto essa base possui todos os cnpjs já abertos no Brasil o que permite diversas análises

# Inconsistências
Ainda não foram reportadas inconsistências

# Observações ao longo tempo
Os dados que compõem o conjunto `br_me_cnpj` são divulgados no formato de "fotografias". Para cada data, é apresentado um status dos CNPJs e dados relacionados. Isso significa que os dados anteriores a 2021-11-23 estão disponíveis com o status dessa data.  

Exemplo:  
- O CNPJ 123 foi criado em 2020-11-23 com dois sócios.  
- Na fotografia liberada em 2021-11-23, o CNPJ 123 permaneceu com dois sócios.  
- Na fotografia de 2023-11-01, entraram mais dois sócios, totalizando quatro.  

Se, na fotografia de 2023-11-01, você fizer uma query procurando pelo CNPJ 123, verá que ele foi criado em 2020-11-23 e possui quatro sócios.  

A fotografia de 2020-11-23 contém os dados históricos com o status dessa data. Dados históricos de fotografias mais antigas não estão disponíveis.  

# Linhas duplicadas
Ainda não foram encontrados indícios de linhas duplicadas nessa base (**Pisa pode verificar aqui? eu tenho quase ctz que tem 1 único cnpj que vem duplicado pq conversamos sobre isso com um moço na américa aberta** ). Mas é importante ter claro que a base tem formato de fotografia, então um mesmo CNPJ aparece em diversas datas diferentes. 

# Cruzamentos
Dentro do próprio conjunto as tabelas podem ser cruzadas utilizando o `cnpj_básico`, só é importante entender o que cada linha de cada base representa para que não fique com dados duplicados. 

# Download dos dados
Essas tabelas são muito grandes para o download direto, é muito importante fazer seleção de colunas e filtros temporais ou geográficos antes de fazer o download dos dados

# Instituição responsável
Receita Federal (RF)

# Instrumento de coleta
Documento Básico de Entrada, que é entregue a Receita Federal para: 
* Inscrever pessoa jurídica no CNPJ;
* Alterar o cadastro de pessoa jurídica no CNPJ; ou
* Baixar o cadastro de pessoa jurídica no CNPJ.
  
# Mudanças na coleta
Os dados não tiveram mudança de metodologia de coleta de 2021 até o momento de elaboração deste guia (08/01/2025)

# Atualizações
Os dados são atualizados normalmente após o dia 15. A Base dos Dados tem uma verificação automática diária, caso detecte que os dados foram alterados a atualização é feita na nossa plataforma

# Dados identificados
Os dados de CNPJ disponibiliza os CPFs dos sócios de maneira anonimizada 

# Tratamentos feitos pela BD:
1. estabelecimentos
* Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna cnpj_basico
* Preenchimento de zeros (0) a esquerda com comprimento máximo de 4 dígitos na coluna cnpj_ordem
* Preenchimento de zeros (0) a esquerda com comprimento máximo de 2 dígitos na coluna cnpj_dv
* Criação da coluna cnpj com a junção das valores das colunas cnpj_basico, cnpj_ordem e cnpj_dv
* Criação da coluna id_municipio de 7 dígitos do IBGE a partir do id_municipio_rf (ID município da Receita Federal)
* Formatação das colunas data_situacao_cadastral,data_situacao_especial e data_inicio_atividade para o padrão ano-mês-dia (%Y-%m-%d)

2. empresas
* Troca de ',' por '.' na coluna capital_social
* Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna cnpj_basico
* Preenchimento de zeros (0) a esquerda com comprimento máximo de 4 dígitos na coluna natureza_juridica

3. socios
* Formatação das colunas data_entrada_sociedade para o padrão ano-mês-dia (%Y-%m-%d)
* Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna cnpj_basico
* Troca valor que identifica valores nulos de cpf de "***000000***" para ""

4. simples
* Troca de valores N por 0 e S por 1 na coluna opcao_simples
* Troca de valores N por 0 e S por 1 na coluna opcao_mei
* Preenchimento de zeros (0) a esquerda com comprimento máximo de 8 dígitos na coluna cnpj_basico
* Formatação das colunas data_opcao_simples, data_exclusao_simples, data_opcao_mei e data_exclusao_mei para o padrão ano-mês-dia (%Y-%m-%d)

# Materiais de apoio
* [Nota Técnica RFB/COCAD nº 86, de 4 de julho de 2024](https://www.gov.br/receitafederal/dados/nota-cocad-rfb-86-2024.pdf/): Avaliação de confidencialidade das informações constantes nos Dados Abertos do Cadastro Nacional de Pessoa Jurídica (CNPJ)
* [Como consultar a analisar dados de CNPJ usando SQL, Python ou R](https://www.youtube.com/watch?v=WQruVEizTlc&t=1782s): Venha aprender como acessar, analisar e cruzar os dados de CNPJ de empresas com alguns dos principais indicadores brasileiros!



