---
title: "De Olho Na Câmara: Como Analisar os Dados Abertos da Câmara dos Deputados"
description: >-
  Aprenda como acessar e analisar os dados da atividade parlamentar e despesas
  da Câmara
date:
  created: "2024-06-19T13:58:09.699Z"
authors:
  - name: Thaís Filipi
    role: Análise e texto
  - name: Giovane Caruso
    role: Edição
  - name: José Felix
    role: Design e Edição de Arte
thumbnail: /blog/de-olho-na-camara-como-analisar-os-dados-abertos-da-camara-dos-deputados/image_0.png
categories: [analise]
medium_slug: >-
  https://medium.com/@basedosdados/de-olho-na-c%C3%A2mara-como-analisar-os-dados-abertos-da-c%C3%A2mara-dos-deputados-6a36292aa384
published: true
---

Quais partidos possuem a maior mais proposições aprovadas na Câmara? Qual é o maior gasto dentre deputados(as) na utilização da Cota Parlamentar? Essa legislatura está mais ou menos ativa que a anterior?

A criação do Portal de Dados Abertos da Câmara dos Deputados facilitou muito o acesso da população à informações de interesse público sobre a atuação do nosso legislativo, mas algumas análises mais complexas ainda exigem um maior conhecimento sobre como os dados estão organizados, como se relacionam e como podem ser acessados de maneira prática e ágil.

É para você poder responder essas e muitas outras perguntas que nós criamos a campanha De Olho Na Câmara. O objetivo da campanha é promover uma série de conteúdos para te ajudar a construir suas próprias análises. Você pode conferir o artigo anterior, que recupera o contexto histórico da disponibilização dos dados da Câmara, além de um compilado de links e informações úteis. Considere também assinar nossa newsletter mensal para ficar por dentro dos próximos lançamentos.

> [Conheça os dados que te ajudam a monitorar a Câmara dos Deputados](/blog/de-olho-na-camara-historico-e-contexto-dos-dados-abertos-da-camara)
>
> [Assine a BDletter](https://info.basedosdados.org/newsletter)

<Image src="/blog/de-olho-na-camara-como-analisar-os-dados-abertos-da-camara-dos-deputados/image_0.png"/>

## O que você vai ler?

Neste artigo você vai encontrar informações sobre o processo de captura e atualização dos dados no nosso datalake, sobre como eles estão organizados e como aplicar tudo isso nas suas próprias análises. Vamos utilizar os dados de despesa de deputados(as) ao longo das últimas cinco legislaturas como exemplo.

O [site da Câmara dos Deputados](https://dadosabertos.camara.leg.br/) disponibiliza os dados brutos e detalhados sobre a atividade legislativa feita pela Casa. São esses dados que possibilitam a criação de diversas iniciativas que promovem mais transparência sobre o poder público, como é o caso do [LegislaBrasil](https://indice.legislabrasil.org/), [Serenata de Amor](https://serenata.ai/), dentre muitas outras.

Desde 2023, a Base dos Dados captura e atualiza os Dados Abertos da Câmara em nosso datalake público, que também armazena os principais indicadores públicos no país. Isso facilita muito o acesso e cruzamento dessas informações para criação de análise que respondem perguntas como as que abriram este artigo. Venha entender como você pode utilizar a BD para criar análises e monitorar os representantes da população brasileira dentro da Câmara dos Deputados.

## Como a BD captura os dados e como eles são atualizados?

Parte fundamental de uma boa análise é compreender de onde saíram os dados utilizados, qual o seu contexto e por quais procedimentos passaram antes de chegar na sua planilha ou linha de comando (por isso mesmo, recomendamos a leitura do artigo anterior, que explica o contexto dos dados da Câmara). Veja como funciona o processo de tratamento e inserção de dados na BD.

Nossa equipe especializada captura os dados por meio de requisição no [site da Câmara](https://dadosabertos.camara.leg.br/swagger/api.html#staticfile), que você e qualquer pessoa também tem acesso. Todo o fluxo do trabalho é aberto e está disponível no [GitHub da Base dos Dados](https://github.com/basedosdados/pipelines/tree/main/pipelines/datasets/br_camara_dados_abertos), para quem tem interesse em se debruçar sobre os detalhes. O que vale ressaltar é que o processo de captura é automatizado e, por ele rodar todos os dias, você tem a garantia de que sempre vai ter a versão mais atualizada dos dados.

Outra observação importante é sobre o tratamento de dados. Além de todas as variáveis passarem pelo crivo do [manual de estilo da BD](https://basedosdados.org/docs/style_data/), uma metodologia sofisticada de tratamento e limpeza de dados, alguns outros aspectos também foram adaptados. O método de quebra de linha da Câmara, por exemplo, não era bem lido em outras ferramentas — isso foi modificado no processo de tratamento próprio da BD, via Python.

Além disso, grande parte das tabelas são tratadas via [DBT (Data Build Tool)](https://docs.getdbt.com/docs/introduction), que é uma ferramenta para transformar dados em SQL (Structured Query Language). Isso é muito útil no nosso contexto do datalake, em que um grande volume de dados é armazenado e processado. Com essa ferramenta, é possível fazer testes unitários para verificar aspectos do nível de observação da tabela, como a proporção de nulos, verificação do cruzamento de colunas identificadoras com a tabela de diretórios, enfim, tudo o que diz respeito à garantia da qualidade dos dados.

[Saiba mais sobre o sistema de inserção de dados na BD aqui](/blog/como-funciona-o-sistema-de-insercao-de-dados-na-bd)

## Compreendendo a cobertura temporal

Cada tabela disponibilizada pela Câmara tem uma cobertura temporal específica, resultado de como os dados foram sendo produzidos e tornados públicos ao longo do tempo. Trouxemos aqui uma linha do tempo dos dados para auxiliar no seu processo de pesquisa. Veja na imagem, por exemplo, que os dados de legislaturas remetem desde a criação da Câmara dos Deputados pela Constituição de 1826. Já os primeiros registros de despesas datam de 1959, antes mesmo da criação da atual Cota para o Exercício da Atividade Parlamentar (CEAP).

<Image src="/blog/de-olho-na-camara-como-analisar-os-dados-abertos-da-camara-dos-deputados/image_1.png" caption="A imagem apresenta uma linha do tempo que ilustra a evolução da cobertura das tabelas nos Estados Unidos, abrangendo o período de 1826 a 2015. Cada ano é representado por uma caixa contendo as tabelas que passaram a ser cobertas nesse período. 1826: Legislatura 1899: Proposicao_microdados 1900: Evento Evento_orgao Evento_presenca_deputado 1934: Proposicao_autor Votacao 1935: Votacao_objeto 1946: Proposicao_tema 1959: Despesa Funcionario 1974: Votacao_proposicao 1977: Evento_requeriment"/>

### Chaves identificadoras

Os Dados Abertos da Câmara estão organizados como um banco de dados relacional. Isso quer dizer que, além de algumas características básicas, como a organização em tabelas com linhas e colunas, podemos estabelecer relacionamentos entre diferentes tabelas. Isso só é possível por conta das chaves identificadoras.

> Chaves identificadoras podem ser primárias ou estrangeiras. Uma chave primária identifica unicamente cada registro na tabela. Chaves estrangeiras, por outro lado, podem ser uma ou mais colunas que fazem referência à chave primária de outra tabela

Cada proposição pode ter mais de uma tema, e por isso pode aparecer diversas vezes na tabela de proposições por ano de apresentação. Levando em consideração que as proposições têm formas de nomeação diferentes quando são debatidas na Câmara e no Senado, seria muito fácil confundir informações sobre o montante e relevância de trabalho feito em cada casa legislativa. Por isso, cada proposição tem um identificador único, o `idProposicao` (que funciona como uma _chave primária_). No nosso _datalake_ ele é chamado de `id_proposicao`.

Agora, tomando a tabela de autores das proposições por ano de apresentação como exemplo, além do identificador único das proposições, ela tem também um identificador único dos(as) deputados(as) que apresentaram as proposições. Aqui, o `idDeputadoAutor` (`id_deputado` na BD) funciona como uma _chave estrangeira_ se a conectamos à tabela de informações sobre os deputados. Isso pode ser válido se queremos acrescentar a informação de filiação partidária ou sexo do(a) deputado(a) proponente aos dados sobre as proposições. Os IDs garantem que vamos mesclar certinho cada parlamentar à sua proposição.

A seguir temos um mapa mental que mostra todas as conexões entre as chaves identificadoras no nosso _datalake_. Ele mostra as possibilidades de conexão entre as tabelas para facilitar a sua análise.

<Image src="/blog/de-olho-na-camara-como-analisar-os-dados-abertos-da-camara-dos-deputados/image_2.png" caption="No canto superior está o texto “Como as tabelas dos dados da Câmara se relacionam?”. No centro, há uma série de caixas que representam as diferentes tabelas da base de dados. Cada caixa contém o nome da tabela e uma breve descrição do que ela armazena. As caixas estão conectadas por linhas que mostram como as tabelas se relacionam entre si. Por exemplo, a caixa “evento” está conectada à caixa “proposicao” por uma linha com a etiqueta “id_proposicao”."/>

## Dados de despesa através das legislaturas

Vamos agora a um exemplo prático utilizando o _datalake_ público da BD e consultas SQL. Se precisar de ajuda para criar suas consultas, confira [nosso tutorial de SQL](/blog/como-comecar-sua-analise-com-dados-publicos) sobre como acessar os dados da BD usando a linguagem.

A consulta abaixo nos permite comparar dados de despesa dos(as) deputados ao longo das últimas cinco legislaturas (de 2007 até o presente).

```sql
SELECT
  id_legislatura,
  categoria_despesa,
  ROUND(SUM(valor_liquido),1) AS despesa_total
FROM
  `basedosdados.br_camara_dados_abertos.despesa` desp
WHERE
  id_legislatura IN ('53',
    '54',
    '55',
    '56',
    '57')
GROUP BY
  id_legislatura,
  categoria_despesa
ORDER BY
  id_legislatura ASC;
```

A consulta gera a seguinte tabela. Vale lembrar que você pode exportar os resultados em um arquivo local (.csv, JASON ou para a área de transferência do seu computador) para explorar com com seu editor de planilha ou linguagem de programação preferida, ou ainda salvá-los em uma tabela do BigQuery ou Google Sheets, sem precisar fazer download da tabela.

<Image src="/blog/de-olho-na-camara-como-analisar-os-dados-abertos-da-camara-dos-deputados/image_3.png" caption="16 primeiras linhas da tabela com o total de despesas por categoria de despesa"/>

Aqui conseguimos avaliar, por exemplo, o total de despesas pela cota para exercício da atividade parlamentar por tipo de despesa, ou seja, gastos com passagens aéreas, manutenção de escritório, alimentação, divulgação de atividade parlamentar etc. Utilizamos os dados da 53ª até a 57ª Legislatura, a atual.

Notamos que os gastos de divulgação da atividade parlamentar têm se destacado entre os parlamentares da legislatura atual, e por isso resolvemos investigar como esse tipo de despesa evoluiu ao longo do tempo como um todo. Com essa consulta, que poderia ser feita diretamente no ambiente do Google Cloud Console ([tutorial aqui](https://basedosdados.org/docs/home#bigquery-sql)) ou através das nossas bibliotecas no Python ou R, conseguimos o seguinte resultado:

<Image src="/blog/de-olho-na-camara-como-analisar-os-dados-abertos-da-camara-dos-deputados/image_4.png" cation="Título: Gastos de Deputados com Propaganda Subtítulo: Valor de gastos com divulgações em relação ao total de despesas da Cota Parlamentar, em milhões (R$) O gráfico mostra 5 barras, uma para cada legislatura, da de 2007 até a atual, com os gastos aumentando de aproximadamente 220mi até 810mi na legislatura de 2019–2023. Dentro das bararas é identificado o quanto dos gastos foram com divulgações da atividade parlamentar. Os valores, em ordem, são: 45,4; 147,5; 210,8; 217,4; e 120,4"/>

Vale mencionar que as despesas da legislatura atual são muito menores pois ela ainda não acabou. Além disso, parece que o palpite sobre a importância crescente deste tipo de gasto parece estar na direção certa. Para termos uma noção do quanto essa despesa tem ocupado uma parcela maior dos gastos de deeputados, podemos observar o mesmo recorte, mas com a proporção(%) que as divulgações ocupam no total gasto da Cota Parlamentar.

<Image src="/blog/de-olho-na-camara-como-analisar-os-dados-abertos-da-camara-dos-deputados/image_5.png" caption="Título: Gastos de Deputados com Propaganda Subtítulo: Proporção de gastos com divulgações em relação ao total de despesas da Cota Parlamentar (%) O gráfico mostra 5 barras, uma para cada legislatura, da de 2007 até a atual, com a porcetagem do gasto com divulgações da atividade parlamentar. Os valores são, em ordem: 9%, 10,9%, 12,5%, 13,6%, 19,9%."/>

A análise e os gráficos foram feitos utilizando o pacote Python da BD.

[Confira o notebook completo com o código utilizado para produzir as análises](https://github.com/basedosdados/analises/blob/main/redes_sociais/br_dados_abertos_camara_despesa_20240619.ipynb)

Além disso, ainda poderíamos discriminar as despesas dos deputados segundo sexo. Para isso, podemos utilizar a consulta SQL a seguir.

```sql
SELECT
  sexo,
  id_legislatura,
  categoria_despesa,
  ROUND(SUM(valor_liquido),1) AS despesa_total
FROM
  `basedosdados.br_camara_dados_abertos.despesa` desp
INNER JOIN
  `basedosdados.br_camara_dados_abertos.deputado` dep
ON
  desp.id_deputado = dep.id_deputado
WHERE
  id_legislatura IN ('53',
    '54',
    '55',
    '56',
    '57')
GROUP BY
  sexo,
  id_legislatura,
  categoria_despesa
ORDER BY
  id_legislatura ASC;
```

Note como juntamos a tabela `deputado` à tabela de `despesa`. Isso é possível porque temos a coluna `id_deputado` em ambas as tabelas. Com o `inner join` juntamos apenas as informações correspondentes de ambas as tabelas

Agora deixamos com você. E aí, consegue identificar diferenças por sexo nas categorias de despesa dos parlamentares? Não deixe de compartilhar suas análises conosco!
