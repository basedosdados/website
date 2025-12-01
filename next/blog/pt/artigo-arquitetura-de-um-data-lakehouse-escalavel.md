---
title: "Arquitetura de um data lakehouse Escalável: Case Real com GCP, GitHub e Metabase"
description: Conheça a arquitetura em zonas que desenvolvemos para unir escalabilidade, versionamento de código com CI/CD e dashboards interativos
date:
  created: "2025-11-27T15:00:00"
authors:
  - name: Patrick Teixeira
    role: Autor
    social: 
  - name: Thais Filipi  
    role: Edição
    social:      
  - name: Laura Amaral  
    role: Edição
    social:    
thumbnail: /blog/artigo-arquitetura-de-um-data-lakehouse-escalavel/thumnb_1.png
categories: [analise]
medium_slug: >-
published: true
order: 0
---

## TL;DR

Neste artigo, você confere em detalhes como criamos a arquitetura de um data lakehouse escalável e seguro construído no Google Cloud Platform (GCP) para centralizar dezenas de conjuntos de dados públicos. O projeto utiliza uma arquitetura de zonas (Desenvolvimento/Produção) para garantir confiabilidade, tem seu fluxo de coleta e tratamento (ETL simples em Python) totalmente versionado no GitHub (com CI/CD e Code Review), e é consumido por dashboards dinâmicos no Metabase.

1. Objetivo
2. Construção da infraestrutura de dados na GCP
   1. Arquitetura de zonas
   2. Metabase
   3. GitHub
3. Construção dos códigos de coleta e tratamento
   1. Código de coleta
   2. Tratamento de dados
   3. dbt (Data Build Tool)
4. Documentação clara

## Introdução

A vasta quantidade de dados públicos se torna um recurso desperdiçado quando está dispersa, fragmentada e em formatos incompatíveis. Essa dispersão desvia o foco da equipe de análise para a coleta e organização, atrasando a geração de insights acionáveis.

Este artigo apresenta a solução que desenvolvemos para um cliente para centralizar dezenas de conjuntos de dados públicos em um ambiente unificado, otimizando o acesso e a análise.


## Objetivo

O objetivo central deste projeto foi criar um ecossistema de dados unificado para permitir a implantação de uma aplicação e maximizar o uso do tempo da equipe de análise padronizando e divulgando os resultados dos esforços de coleta e tratamento de dados.

Os objetivos específicos foram estruturados para entregar valor imediato e sustentável:

- **Centralização de Dados**: Criar um ponto de acesso único e rápido para todas as fontes de dados públicos, eliminando a dispersão de informações e o esforço de busca.
- **Qualidade e Confiabilidade**: Assegurar que 100% dos dados disponíveis sejam validados, eliminando erros de análise e o retrabalho manual na preparação.
- **Otimização do tempo**: Fornecer conjuntos de dados estruturados e tratados, facilitando a descoberta e o cruzamento de informações. 
- **Autonomia Operacional**: Desenvolver um sistema e documentação que permitam a atualização e ingestão de novos dados por usuários sem especialização em engenharia de dados.
- **Produtividade Imediata**: Assegurar a exploração de dados através de ferramentas de BI e linguagens já dominadas pela equipe (ex: R), para uma adesão imediata sem necessidade de treinamento extensivo.

A arquitetura escolhida prioriza a segurança dos dados e a eficiência de custos, garantindo a integridade da informação e o retorno sobre o investimento (ROI).


## Fase 1: A solução desenhada

A infraestrutura foi configurada na Google Cloud Platform (GCP), uma plataforma segura, de baixo custo e fácil acesso. Todos os dados de interesse do cliente foram disponibilizados em um único projeto no BigQuery para a centralização dos dados.

Para garantir a qualidade separamos a infraestrutura em dois ambientes, um de desenvolvimento, onde os engenheiros de dados subiam  as primeiras versões de dados, e uma de produção, que, por meio de Github Actions e testes DBT, garantimos que seria alimentada apenas  a partir de dados validados.

Com o objetivo de padronização e garantir o cruzamento entre tabelas, aplicamos o nosso manual de estilo e sistematizamos o fluxo de correção por pares e CI/CD (Continuous Integration/Continuous Delivery) via Github.

A autonomia do cliente é garantida por três pilares fundamentais: padronização de código, simplicidade das soluções e documentação completa. A escolha de utilizar exclusivamente scripts Python para ingestão dos dados foi feita para facilitar a manutenção e reduzir a curva de aprendizado para a equipe interna.

O consumo de dados da camada de produção é projetado para integração imediata à equipe de análise, oferecendo dois caminhos principais: visualização direta no Metabase ou acesso via pacote R e Python. O Metabase — uma plataforma de BI Open Source que foi hospedada em Máquina Virtual — foi selecionado como ferramenta por conta da pequena curva de aprendizado e seu custo baixo. 

Todos esses elementos estão ilustrados no esquema a seguir:


<Image src="/blog/pt/artigo-arquitetura-de-um-data-lakehouse-escalavel/esquema.png" caption="Esquema ilustrativo da Arquitetura de Dados em Fases (ilustração: José Félix)"/>

## Fase 2: Construção da infraestrutura

A infraestrutura foi construída sobre o Google Cloud Platform (GCP). Essa decisão garante a eficiência operacional do projeto, pois o GCP já é uma plataforma de domínio da nossa equipe, o que simplifica o desenvolvimento e a manutenção. Além de oferecer uma integração facilitada com ferramentas de análise, a escolha do GCP foi determinada por sua capacidade de entregar requisitos cruciais: capacidade ilimitada de armazenamento e processamento, otimização automática de custos e desempenho, acessibilidade com o SQL, análise geoespacial integrada, governança intuitiva e conexões de alta qualidade com plataformas de dashboard e linguagens de programação.

### Arquiteturas de zonas no GCP:

A infraestrutura adotada foi uma Arquitetura Zonal no GCP, com segregação clara entre os ambientes de Desenvolvimento e Produção. Esta separação é útil para isolar dados validados (Produção) de dados em transformação e teste (Desenvolvimento). Os dados brutos são ingeridos na zona de desenvolvimento a partir de um bucket no Google Cloud Storage (GCS). A partir daí, as tabelas são conectadas ao BigQuery, onde ocorrem todas as modificações, transformações e validações necessárias. Somente após validação esses dados são promovidos para o ambiente de produção, que contém exclusivamente os dados no BigQuery e não possui camada de GCS.



Principais Vantagens da Arquitetura Zonal

- **Confiabilidade**: A separação entre os dois ambientes dá a segurança de que os dados que estão disponíveis para o público estão corretos, uma vez que eles passaram por testes, ajustes e experimentos na zona de desenvolvimento.

- **Backup**: A cópia idêntica dos dados de Produção no ambiente de Desenvolvimento atua como um mecanismo de rollback. Em caso de falhas na Produção (e.g., exclusão acidental de tabela ou erro de metadados), os dados íntegros podem ser restaurados de forma imediata a partir do ambiente de Desenvolvimento

### Separação em Camadas

A combinação da Arquitetura Zonal (Desenvolvimento/Produção) com o Sistema de Camadas (Bruta, Tratada, Validada) compõe um sistema de governança intuitivo e robusto. Enquanto a Arquitetura Zonal garante a segregação do ambiente (separando dados validados de dados em processamento), o uso de camadas garante a segregação lógica e conceitual.

A nomenclatura de cada camada define o nível de transformação do dado, permitindo que um novo usuário entenda o processo rapidamente. O fluxo de dados é claro: um dado bruto só se torna consumível após passar sequencialmente pela etapa de transformação e só é promovido para o status de validado quando tiver a qualidade assegurado.

Esta dupla (zonas e camadas) elimina a ambiguidade e assegura que a robustez do ambiente de produção não seja comprometida pelas atividades na etapa de desenvolvimento.

**Camada bruto_: O Repositório de Dados Brutos**
Esta é a primeira camada e o ponto de entrada de todos os dados no Data Lakehouse no ambiente de desenvolvimento. Funciona como uma "landing zone", cujo objetivo principal é levar os dados para dentro da infraestrutura. Todas as tabelas dessa zona se conectam com os arquivos depositados no GCS. Busca-se criar uma cópia mais próxima de como os dados se encontram nos sistemas de origem, servindo como um arquivo histórico e uma fonte para reconstruir as camadas seguintes. 

**Camada tratada_: A Fonte da Verdade Consolidada**
Para entrar na camada tratada_, os dados brutos passam por processos de limpeza tratamento e padronização. Processos como a remoção de duplicatas, ajuste de nomes de colunasvariáveis e a padronização de códigos, como id_municipio, são feitos nessa camada. O resultado são tabelas organizadas para serem consumidas. Esses dados ainda estão no ambiente de desenvolvimento, pois ainda é necessário verificar se as transformações realizadas atingiram a qualidade desejada.

**Camada validada_: Dados Prontos para Análise em produção**
A camada validada_ fica no ambiente de produção e contém a réplica dos dados da camada tratada_ que já passaram pelos testes de qualidade. Nessa etapa também trazemos os metadados de cada uma das tabelas com os resultados numéricos dos testes e, quando necessário, justificativas do motivo pelo qual algum teste foi dispensado. Além disso, incluímos informações obtidas sobre a tabela durante o tratamento, isso inclui problemas provenientes da fonte ou algum link importante para maior entendimento dos dados. Essa camada de metadados é essencial para que os analistas possam confiar e saibam como interpretar e ponderar para extrair insights qualificados dos dados disponibilizados

### GitHub

Todo o desenvolvimento de extração, ingestão e transformação dos dados é armazenado no GitHub, permitindo rastreabilidade de versões anteriores e revisão por pares. Utilizamos também ferramentas de linting e análise estática para a padronização.

A integridade dos dados é garantida por uma política de governança implementada via GitHub, utilizando o fechamento de PRs como o único ponto de promoção dos dados para o ambiente de produção.

O mecanismo de promoção segue da seguinte forma:

- **Iniciação por Pull Request (PR)**: O engenheiro de dados inicia o processo ao criar um PR. A aplicação de uma label de promoção no PR dispara imediatamente um conjunto de testes de controle de qualidade de dados (DQC - Data Quality Checks).

- **Controle de Qualidade Automatizado**: O sistema de CI impede o merge do PR se os dados na camada tratada não passarem nos testes de consistência. O engenheiro é forçado a corrigir o processo até que os dados atendam aos critérios de aprovação definidos.

- **Revisão e Conformidade por Pares**: O PR exige a revisão de um segundo engenheiro (revisão por pares). O foco da revisão transcende o código; ele garante a aplicação da política de dados, incluindo:
    - Validação da cobertura e adequação dos testes de qualidade.         Conformidade do esquema e aderência às regras do manual de estilo (e.g., nomeações de colunas).
    - Adequação da documentação de metadados.
- **Promoção Controlada**: Somente após a aprovação de todos os testes automatizados e a revisão por pares, o PR pode ser concluído. O merge aciona a GitHub Action, que cria uma réplica dos dados da camada tratada_ (Desenvolvimento) para a camada validada_ (Produção).

Este fluxo garante que toda atualização em Produção seja revisada, documentada e rastreável no GitHub, transformando a prática padrão de CI/CD em uma política de governança de dados rigorosa e auditável.

### Metabase

A solução de visualização de dados proposta foi o Metabase,  uma ferramenta open-source de business intelligence que tem como foco ser simples e intuitiva.  O Metabase foi conectado apenas ao ambiente de produção do BigQuery, garantindo que as análises fossem feitas apenas com dados previamente validados. 

Uma vantagem dessa ferramenta é a facilidade de integração com o BigQuery. Ela é feita por meio de um conector nativo, o que torna o processo simples e assegura compatibilidade e desempenho otimizado nas consultas. 

O Metabase foi alocado em uma Máquina Virtual¹, hospedada no GCP, o que garante o custo reduzido, porque assim usamos a versão open source da ferramenta. Isso faz com que tenhamos controle sobre a infraestrutura e flexibilidade para ajustes de recursos conforme a demanda. 

## Fase 3: Coleta e tratamento dos dados

A baixa frequência de atualização dos dados de interesse do cliente (predominantemente anual) e a busca por contenção de custos tornaram a implementação de uma infraestrutura de pipelines de dados inviável. 

Para atender à necessidade de atualização dentro dessas restrições, padronizamos o desenvolvimento com códigos Python e fizemos uma documentação robusta. Isso fez com que o processo de atualização demandar uma curva de aprendizado curta, e assim, conseguimos garantir que a gestão do processo pudesse ser executada por um profissional do próprio cliente, minimizando o custo de manutenção

Cada rotina de ingestão no Data Lake House seguiu o seguinte modelo: um código central que automatiza a coleta até o carregamento no BigQuery e um arquivo de configuração. Este arquivo de configuração contém apenas as variáveis essenciais para a atualização dos dados, isolando a lógica de negócio e garantindo que as novas ingestões no BigQuery sejam feitas de forma rápida e segura. 

Além disso, nos baseamos no nosso Manual de Estilo, que orientou os engenheiros no processo de tratamento de dados para a padronização de nomes das colunas, tabelas e conjuntos. 

### Coleta, Tratamento e Ingestão em Python:

Como o objetivo do projeto era centralizar dezenas de tabelas provenientes de diversas fontes, o processo de coleta envolveu múltiplos formatos, como CSV, Parquet, TXT, JSON, Shapefile e também web scraping. O Python é uma linguagem muito útil nesse caso, pois possui muitos pacotes e ferramentas para extração de dados. As principais bibliotecas utilizadas para coleta foram: Requests, urllib.request, httpx, BeautifulSoup, Selenium, aiohttp.

Como já dito, cada tabela possui um código de coleta e ingestão próprio, que foram organizados no GitHub por estrutura modular. A padronização dos dados é feita sempre que possível em formato long, onde cada linha representa uma única observação. 

Para algumas tabelas foi necessário realizar pequenos tratamentos para se adequar  aos padrões de ingestão exigidos pelo BigQuery. Entre esses ajustes, destacam-se a padronização dos nomes das colunas, já que o BigQuery não permite caracteres especiais, como ponto (.) e hífen (-), nem colunas com nomes duplicados. 

Além disso, também realizamos o tratamento em Python de arquivos em formatos como JSON e Shapefile, pois percebemos que era mais eficiente quando realizado antes da carga no Storage e BigQuery.

O último processo de tratamento que optamos realizar via Python foi o particionamento de tabelas com grande volume de dados, o que contribui para melhor organização e otimização de custos. Para as transformações realizadas em Python usamos as bibliotecas: Pandas, Numpy, Geopandas, Pyarrow e Json. 

Para a ingestão de dados, por fim, foi criada uma cópia adaptada do nosso pacote da BD para padronizar 3 processos:  a subida dos dados no Google Cloud Storage, a criação e conexão com a tabela no Bigquery e, a criação de um conjunto de dados no BigQuery. Esse pacote permitiu que a subida de dados fosse mais simples e a adaptação feita garantiu que a nomenclatura das camadas fosse respeitada. 

### Tratamento e Validação via Data Build-Tool (DBT)

O Data Build Tool (dbt) foi adotado como o framework central para transformação, validação e documentação de dados no ambiente do BigQuery. Neste projeto, utilizamos a transformação via DBT para  transição do estágio de bruto_ para tratada_ e também para as validações que habilitam a passagem dos dados de tratada_ para validada_ . 

As consultas de transformação (modelos dbt) e os esquemas que definem os metadados são armazenados em conjunto com os scripts de ingestão, facilitando a visualização completa do fluxo de dados. A decisão de organizar todos os ativos (transformação, metadados e lógica de ingestão) de uma mesma tabela em uma única pasta, embora pareça trivial, otimiza muito a manutenção.

Utilizamos alguns testes padrão do DBT, mas também criamos alguns para adequar as necessidades específicas do projeto. Os testes aplicados foram: 

1. ***Códigos institucionais padronizados**:  foi validado que as colunas de códigos de município e UF eram compatíveis entre todas tabelas do data lakehouse.

2. **Baixa proporção de valores nulos**: foi validado que as colunas da tabela apresentavam uma proporção mínima de 95% de preenchimento.

3. **Unicidade de chaves primárias**: foi validado que a combinação de coluna que identifica cada linha é única, assegurando a ausência de duplicatas ou erros de preenchimento.

4. **Validação de valores**: foi validado que algumas colunas só assumem valores dentro de um conjunto esperado.

## Fase 4: Documentação

Uma boa documentação é essencial para que um projeto se torne independente e duradouro, mantido ao longo do tempo sem depender exclusivamente de um grupo específico de analistas. Para isso estruturamos a documentação em quatro frentes: Infraestrutura, Processo de Ingestão, Governança de Acessos e Guia de Acesso aos Dados.

A seção de Infraestrutura detalha as decisões arquitetônicas e as características técnicas da solução implementada. Esse registro facilita o entendimento da equipe no presente e prepara o caminho para futuras auditorias ou evoluções.

A documentação do Processo de Ingestão é focada no objetivo de autonomia da equipe na atualização de dados. Ela inclui o processo necessário para a primeira ingestão de uma tabela e um tutorial passo a passo para a sua atualização. Além disso, nessa fase disponibilizamos o Manual de Estilo das tabelas. Com essas documentações, qualquer membro da equipe pode incorporar novas tabelas seguindo os padrões de qualidade e governança, habilitando que o sistema cresça de forma organizada, mesmo com pessoas novas contribuindo. 

A seção de Governança de Acessos estabelece a estrutura de responsabilidades para a atualização e o uso da plataforma. Esta documentação é crucial para definir procedimentos que garantam o Princípio do Mínimo Privilégio, controlando o acesso e prevenindo o uso indevido de recursos. Desta forma, damos as ferramentas para que a equipe responsável mantenha a segurança da plataforma e otimize a gestão de custos.

Por fim, o Guia de Acesso aos Dados permite que os analistas acessem os dados diretamente utilizando ferramentas de análise que já dominam, como Python e R.

## Conclusão

Este projeto foi além da implementação de um data lakehouse: criamos um ecossistema completo que une a robustez do GCP, a colaboração do GitHub e a acessibilidade do Metabase. A arquitetura proposta resolve uma dor real: a dificuldade de centralizar e analisar dados públicos de forma organizada e segura. Mais importante, ela é sustentável - documentada, versionada e preparada para evoluir com novas demandas. Para o futuro, este case mostra como é possível construir ambientes de dados maduros para diferentes projetos, para o setor público e até organizações de impacto social. 

Precisa de ajuda com a infraestrutura de dados do seu projeto, empresa ou organização? 

Como organização sem fins lucrativos, a Base dos Dados possui uma área de serviços e consultoria que viabiliza financeiramente o nosso projeto. Temos uma equipe especializada para estruturar ambientes em nuvem, desenhar modelagens de dados e implementar pipelines e APIs para ingestão, tratamento e integração entre dados públicos e privados. 

Conheça mais sobre os [serviços de arquitetura de dados](https://basedosdados.org/services#arquitetura-de-dados) da BD.


 - - - 
  ¹Componentes: **Instância e2-medium (2 vCPUs, 4 GB RAM), Armazenamento (30 GB SSD) e Endereço IP Estático (1)**.