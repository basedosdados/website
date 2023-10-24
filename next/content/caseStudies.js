export function CaseStudiesPaged() {
  const CaseStudiesResumed = CaseStudiesContent

  CaseStudiesResumed.map((elm) => {
    delete elm.thumbnail
    delete elm.title
    delete elm.imgDescription
    delete elm.description
    delete elm.sector
    delete elm.body
  })

  return CaseStudiesResumed
}

export const CaseStudiesContent = [
  {
    id: "fundacao-lemann",
    displayTitle: "Fundação Lemann",
    thumbnail: "https://storage.googleapis.com/basedosdados-website/estudos_de_caso/thumbnails/thumbnail_estudo_de_caso_flemann.png",
    title: "Fundação Lemann aprimora tomada de decisão e monitoramento de metas com tecnologia de análises e engenharia de dados desenvolvida pela BD",
    img: "https://storage.googleapis.com/basedosdados-website/estudos_de_caso/imagens/estudo_de_caso_flemann.png",
    imgDescription: "Foto: Samuel Macedo para Fundação Lemann",
    description: "Com mais de 61 redes de ensino apoiadas e mais de 28 mil escolas envolvidas, implementar um fluxo de análise de dados e indicadores foi fundamental para a Fundação Lemann compreender melhor o cenário da educação no Brasil, avaliar os programas apoiados e estabelecer metas estratégicas para potencializar o avanço da educação e o impulsionamento de lideranças no país.",
    logo: {
      img: "https://storage.googleapis.com/basedosdados-website/estudos_de_caso/logos/flemann.png",
      width: 245,
      height: 85
    },
    about: "Organização que trabalha para garantir educação de qualidade para todas as crianças brasileiras e apoia líderes focados no desenvolvimento social do Brasil.",
    resume: "Com mais de 61 redes de ensino apoiadas e mais de 28 mil escolas envolvidas, implementar um fluxo de análise de dados e indicadores foi fundamental para a Fundação Lemann compreender melhor o cenário da educação no Brasil, avaliar os programas apoiados e estabelecer metas estratégicas para potencializar o avanço da educação e o impulsionamento de lideranças no país. A BD trouxe soluções práticas para tornar isso possível, com a reestruturação da arquitetura dos dados utilizados pela Fundação, tratamento e disponibilização de novas bases de dados em um repositório online, análise das informações coletadas e construção de painéis interativos atualizados automaticamente.",
    sector: "Educação",
    body: `
      <div>
        <p class="bodyText">
          Com mais de 61 redes de ensino apoiadas e mais de 28 mil escolas envolvidas,
          implementar um fluxo de análise de dados e indicadores foi fundamental para
          a Fundação Lemann compreender melhor o cenário da educação no Brasil, avaliar
          os programas apoiados e estabelecer metas estratégicas para potencializar o
          avanço da educação e o impulsionamento de lideranças no país. A BD trouxe soluções
          práticas para tornar isso possível, com a reestruturação da arquitetura dos dados
          utilizados pela Fundação, tratamento e disponibilização de novas bases de dados em um
          repositório online, análise das informações coletadas e construção de painéis interativos
          atualizados automaticamente. 
        </p>

        <p class="bigTitle">Resultados da parceria</p>
        <ul style="margin-bottom: 48px">
          <li>Análise do cenário atual da educação brasileira através de dados e indicadores;</li>
          <li>Mapeamento de escolas com melhor desempenho e equidade racial para replicar boas práticas;</li>
          <li>Acompanhamento e avaliação programas apoiados pela Fundação Lemann;</li>
          <li>Criação de metas estratégicas e viáveis de atuação;</li>
          <li>Geração de mais autonomia para a equipe da Fundação Lemann na análise de dados.</li>
        </ul>

        <div class="sectionText">
          <p class="bodyText">
            A <a href="https://fundacaolemann.org.br/" target="_blank">Fundação Lemann</a> acredita que um Brasil feito por todos e para todos é um Brasil
            que investe no seu maior potencial: gente. Isso só acontece com educação de qualidade
            e com o apoio a pessoas que querem resolver os grandes desafios sociais do país.
            Sendo assim, a Fundação busca colaborar com pessoas e instituições em iniciativas
            de grande impacto que garantam a aprendizagem de todos os alunos e a formação de
            líderes que resolvam os problemas sociais do país, levando o Brasil a um salto de
            desenvolvimento com equidade. 
          </p>

          <p class="bodyText">
            Dados e evidências sempre orientaram a atuação da Fundação Lemann.
            O monitoramento de indicadores educacionais é essencial para o sucesso
            de programas como Formar e Educar pra Valer, que têm gerado impactos
            positivos em um universo de 2,8 milhões de estudantes. As contribuições
            da Fundação à construção da Base Nacional Comum Curricular, ao reunir
            expertise internacional com o conhecimento de especialistas e gestores brasileiros,
            são outro exemplo que viabilizam a construção de um documento tecnicamente robusto.
          </p>

          <p class="bodyText">
            Mas novos desafios exigem novas estratégias. Ao desenhar uma visão de longo
            prazo para os seus próximos 10 anos de atuação, a Fundação Lemann entendeu que,
            num mundo transformado cada vez mais rapidamente pelo big data e pelas ferramentas
            de machine learning e inteligência artificial, precisaria elevar a um outro patamar
            a sua capacidade de compreensão, tratamento e análise de dados para tomada de decisão.
            Ao mesmo tempo, mais que produzir estudos e pesquisas, se fazia necessário potencializar
            a conexão entre teoria e prática, contribuindo para a construção efetiva de políticas
            de estímulo ao capital humano baseadas em evidências. 
          </p>

          <p class="bodyText">
            Com o objetivo de estruturar e implementar essa estratégia, foi criada em 2022
            na Fundação a área de Conhecimento, Dados e Pesquisa. Sua primeira iniciativa foi
            convidar a BD para apoiar a operacionalização desta estratégia, contribuindo com
            a construção de um fluxo de estruturação e análise de dados e indicadores.
            A BD trouxe soluções práticas para tornar isso possível, com a reestruturação
            da arquitetura dos dados utilizados pela Fundação, tratamento e disponibilização
            de novas bases de dados em um repositório online, análise das informações coletadas
            e construção de painéis interativos que serão atualizados automaticamente. 
          </p>
        </div>

        <div class="citationBox" style="margin-top: 48px">
          <p>
            ”A Fundação sempre se orientou por dados e evidências,
            buscando em seus programas identificar e acompanhar os
            principais indicadores. Mas faltava um elemento de integração
            entre os dados das diversas iniciativas, permitindo maior
            inteligência organizacional e capacidade de análise.
            Foi esse passo que começamos a dar com a parceria com a BD.”
          </p>
          <p class="cited">
            Daniel De Bonis, Diretor de Conhecimento, Dados e Pesquisa
          </p>
        </div>

        <p class="bigTitle">Mapeamento das escolas com melhores práticas de gestão</p>
        <div class="sectionText">
          <p class="bodyText">
            Além de compreender o cenário atual da educação no Brasil,
            o uso de dados e indicadores disponibilizados pela BD auxiliou
            a Fundação a acompanhar e avaliar o impacto e resultados dos
            programas apoiados de maneira prática. Nossa equipe de engenharia
            de dados e de analistas idealizou e construiu painéis com informações
            abrangentes sobre as frentes de impacto da Fundação.
          </p>

          <p class="bodyText">
            Pelos painéis, ficou muito mais simples acompanhar indicadores atualizados
            e projeções da educação brasileira, o impacto dos programas apoiados,
            metas estabelecidas, localização de escolas impactadas, o perfil racial
            e de gênero da ocupação de cargos de liderança no governo federal,
            além de inúmeros outros projetos. Segundo o Diretor de Conhecimento,
            Dados e Pesquisa da Fundação Lemann, Daniel De Bonis, “o próprio processo
            de construção dos painéis foi uma forma de acionar e fortalecer a inteligência
            coletiva da Fundação, ao provocar as equipes multifuncionais a refletir sobre
            seus KPIs e as melhores formas de visualizar, interpretar e explorar as informações
            disponíveis, utilizando sempre a metodologia ágil para uma interação produtiva com a equipe da BD”.
          </p>

          <p class="bodyText">
            Isso é possível porque os painéis apresentam visualizações que envolvem
            dados públicos minuciosamente tratados e padronizados pela BD,
            como o Censo da Educação Básica (Inep), Avaliação Nacional de Alfabetização (ANA),
            Sistema Nacional de Avaliação da Educação Básica (Saeb), Portal da Transparência (CGU),
            PNAD (IBGE), ESTADIC e MUNIC (IBGE), e mais.
          </p>

          <p class="bodyText">
            Um exemplo mais recente da construção de painéis que auxiliam o acompanhamento
            desses importantes indicadores foi com os dados do Sistema de Avaliação da Educação Básica (Saeb).
            Daniel explica como a parceria possibilitou a análise desses dados de maneira
            ágil e prática: “Com apoio da BD pudemos, em tempo recorde, construir uma
            plataforma de análise dos dados do Saeb 2021. No mesmo dia da divulgação
            dos dados da avaliação educacional, os painéis estavam operacionais,
            permitindo aos times dos programas analisar o desempenho das redes de ensino
            com diferentes filtros e recortes.”
          </p>

          <div class="highlightsBox" style="margin-top: 48px">
            <p>Os dados dos principais indicadores educacionais tratados pela BD são abertos a todos:</p>
            <ul>
              <li><a href="https://basedosdados.org/dataset/e083c9a2-1cee-4342-bedc-535cbad6f3cd?table=0308fbe0-270c-4135-9115-ea1100f400f6" target="_blank">Sistema de Avaliação da Educação Básica (Saeb)</a></li>
              <li><a href="https://basedosdados.org/dataset/140554cd-8062-4c9c-80fa-363cee3603e3?table=99597e72-0796-4de3-8542-f4fd8f3ccfa4" target="_blank">Avaliação Nacional de Alfabetização (ANA)</a></li>
              <li><a href="https://basedosdados.org/dataset/0cde957f-1b58-425a-b6cd-ba1208515537?table=83062c5c-6b1f-4d54-8cf2-9f541e835bf0" target="_blank">Pesquisa Nacional por Amostra de Domicílios (PNAD)</a></li>
              <li><a href="https://basedosdados.org/dataset/dae21af4-4b6a-42f4-b94a-4c2061ea9de5?table=62f7bef8-36f3-4c9b-bc79-882a2ebbed8f" target="_blank">Censo da Educação Básica</a></li>
            </ul>
          </div>

          <p class="bodyText">
            Para além dos dados públicos, foram organizados e tratados dados e indicadores
            relacionados aos próprios programas apoiados pela Fundação, integrando informações
            de diferentes naturezas e origens de forma articulada e compreensível para as equipes.
            Essa abordagem sistêmica tem sido chave para o fortalecimento de uma cultura orientada
            para dados e evidências, criando um vocabulário comum para tratar de indicadores,
            metas e pautando os processos de aprendizagem organizacional. Daniel explica também
            que “os painéis e análises têm sido ferramentas bastante importantes no processo
            decisório, ajudando as equipes a visualizar e compreender informações de forma mais
            ágil e com menos ruído.”
          </p>
        </div>

        <p class="bigTitle" style="margin-top: 48px">Mais autonomia na análise de dados e evidências</p>
        <div class="sectionText">
          <p class="bodyText">
            A construção de uma cultura orientada para dados e evidências
            também demanda o desenvolvimento de competências analíticas em
            todo o time – uma necessidade ainda maior num contexto de implementação
            de uma estrutura matricial e de metodologia ágil, adotadas pela Fundação
            a partir de 2022. A BD assumiu papel fundamental neste processo,
            apoiando a equipe da Fundação Lemann com formações interativas sobre
            ferramentas de dados como <a href="https://www.metabase.com/" target="_blank">Metabase</a> e
            <a href="https://cloud.google.com/bigquery" target="_blank">BigQuery</a>, bem como atividades
            formativas para orientar a exploração de conjuntos de dados específicos,
            como os do <a href="https://basedosdados.org/dataset/programme-for-international-student-assessment?external_link=Baixar" target="_blank">Programa Internacional de Avaliação de Estudantes</a> (Pisa). 
          </p>

          <p class="bodyText">
            A parceria entre a BD e a Fundação Lemann uniu equipes dedicadas
            a construir conhecimento, gerar insights e compreender cenários
            para desenvolver projetos que impulsionam ativamente o avanço da
            educação no Brasil e a formação de lideranças preparadas e com representatividade.
            Acreditamos que a tomada de decisão baseada em dados e evidências é uma ferramenta
            fundamental para implementar mudanças efetivas na sociedade e sabemos
            também que essa cultura começa conosco.
          </p>

          <p class="bodyText">
            Saiba mais sobre a Fundação Lemann <a href="https://fundacaolemann.org.br/" target="_blank">aqui</a>.  
          </p>
        </div>
      </div>
    `,
  },
  {
    id: "jota",
    displayTitle: "JOTA",
    thumbnail: "https://storage.googleapis.com/basedosdados-website/estudos_de_caso/thumbnails/thumbnail_estudo_de_caso_jota.png",
    title: "Plataforma traz mais transparência para a prestação de contas de candidaturas e partidos nas Eleições 2022",
    img: "https://storage.googleapis.com/basedosdados-website/estudos_de_caso/imagens/estudo_de_caso_jota.png",
    imgDescription: "Foto: Tribunal Superior Eleitoral (TSE)",
    description: "Criada pela BD em parceria com o JOTA, empresa de jornalismo e tecnologia, a plataforma Siga o Dinheiro auxiliou população e imprensa no monitoramento do financiamento de campanhas eleitorais nas eleições de 2022. O projeto se tornou uma importante ferramenta para a transparência pública e o combate à corrupção no processo eleitoral.",
    logo: {
      img: "https://storage.googleapis.com/basedosdados-website/estudos_de_caso/logos/jota.svg",
      width: 222,
      height: 85
    },
    about: "Empresa de jornalismo e tecnologia para tomadores de decisão que tem como missão tornar as instituições brasileiras mais transparentes e previsíveis.",
    resume: "Criada pela BD em parceria com o JOTA, empresa de jornalismo e tecnologia, a plataforma Siga o Dinheiro auxiliou população e imprensa no monitoramento do financiamento de campanhas eleitorais nas eleições de 2022. O projeto se tornou uma importante ferramenta para a transparência pública e o combate à corrupção no processo eleitoral.",
    sector: "Política",
    body: `
      <div>
        <p class="bodyText">
          Criada pela BD em parceria com o JOTA, empresa de jornalismo e tecnologia, a plataforma
          <a href="https://sigaodinheiro.org/" target="_blank">Siga o Dinheiro</a> auxiliou população e imprensa no monitoramento das despesas
          e receitas de campanhas eleitorais nas eleições de 2022. O projeto se tornou uma
          importante ferramenta para a transparência pública e o combate à corrupção no processo
          eleitoral.
        </p>

        <p class="bigTitle">Resultados da parceria</p>
        <ul style="margin-bottom: 48px">
          <li>Fornecimento de dados atualizados para coberturas jornalísticas das eleições e acompanhamento da sociedade;</li>
          <li>Produção de análises qualificadas sobre a prestação de contas nas eleições;</li>  
          <li>Dados de despesas e receitas das eleições para apuração de mais de 20 reportagens publicadas em 5 veículos de comunicação diferentes.</li>
        </ul>

        <p class="bodyText">
          Construído com tecnologia de ponta para extrair e organizar automaticamente as informações
          do Tribunal Superior Eleitoral (TSE), o painel traz dados atualizados sobre
          o financiamento das eleições. A plataforma permite a seleção de diversos recortes a partir
          de filtros geográficos, raciais, de gênero e muito mais.
        </p>

        <p class="bigTitle" style="margin-top: 48px">Siga o Dinheiro na apuração jornalística</p>

        <div class="sectionText">
          <p class="bodyText">
            O projeto <a href="https://sigaodinheiro.org/" target="_blank">Siga o Dinheiro</a> foi fundamental para mapear desigualdades e
            inconsistências no financiamento das eleições de 2022. A ferramenta
            foi utilizada na apuração de mais de 20 reportagens com temas como as
            <a href="https://www.jota.info/eleicoes/candidatos-brancos-a-camara-tiveram-em-media-o-dobro-de-recursos-dos-pretos-05102022" target="_blank">diferenças raciais e de gênero no financiamento de campanhas</a>,
            <a href="https://www.jota.info/opiniao-e-analise/colunas/siga-o-dinheiro/o-efeito-da-tecnologia-sobre-o-financiamento-eleitoral-30082022" target="_blank">o efeito da tecnologia no financiamento eleitoral</a>,
            <a href="https://www.jota.info/eleicoes/contas-de-campanha-mostravam-que-candidato-a-deputado-teria-recebido-r-400-milhoes-30082022" target="_blank">lacunas nas prestações de contas</a>,
            <a href="https://www.jota.info/eleicoes/quem-sao-os-candidatos-a-deputado-que-mais-receberam-recursos-de-campanha-10092022" target="_blank">candidatos que receberam mais recursos para suas campanhas</a>,
            entre outros. Para Kalleo Coura, editor executivo do JOTA em São Paulo,
            “os dados das prestações de contas das campanhas foram organizados de forma
            simples e intuitiva nos painéis da plataforma, o que possibilitou identificar
            inconsistências e tendências interessantes”.
          </p>

          <div class="contentImgCenter" style="margin: 48px 0">
            <a href="https://sigaodinheiro.org/#desigualdades" target="_blank">
              <img alt="seção "desigualdades” do painel Siga o Dinheiro" src="https://storage.googleapis.com/basedosdados-website/estudos_de_caso/paineis/painel_siga_o_dinheiro.png">
            </a>
          </div>

          <p class="bodyText">
            O painel facilitou a apuração de reportagens que deixam explícitas as profundas
            desigualdades na distribuição de recursos para campanhas. Com filtros que permitem
            explorar a proporção de receitas e despesas entre os diferentes perfis de candidaturas,
            o painel possibilitou análises que identificaram a falta de recursos para candidaturas indígenas 
            – <a href="https://www.jota.info/eleicoes/30-das-candidatas-indigenas-a-camara-nao-receberam-recursos-para-campanha-30092022" target="_blank"> 30% das candidaturas não receberam nenhum recurso para suas campanhas</a>
            – e a disparidade entre os recursos destinados a candidatos brancos e pretos,
            com o <a href="https://www.jota.info/eleicoes/candidatos-brancos-a-camara-tiveram-em-media-o-dobro-de-recursos-dos-pretos-05102022" target="_blank"> primeiro grupo acumulando o dobro no financiamento</a>.
          </p>
        </div>

        <div class="citationBox" style="margin-top: 48px">
          <p>
            “Durante a corrida eleitoral, foi substancial ter acesso à visualização do Siga o Dinheiro,
            que usou dados abertos da Justiça Eleitoral que nem sempre seriam facilmente combinados e
            cruzados para produzir conteúdo de interesse público. Na cobertura, essas informações
            ajudaram a embasar reportagens sobre os candidatos que mais receberam investimentos
            de recursos públicos para campanha, mas, principalmente, para mostrar as desigualdades
            regionais, partidárias, de gênero e raciais. Com dados apresentados pela plataforma,
            mostramos que candidatos brancos à Câmara dos Deputados tiveram em média o dobro de
            recursos dos pretos e que um quinto das mulheres não tinham recebido nem R$ 1 de seus
            partidos, por exemplo.”
          </p>
          <p class="cited">
            Letícia Paiva, Repórter do JOTA
          </p>
        </div>

        <div class="sectionText">
          <p class="bodyText">
            Além de ajudar a identificar tendências do financiamento das campanhas para cargos federais,
            a possibilidade de criar recortes regionais facilitou o <a href="https://folhabv.com.br/noticia/ELEIcOES-2022/ELEIcOES-2022/Saiba-quem-recebeu-os-valores-mais-altos-para-fazer-campanha-em-RR/90559" target="_blank">acompanhamento dos gastos em estados
            como Roraima</a>, por exemplo. A ferramenta ajudou também na identificação de irregularidades
            e erros nas prestações de contas de candidatos e partidos. Foi o caso do Partido Socialista
            Brasileiro (PSB), que declarou uma <a href="https://www.jota.info/eleicoes/contas-de-campanha-mostravam-que-candidato-a-deputado-teria-recebido-r-400-milhoes-30082022" target="_blank">receita de mais de R$ 400 milhões do Fundo Especial de
            Financiamento de Campanha do sindicalista Zé Francisco</a>, o que o colocaria na primeira
            posição entre os candidatos que mais receberam recursos públicos em toda a eleição de 2022.
          </p>
        </div>

        <p class="bigTitle" style="margin-top: 48px">Tecnologia de ponta trabalhando pela transparência e acessibilidade</p>
        <div class="sectionText">
          <p class="bodyText">
            O painel foi desenvolvido através da combinação de técnicas de extração automatizada e de
            um rigoroso processo de tratamento e padronização de dados. Isso permitiu o acesso em tempo
            real às informações do Tribunal Superior Eleitoral (TSE), apresentadas em um formato intuitivo,
            onde os usuários podem pesquisar e criar seus próprios recortes com filtros por estado,
            partido, cargo, gênero, raça e mais. 
          </p>

          <p class="bodyText">
            A BD também disponibiliza em sua plataforma os dados atualizados de receitas e despesas,
            possibilitando o download das tabelas tratadas ou o acesso por ferramentas de análise de dados,
            como SQL, Python, R e Stata.
          </p>

          <p class="bodyText">
            Acesse os dados atualizados das <a href="https://basedosdados.org/dataset/eef764df-bde8-4905-b115-6fc23b6ba9d6?table=2e204854-e453-4257-9fef-5e10f3ff1f56" target="_blank">eleições brasileiras</a>.
          </p>
        </div>
      </div>
    `,
  },
]
