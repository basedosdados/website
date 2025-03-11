---
title: Intro ao pacote basedosdados em Python
description: Explore os dados do nosso datalake público
date:
  created: "2021-04-16"
authors:
  - name: Vinicius Aguiar
    role: Equipe Base dos Dados 💚
    social: https://medium.com/u/2af0c71cb64a
  - name: Fernanda Scovino
    role: Equipe Base dos Dados 💚
    social: https://medium.com/u/444581849446
thumbnail: /blog/intro-ao-pacote-basedosdados-em-python/image_0.jpg
categories: [tutorial]
medium_slug: https://medium.com/@basedosdados/intro-ao-pacote-basedosdados-em-python-4e05439e936d
published: false
---

<Image src="/blog/intro-ao-pacote-basedosdados-em-python/image_0.jpg"/>

## TL;DR

Vamos demonstrar **como usar o pacote da Base dos Dados em Python.** O pacote permite acessar e analisar mais de 70 conjuntos de dados do nosso _datalake_ público BD+, obter informações sobre tabelas, carregar dados no pandas, e mais.

Conteúdo baseado no [Workshop “Brincando com dados BD+ em Python”](https://www.youtube.com/watch?v=wI2xEioDPgM).

## Como acessar a BD+ em Python

A Base dos Dados Mais (BD+) é o nosso _datalake_ de dados públicos **limpos, integrados e atualizados** pela nossa equipe de dados — dados prontos para análise.

O _datalake_ é mantido no Google BigQuery e tem custo praticamente zero para todos os usuários — você tem 1 TB disponível por mês para fazer consulta aos dados. Para facilitar ainda mais a vida de Pythonistas, criamos um pacote de acesso direto ao repositório via Python: **basedosdados**

```sh
# rode para instalar no Python/Jupyter
!pip install basedosdados
```

```python
import basedosdados as bd
```

> **Atenção!** É necessário criar um projeto no Google Cloud para fazer consulta aos dados do datalake. Caso você rode qualquer função do pacote pela primeira vez, as instruções irão aparecer e basta seguir o passo a passo. Utilize o **ID do projeto** que será gerado para rodar as funções mais a frente.

Existem diversas funções no pacote, tanto para acesso quanto para publicação de dados no nosso ou em qualquer projeto do Google Cloud — você pode usar o pacote para construir seu próprio repositório de dados também. A lista completa dos módulos do pacote está na [nossa documentação](https://basedosdados.org/docs/api_reference_python), e veja também como colaborar [subindo dados no repositório](https://basedosdados.org/docs/colab_data).

## Explorando as funções do pacote

Para ilustrar, podemos verificar todos os conjuntos de dados disponíveis no _datalake_ usando a função `list_datasets`. Essa função retorna todos os conjuntos de dados, que podem ser filtrados por algum termo específico usando o parâmetro `filter_by`. Mostramos como fazer isso abaixo buscando dados do IBGE. O parâmetro `with_description` indica se queremos visualizar também a descrição de cada conjunto.

```python
bd.list_datasets(filter_by="ibge", with_description=True)
```

Da mesma forma, podemos listar as tabelas de um conjunto de dados específico com a função `list_dataset_tables` Além disso, podemos ter também uma visão completa das colunas e seus tipos com a função `get_table_columns` — tudo isso sem carregar ainda os dados no ambiente!

```python
# Lista as tabelas do conjunto de dados sobre nomes no Brasil
bd.list_dataset_tables(
  dataset_id="br_ibge_nomes_brasil",
  with_description=True
)

# Consultando as colunas de uma das tabelas do conjunto
bd.get_table_columns(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010"
)
```

Antes de carregar os dados, pode-se verificar inclusive seu tamanho total — existem tabelas muito grandes no repositório, então recomendamos fortemente fazer esse passo.

```python
bd.get_table_size(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010",
  billing_project_id="seu-id-projeto"
)
```

Por fim, a função `read_table` faz o carregamento dos dados no ambiente Python. Caso a base em questão seja muito grande, você pode optar também em usar a função `read_sql`, que permite fazer uma query SQL e carregar no ambiente somente os dados requisitados. Para ambos é necessário que você explicite o seu `billing_project_id`, o projeto que foi habilitado lá no início e que será cobrado caso você exceda o limite.

```python
df = bd.read_table(
  dataset_id="br_ibge_nomes_brasil",
  table_id="quantidade_municipio_nome_2010",
  billing_project_id="seu-id-projeto"
)
```

Neste exemplo vamos trabalhar com os dados de [nomes brasileiros do Censo Demográfico 2010 do IBGE](/dataset/703f9f0d-caee-4b47-b900-46b1dea2c33c?table=3bc00c7a-28e5-421b-b310-b32bed3dd4d4). De acordo com o Censo, existem ao todo cerca de 200 milhões de habitantes com mais de 130 mil nomes diferentes espalhados pelo Brasil. Curioso? Nós também!

## Construindo uma análise: Quais os nomes mais famosos no Brasil?

Qual a sua aposta, Maria ou João? Vamos descobrir com os dados.

Para respondermos a essa pergunta, contamos a frequência de cada nome no Brasil e ordenamos colocando os mais frequentes no topo. Em seguida, vamos criar uma nuvem de palavras para visualizar essas informações.

Criamos então a função `generate_list_sorted_by_freq` que faz a agregação dos nomes na tabela contando quantas vezes cada um aparece, e ordenamos a lista de acordo com os nomes mais frequentes. O código segue mais abaixo.

Para criar a imagem, usamos a biblioteca `wordcloud` junto ao `matplotlib`, disponíveis para instalação via `pip`. A `wordcloud` nos possibilita gerar uma imagem com as palavras onde o tamanho de cada uma é determinado pela sua frequência, gerando um belo efeito visual para nosso ranking.

E como resultado: **Maria é a vencedora**!

<Image src="/blog/intro-ao-pacote-basedosdados-em-python/image_1.jpg" caption="Nuvem de palavras com nomes mais frequentes no Brasil. O tamanho de cada palavra corresponde ao quão famoso aquele nome é. O maior nome na imagem é Maria, em seguida José, João, Antônio e Francisco."/>

**O que achou dessa descoberta?** No próximo texto traremos uma análise regional construída pelo Fred também no Workshop. Veja este e outros workshops no nossos [Youtube](https://www.youtube.com/c/BasedosDados).
