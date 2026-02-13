---
title: Guia de uso dos dados de Eleições Brasileiras
description: >-
  Guia de uso dos dados de Eleições Brasileiras. Este material contém informações sobre as variáveis mais importantes, perguntas frequentes e exemplos de uso do conjunto.
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

Por ter mais de 20 tabelas, este conjunto pode ser complexo à primeira vista. Para facilitar, organizamos as informações em grupos temáticos e detalhamos o conteúdo de cada tabela

## Candidatos
- **`candidato`**: Tabela de microdados. Cada linha representa uma candidatura em uma eleição. As colunas contêm informações sobre o candidato e sua candidatura.  
- **`bens_candidato`**: Tabela de microdados. Cada linha representa um item declarado por um candidato em uma eleição. Caso o candidato participe de mais de uma eleição, pode haver itens repetidos. As colunas descrevem o item e o seu valor.
- **`despesas_candidato`**: Tabela de microdados. Cada linha representa uma nota fiscal de despesa de um candidato em uma eleição. As colunas descrevem os detalhes da despesa.
- **`receitas_candidato`**: Tabela de microdados. Cada linha representa uma receita de campanha de um candidato em uma eleição. As colunas trazem informações sobre a receita, como dados do doador e detalhes fiscais.
- **`resultados_candidato`, `resultados_candidato_municipio`, `resultados_candidato_municipio_zona`, `resultados_candidato_secao`**: Tabelas agregadas com estrutura semelhante. Cada linha representa o resultado de um candidato em uma eleição. A diferença está no nível de agregação: total da eleição, por município, por zona ou por seção. As colunas mostram o total de votos, detalhes do cargo e se o candidato foi eleito.

## Partidos
- **`partidos`**: Tabela de microdados. Cada linha representa um partido em um recorte eleitoral em uma eleição. As colunas indicam a situação da legenda e coligações ou federações feitas para cada cargo.
- **`receitas_comite` e `receitas_orgao_partidario`**: Tabelas de microdados com estrutura semelhante. Cada linha representa uma receita de campanha. A diferença está na entidade que recebeu a receita: comitê ou órgão partidário. As colunas trazem informações sobre a receita, como dados do doador e detalhes fiscais.
- **`resultados_partido_municipio`, `resultados_partido_municipio_zona`, `resultados_partido_secao`**: Tabelas agregadas com estrutura semelhante. Cada linha representa o resultado de um partido para um determinado cargo em uma eleição. A diferença está no nível de agregação: por município, por zona ou por seção. As colunas mostram o total de votos, separando votos nominais e votos na legenda.

## Informações gerais sobre as eleições
- **`vagas`**: Tabela agregada. Cada linha representa um cargo em uma unidade eleitoral em uma eleição. As colunas indicam o total de vagas para aquele cargo.
- **`perfil_eleitorado_local_votacao`, `perfil_eleitorado_municipio_zona`, `perfil_eleitorado_secao`**: Tabelas agregadas com estrutura semelhante. Cada linha representa um estrato do perfil sociodemográfico dos eleitores (gênero, idade, estado civil, instrução). A diferença está no nível de agregação: por município, por zona ou por seção. As colunas indicam o perfil sociodemográfico, a situação em relação à biometria e o total de eleitores.
- **`detalhes_votacao_municipio`, `detalhes_votacao_municipio_zona`, `detalhes_votacao_secao`**: Tabelas agregadas com estrutura semelhante. Cada linha representa os detalhes da votação em uma eleição. A diferença está no nível de agregação: por município, por zona ou por seção. As colunas indicam o total de abstenções e votos por tipo.
- **`local_secao`**: Tabela de microdados. Cada linha representa uma seção eleitoral em um ano. Essa é a única tabela que não foi disponibilizada pelo TSE; ela foi criada por uma organização externa. As colunas incluem estimativas para o ponto de localização geográfica de cada seção eleitoral.

# Considerações para análises
## Repasses entre candidatos na tabela de receitas
Candidatos podem repassar verbas entre si, o que faz com que uma mesma receita apareça mais de uma vez.

## Coluna id_municipio
Alguns registros têm a coluna `id_municipio nulo`, pois o TSE registra municípios no exterior, que não possuem código IBGE. Nesses casos, apenas a coluna `id_municipio_tse` está preenchida.

## Situação do candidato
Candidaturas podem ser indeferidas pela justiça eleitoral, para filtrar apenas candidatos que concorreram em uma eleição, use o filtro `situacao = 'deferida'`.

## Prestação de contas
Os dados são preenchidos manualmente, o que pode gerar inconsistências, valores ausentes ou duplicidades, especialmente durante os períodos de campanha.

## Porpoção de votos válidos para senado
Nos anos em que a eleição para o Senado envolve duas vagas, a proporção de votos válidos nas tabelas `detalhes_votacao_municipio`, `detalhes_votacao_municipio_zona` e `detalhes_votacao_secao` pode ultrapassar 100%.
Isso ocorre porque, nesses anos, cada eleitor pode votar em dois candidatos diferentes, e o TSE contabiliza cada voto individualmente como um voto válido para o cargo. Assim, um mesmo eleitor aparece duas vezes na contagem, o que eleva a proporção de votos válidos acima de 100%.

# Limitações
As tabelas do TSE não incluem informações de eleições para o conselho tutelar.

# Inconsistências
Além do comportamento esperado nos anos com duas vagas para o Senado, identificamos que existem algumas dezenas de linhas na tabela `detalhes_votacao_secao` em que a proporção de votos válidos ultrapassa 100% sem uma causa conhecida. Esse conjunto de casos é muito pequeno em relação ao total de linhas da tabela e, até o momento, não encontramos uma explicação para o ocorrido. Recomendamos tratar esses registros como residuais e analisá-los com cautela caso tenham impacto direto na sua aplicação.

# Observações ao longo tempo

- Para acompanhar os candidatos ao longo dos anos, você pode usar a coluna `titulo_eleitoral`. Esse identificador rastreia indivíduos de forma consistente, superando a limitação de outros IDs associados que mudam entre pleitos. Ele identifica os candidatos em 99,5% dos casos. No entanto, é importante observar que podem existir valores nulos ou dois identificadores diferentes para o mesmo candidato em alguns casos.

- Para acompanhar os partidos, é preciso considerar mudanças de nome e fusões ao longo do tempo.

- Pode haver mais de um prefeito, governador ou presidente da República eleito dentro da mesma janela de mandato de quatro anos (por exemplo, 2020–2024). Isso ocorre quando a Justiça Eleitoral, anula mais de 50% dos votos válidos de uma eleição em razão do indeferimento do registro de candidatura ou da cassação do diploma do candidato eleito. Nesses casos, é convocada eleição suplementar para que o eleitorado eleja um novo representante. Para fazer análise dos Dados, recomenda-se utilizar a coluna `data_eleicao` nas tabelas de resultados, permitindo distinguir eleições ordinárias e suplementares ocorridas dentro da mesma janela de mandato. Para maiores informações, leia a seção: [Materiais de apoio](#materiais-de-apoio)

# Linhas duplicadas
As linhas duplicadas são removidas no tratamento feito pela BD.

# Cruzamentos
Atente-se às colunas que identificam unicamente entidades e tabelas:
- **Candidaturas**: Para cruzar informações de uma mesma eleição, as colunas `ano`, `tipo_eleicao` e `sequencial_candidato` formam uma chave única para dados a partir de 2010. Para períodos anteriores, você pode usar as colunas `titulo_eleitor`, `ano` e `tipo_eleicao`. Essa combinação é única em 99,5% dos casos, mas não é totalmente precisa, pois algumas candidaturas têm a coluna `titulo_eleitor` vazia.
- **Pessoas:** Uma mesma pessoa pode ter várias candidaturas registradas ao longo dos anos. Para identificar uma pessoa, é recomendado utilizar a coluna `titulo_eleitor`.
- **Zonas**: Para cruzar informações de um mesmo ano, as colunas `ano`, `id_municipio_tse` e `zona` formam uma chave única. As zonas podem mudar entre os anos e têm identificadores únicos apenas dentro de um município.
- **Seções**: Para cruzar informações de um mesmo ano, as colunas `ano`, `id_municipio_tse`, `zona` e `seção` formam uma chave única. As seções podem mudar entre os anos e têm identificadores únicos apenas dentro de um município e uma zona.
- **Partidos**: São identificados pelas colunas `sigla_partido` e `numero_partido`.

# Download dos dados
Algumas tabelas deste conjunto têm mais de 1GB, enquanto outras são menores. Para evitar sobrecarregar seu computador, verifique o tamanho das tabelas de interesse. Se forem muito grandes, recomendamos usar queries no BigQuery para processar os dados na nuvem antes de baixá-los. Filtre pelas colunas de partição (como ano e UF) e selecione apenas as colunas relevantes.

# Instrumento de coleta
## Sistema de Candidaturas (CAND)
Sistema utilizado para registrar candidaturas, onde partidos e coligações inserem dados pessoais, informações sobre filiação partidária, certidões criminais e outras documentações necessárias dos candidatos.

## Sistema de Prestação de Contas Eleitorais (SPCE)
Sistema utilizado para registrar todas as receitas e despesas de campanhas. O SPCE assegura que as informações sejam prestadas de forma padronizada e dentro dos prazos estabelecidos pela Justiça Eleitoral.

## Resultados eleitorais
Após o encerramento da votação, cada urna eletrônica gera um Boletim de Urna com os resultados apurados na seção eleitoral. Os dados dos boletins são enviados aos Tribunais Regionais Eleitorais (TREs) e, depois, ao TSE para a divulgação dos resultados finais.

## Perfil dos eleitores
Durante o alistamento eleitoral e a revisão cadastral, os eleitores informam dados pessoais, como nome, data de nascimento, gênero, escolaridade e endereço. Os cartórios eleitorais registram essas informações no Cadastro Nacional de Eleitores.

# Mudanças na coleta
O sistema eleitoral passou por várias mudanças ao longo dos anos, o que impactou os dados coletados. Confira abaixo as principais alterações:
- **1997**: Inclusão de informações sobre gênero;
- **1998**: Divulgação de CPF dos candidatos;
- **2014**: Inclusão de informações sobre raça ou cor;
- **2016**: Proibição de doações por CNPJs;
- **2022**: Coleta de dados sobre transgeneridade;
- **2024**: Interrupção da divulgação de CPF dos candidatos.

# Atualizações
A maioria dos dados é atualizada uma vez a cada eleição regular (a cada dois anos). Dados de receitas e despesas são atualizados diariamente durante campanhas eleitorais.

# Tratamentos feitos pela BD:
Neste guia, os tratamentos são descritos em uma linguagem mais acessível. De maneira complementar, os [códigos de tratamento](code-notebook) e as [modificações feitas no BigQuery](queries-dir) estão disponíveis no repositório do GitHub para consulta. 
Os tratamentos realizados foram:
- Remoção de acentos e conversão de texto para letras minúsculas.
- Remoção de registros duplicados considerando o conjunto completo de colunas.
- Valores inválidos, como "-9999" ou "#NULO", foram convertidos em nulos.
- Adequação das colunas que identificam municípios ao formato ID Município IBGE (7 dígitos)
- Datas inconsistentes na coluna `data_nascimento` (idades abaixo de 18 ou acima de 120 anos) foram substituídas por valores nulos.
- Padronização da coluna `tipo_eleicao` alterando de "eleições municipais" para "eleição ordinária".
- Padronização da coluna `nacionalidade` alterando de “brasileira nata” para “brasileira”.

# Materiais de apoio
* [Site de dados abertos do TSE com arquivos disponíveis para download](https://dadosabertos.tse.jus.br/dataset/)
* [Painel de Estatísticas Eleitorais com uma grande diversidade de filtros e análises facilitadas](https://sig.tse.jus.br/ords/dwapr/seai/r/sig-eleicao/home?session=17112009236550)
* [Painel para consulta de informações sobre candidaturas e contas eleitorais](https://divulgacandcontas.tse.jus.br/divulga/#/home)
* [Siga o dinheiro: Painel desenvolvido pela BD para entender de onde vem e onde está sendo gasto o dinheiro das campanhas](https://www.sigaodinheiro.org/)
* [Curso de Análise de Dados Eleitorais da BD](https://info.basedosdados.org/bd-edu-eleicoes)
* [Eleições Suplementar](https://www.tse.jus.br/comunicacao/noticias/2025/Fevereiro/voce-sabe-o-que-e-uma-eleicao-suplementar)

[code-pipeline]: https://github.com/basedosdados/pipelines/tree/main/pipelines/utils/crawler_tse_eleicoes
[code-notebook]: https://github.com/basedosdados/queries-basedosdados/blob/main/models/br_tse_eleicoes/code/%5Bdbt%5Dbr_tse_eleicoes.ipynb
[queries-dir]: https://github.com/basedosdados/queries-basedosdados/tree/main/models/br_tse_eleicoes
