import { CopyIcon } from "../public/img/icons/copyIcon";

export const QuestionFAQ = [
  {
    question: "Os dados da BD são públicos ou privados?",
    answer: function() {
      return (
        <div id="public-or-private" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Em sua grande maioria, as bases de dados encontradas em nossa plataforma são públicas.
          Porém, também estão listadas algumas bases privadas.
          Nossa organização não possui fins lucrativos, portanto, não comercializamos a listagem de bases em nossa plataforma.
          Acreditamos ser útil listar conjuntos de dados privados, uma vez que as pessoas podem ter interesse em
          adquirí-las ao encontrá-las em nosso site.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "público, privado",
    id: "public-or-private"
  },
  {
    question: "Preciso pagar para acessar os dados da BD?",
    answer: function() {
      return (
        <div id="do-i-have-to-pay" style={{display: "flex", flexDirection: "column"}}>
          <p>
          O acesso à maioria dos dados oferecidos pela BD é grátis. Só em dois casos pode ser necessário pagamento. São esses:
          </p>
          <p>
          1. Alguns dados fazem parte dos nossos planos avançados, Pro e Empresas, como indicado nas páginas das tabelas. Nesse caso é necessário uma assinatura para acessar os dados.
          </p>
          <p>
          2. Uma forma de acessar nossos dados é através do BigQuery, no Google Cloud, que oferece até 1 Terabyte gratuito por mês para seus usuários. Ressaltamos que esse limite costuma ser o suficiente, mesmo para análises com bases mais robustas, como a RAIS ou Censo Escolar. Caso você ultrapasse esse limite, o BigQuery cobra 5 dólares por terabyte de dados que sua consulta irá processar.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "pagar, custo, gratuito, grátis, mensalidade",
    id: "do-i-have-to-pay"
  },
  {
    question: "É possível fazer o download dos dados da BD?",
    answer: function() {
      return (
        <div id="download" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Sim, você pode baixar o arquivo CSV completo das tabelas tratadas direto na plataforma.
          No entanto, tabelas com mais de 200.000 linhas só podem ser acessados através do nosso data lake no BigQuery ou dos nossos pacotes em Python e R.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "download, baixar, CSV, arquivo",
    id: "download"
  },
  {
    question: "Qual é o limite de download dos dados da BD na plataforma?",
    answer: function() {
      return (
        <div id="download-limit" style={{display: "flex", flexDirection: "column"}}>
          <p>
            O limite para download dos dados na nossa plataforma é de 200.000 linhas.
            Para acessar tabelas que ultrapassam esse limite, utilize nosso <i>datalake</i> no BigQuery ou nossos pacotes em Python e R.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "limite, download, baixar, tamanho, máximo, arquivo",
    id: "download-limit"
  },
  {
    question: "Quais tipos de dados encontro na BD?",
    answer: function() {
      return (
        <div id="data-resources" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Em nossa plataforma, você encontra três tipos de dados: tabelas tratadas, fontes originais e pedidos LAI.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "tipo, categoria",
    id: "data-resources"
  },
  {
    question: "O que são tabelas tratadas?",
    answer: function() {
      return (
        <div id="tables" style={{display: "flex", flexDirection: "column"}}>
          <p>
          São tabelas prontas para análise, disponíveis via SQL, Python e R.
          O processo de tratamento das tabelas envolve a padronização de nomes de variáveis e compatibilização de códigos, o que permite que o cruzamento de tabelas de diferentes instituições e temas seja tão simples quanto qualquer outra consulta.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "tratada, tratado, BD+, tabela, datalake, cruzar, cruzamento, padronização, compatibilização",
    id: "tables"
  },
  {
    question: "O que são fontes originais?",
    answer: function() {
      return (
        <div id="external-links" style={{display: "flex", flexDirection: "column"}}>
          <p>
          São links para páginas externas à plataforma com informações úteis sobre o conjunto de dados.
          A maioria destes são dados que ainda não disponibilizamos na BD como tabelas tratadas.
          Tentamos sempre fornecer o caminho mais próximo possível à fonte para baixar os dados originais.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "fonte original, externo",
    id: "external-links"
  },
  {
    question: "O que são pedidos LAI?",
    answer: function() {
      return (
        <div id="information-requests" style={{display: "flex", flexDirection: "column"}}>
          <p>
            São pedidos feitos através da Lei de Acesso à Informação (LAI).
            A LAI, lei nº 12.527/2011 regulamenta o direito, previsto na Constituição,
            de qualquer pessoa solicitar e receber dos órgãos e entidades públicos,
            de todos os entes e Poderes, informações públicas por eles produzidas ou custodiadas.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "LAI, acesso à informação, lei",
    id: "information-requests"
  },
  {
    question: "Como acessar as tabelas tratadas?",
    answer: function() {
      return (
        <div id="access-tables" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você pode consultar as tabelas tratadas BD+ de diferentes maneiras.
            Além de fazer o download direto na plataforma,
            é possível explorar os dados com SQL através do BigQuery ou com os pacotes em Python e R.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "acesso, consulta, tratada, tratado, BD+, download, baixar, pacote, SQL, BigQuery, Python, R",
    id: "access-tables"
  },
  {
    question: "Como acessar as fontes originais?",
    answer: function() {
      return (
        <div id="access-external-links" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você pode acessar as fontes originais dos dados clicando no botão de redirecionamento para o link externo à plataforma.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "acesso, consulta, fonte original, externo",
    id: "access-external-links"
  },
  {
    question: "Como acessar os pedidos LAI?",
    answer: function() {
      return (
        <div id="access-information-requests" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você pode acessar os pedidos LAI clicando no botão de redirecionamento para o link externo à plataforma.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "acesso, consulta, LAI, acesso à informação, lei",
    id: "access-information-requests"
  },
  {
    question: "O que são diretórios?",
    answer: function() {
      return (
        <div id="directories" style={{display: "flex", flexDirection: "column"}}>
          <p>
            São tabelas que ligam diversos códigos institucionais e informações de diferentes entidades brasileiras.
            Isso é importante porque resolve o problema de não existir um identificador único para entidades – como UF,
            município, escola, distrito, setor censitário, categorias CID-10 e CID-9,
            CBO-2002 e CBO-1992, etc – entre instituições ou, ainda,
            a mudança de identificadores e nomes com typos entre anos e instituições.
            Para saber mais, confira nosso <a href="https://medium.com/basedosdados/diret%C3%B3rios-brasileiros-como-essa-base-facilita-sua-an%C3%A1lise-40dc8ce2ca2" target="_blank">
            tutorial </a> sobre Diretórios Brasileiros.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "diretório, entidade, identificador, chave, primária",
    id: "directories"
  },
  {
    question: "Os dados da BD são atualizados automaticamente?",
    answer: function() {
      return (
        <div id="data-updated" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Alguns dados são atualizados automaticamente e outros não.
          Temos um compromisso de atualizar automaticamente qualquer base de frequência mensal ou maior.
          Esses dados de alta frequência estão disponíveis nos nossos planos avançados, Pro e Empresas.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "atualização, automatização, frequência",
    id: "data-updated"
  },
  {
    question: "Como utilizar os pacotes da BD?",
    answer: function() {
      return (
        <div id="packages" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Nossos pacotes permitem o acesso ao <i>datalake</i> público direto do seu computador ou ambiente de desenvolvimento.
            Para começar a explorar nossos dados em Python ou R,
            siga os tutoriais de instalação dos pacotes presentes na nossa <a href="https://basedosdados.github.io/sdk/access_data_packages/" target="_blank">
            documentação</a>.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "pacote, Python, R, instalação, documentação",
    id: "packages"
  },
  {
    question: "O que é nível da observação?",
    answer: function() {
      return (
        <div id="level-of-observation" style={{display: "flex", flexDirection: "column"}}>
          <p>
            O nível da observação indica o que representa cada linha da tabela.
            É como se a combinação das colunas que compõem o nível da observação fosse uma chave primária.
            Essa informação é útil pois indica qual a menor granularidade possível de análise com aquele dado.
            Por exemplo, uma tabela  com nível da observação de estado permite que façamos uma análise no país
            (por ser mais amplo que estado), mas não uma análise por município (que já seria um recorte mais específico).
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "nível, observação, chave, primária",
    id: "level-of-observation"
  },
  {
    question: "Onde eu posso sugerir a inclusão de novos dados na plataforma?",
    answer: function() {
      return (
        <div id="data-proposal">
          <p>
            É muito importante saber quais dados a nossa comunidade precisa para que a equipe adicione os conjuntos solicitados no processo de priorização de dados.
            Temos um canal no Discord preparado para receber suas propostas e sugestões, basta você seguir os passos indicados
            lá. Acesse por <a href="https://discord.gg/Ec7tfBaTVV" target="_blank"> aqui</a>.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "inclusão, solicitação, proposta, sugestão",
    id: "data-proposal"
  },
  {
    question: "O que são os planos Pro e Empresas?",
    answer: function() {
      return (
        <div id="subscriptions">
          <p>
          Além do plano gratuito, a BD conta com planos avançados: Pro, para usuários individuais, e Empresas, para até 10 usuários de uma mesma organização.
          Nesses planos estão disponíveis além dos dados já existentes no data lake público da BD, dezenas de conjuntos de dados exclusivos priorizados para solucionar problemas e te ajudar em sua equipe, organização ou pesquisa.
          Além de conjuntos de dados exclusivos, os planos oferecem acesso à à versão mais atualizada de algumas das nossas principais tabelas, como do CNES, dados de CNPJ, do Brasileirão, dentre muitas outras.
          </p>
        </div>
      )
    },
    categories: ["Planos Pagos"],
    keywords: "pro, empresas, assinatura, dados exclusivos, pagar, custo, gratuito, grátis, mensalidade",
    id: "subscriptions"
  },
  {
    question: "Quais dados tenho acesso com os planos pagos?",
    answer: function() {
      return (
        <div id="subscriptions-data">
          <p>
          A assinatura dá acesso a dados de alta frequência atualizados.
          Esses podem às vezes ser um subconjunto de uma tabela tratada maior, ou ser uma tabela tratada inteira.
          Nosso mecanismo de busca e páginas específicas de conjuntos indicam o que é disponível gratuitamente e o que está coberto pela assinatura dos planos pagos.
          </p>
        </div>
      )
    },
    categories: ["Planos Pagos"],
    keywords: "pro, empresas, assinatura, dados exclusivos, pagar, custo, gratuito, grátis, mensalidade",
    id: "subscriptions-data"
  },
  {
    question: "Como os dados da BD Pro são atualizados?",
    answer: function() {
      return (
        <div id="subscriptions-data-update">
          <p>
          Todos os dados disponíveis na BD Pro são atualizados automaticamente via nossa tecnologia de gerência de fluxos.
          A BD usa o que há de mais moderno em engenharia de dados para garantir a mais alta qualidade e consistência no que disponibilizamos.
          </p>
        </div>
      )
    },
    categories: ["Planos Pagos"],
    keywords: "pro, empresas, assinatura, dados exclusivos, atualizacao",
    id: "subscriptions-data-update"
  },
  {
    question: "Quanto custa uma assinatura BD Pro?",
    answer: function() {
      return (
        <div id="subscriptions-prices">
          <p>
          Atualmente temos dois planos.
          O plano Pro custa R$47 por mês, dando acesso a todos os dados de alta frequência atualizados para um único usuário.
          O plano Empresas custa R$350 por mês, incluindo acesso para 10 contas e suporte prioritário com nossa equipe.
          </p>
        </div>
      )
    },
    categories: ["Planos Pagos"],
    keywords: "pro, empresas, assinatura, preco",
    id: "subscriptions-prices"
  },
  {
    question: "O que é o datalake da BD no BigQuery?",
    answer: function() {
      return (
        <div id="datalake" style={{display: "flex", flexDirection: "column"}}>
          <p>
            É um banco de dados público hospedado no BigQuery,
            ferramenta potente de armazenamento e análise de dados do Google Cloud,
            com todas as tabelas tratadas BD+ para você consultar direto do seu navegador.
            As vantagens de utilizar nosso <i>datalake</i> no BigQuery estão relacionadas à velocidade do processamento,
            escalabilidade e economia. 
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "BigQuery, Google, Cloud, datalake, BD+",
    id: "datalake"
  },
  {
    question: "Por que preciso de uma conta no Google Cloud?",
    answer: function() {
      return (
        <div id="google-account" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Nosso banco de dados público é hospedado no BigQuery,
            uma ferramenta potente de armazenamento e análise de dados do Google Cloud.
            Para esse serviço, o Google Cloud oferece até 1 Terabyte gratuito por mês para seus usuários.
            Assim, é necessário que você crie uma conta para associar as consultas do banco a você e contabilizar
            o total de processamento utilizado no mês. A criação da conta não requer nenhum cartão ou forma de pagamento prévio,
            ou seja, o BigQuery inicia automaticamente no modo Sandbox,
            que permite que você utilize os recursos sem adicionar um modo de pagamento. 
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "conta, cadastro, BigQuery, Google, Cloud",
    id: "google-account"
  },
  {
    question: "O que acontece se eu exceder o limite mensal de 1 TB gratuito do Google Cloud?",
    answer: function() {
      return (
        <div id="data-limit" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Caso você exceda o limite, são cobrados 5 dólares por Terabyte de dados que sua consulta irá processar.
            Mas ressaltamos que o limite de 1 Terabyte do Google costuma ser suficiente,
            mesmo para análises com bases mais robustas, como a RAIS ou Censo Escolar. 
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "limite, terabyte, TB, Google, Cloud",
    id: "data-limit"
  },
  {
    question: "Como criar um projeto no Google Cloud?",
    answer: function() {
      return (
        <div id="google-cloud-project" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Para criar um projeto no Google Cloud, basta ter um e-mail cadastrado no Google.
            É necessário ter um projeto seu, mesmo que vazio, para você fazer consultas em nosso <i>datalake</i> público.
          </p>
          
          <ol>
            <li>Acesse o <a href="https://console.cloud.google.com/projectselector2/home/dashboard" target="_blank">Google Cloud</a>. Caso for a sua primeira vez, aceite os Termos de Serviço.</li>
            <li>Clique em <i>Create Project/Criar Projeto</i>. Escolha um nome bacana para o projeto.</li>
            <li>Clique em <i>Create/Criar</i>.</li>
          </ol>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "criar, cadastrar, projeto, Google, Cloud",
    id: "google-cloud-project"
  },
  {
    question: "Quais as melhores práticas para fazer uma consulta no BigQuery?",
    answer: function() {
      return (
        <div id="best-practices-performance" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Para verificar uma amostra de todas as variáveis da tabela, use: 
          </p>

          <pre>
            <code className="hljs sql">
              <span style={{color: "#93c763"}}>SELECT</span> * <span style={{color: "#93c763"}}>FROM</span>  dataset.table_name LIMIT <span style={{color: "#ffcd22"}}>100</span>
            </code>
          </pre>
          
          <ul>
            <li>
              A primeira dica valiosa é selecionar as colunas que você vai usar.
              O BigQuery funciona usando um modelo colunar, portanto, quanto menos colunas você usar,
              melhor vai ser o desempenho da sua consulta. Isso significa evitar o clássico<br/> <pre><code className="hljs sql"><span style={{color: "#93c763"}}>SELECT</span> * <span style={{color: "#93c763"}}>FROM</span> table_name</code></pre> e
              escolher as colunas de seu interesse. Parece chato, mas ajuda muito!
            </li>
            <li>
              Para tabelas grandes, uma boa prática é filtrar os anos e estados de seu interesse com a cláusula <pre><code className="hljs sql" style={{color: "#93c763"}}>WHERE</code></pre>.
              Como utilizamos o sistema de particionamento, isso vai reduzir drasticamente o custo e o tempo de processamento.
            </li>
          </ul>

          <p>
            Essas são as dicas mais simples e rápidas de executar.
            Para saber mais sobre boas práticas,
            acesse o <a href="https://cloud.google.com/bigquery/docs/best-practices-performance-overview?hl=pt-br" target="_blank">manual completo</a> disponibilizado pelo  Google Cloud.
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "prática, dica, otimização, desempenho, consulta, BigQuery, selecionar, filtrar",
    id: "best-practices-performance"
  },
  {
    question: "O que são os tipos no BigQuery?",
    answer: function() {
      return (
        <div id="bigquery-types" style={{display: "flex", flexDirection: "column"}}>
          <p>
            São os tipos de dados do Google Standard SQL.
            Suas categorias incluem: INTEGER (Inteiro),
            STRING (Texto), DATE (Data), FLOAT64 (Decimal),
            GEOGRAPHY (Geográfico), entre outras.
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "tipo, categoria, BigQuery, INTEGER, STRING, DATE, FLOAT, GEOGRAPHY",
    id: "bigquery-types"
  },
  {
    question: "O que são as partições no BigQuery?",
    answer: function() {
      return (
        <div id="bigquery-partitions" style={{display: "flex", flexDirection: "column"}}>
          <p>
            As partições são divisões feitas em uma tabela para facilitar o gerenciamento e a consulta aos dados.
            Ao segmentar uma tabela grande em partições menores, a quantidade de bytes lidos é reduzida,
            o que ajuda a controlar os custos e melhora o desempenho da consulta. 
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "partição, particionamento, otimização, desempenho, BigQuery",
    id: "bigquery-partitions"
  },
  {
    question: "O que é a BD Lab?",
    answer: function() {
      return (
        <div id="bd-lab" style={{display: "flex", flexDirection: "column"}}>
          <p>
          A BD Lab é nosso braço de serviços, parcerias e projetos.
          É pela BD Lab que interagimos com outras organizações, provendo nossa expertise acumulada em tecnologia e dados.
          Enxergamos esses projetos como componente indispensável da nossa missão de promover o uso de dados para a promoção do bem-estar social.
          </p>
        </div>
      )
    },
    categories: ["BD Lab"],
    keywords: "bd lab, consultoria, projeto",
    id: "bd-lab"
  },
  {
    question: "Como surgiu a BD Lab?",
    answer: function() {
      return (
        <div id="bd-lab-origin" style={{display: "flex", flexDirection: "column"}}>
          <p>
          A BD Lab foi criada para garantir a sustentabilidade da organização, de forma a manter e expandir nossos produtos de forma gratuita.
          A prestação de serviços de dados e a realização de projetos com parceiros vêm sendo chave não só na geração de receita, mas também no fortalecimento da nossa posição de referência na disponibilização de dados de qualidade.
          </p>
        </div>
      )
    },
    categories: ["BD Lab"],
    keywords: "bd lab, consultoria, projeto, origem",
    id: "bd-lab-origin"
  },
  {
    question: "O que é a BD Edu?",
    answer: function() {
      return (
        <div id="bd-edu" style={{display: "flex", flexDirection: "column"}}>
          <p>
          A BD Edu é nosso braço de educação, com a missão de capacitar pessoas para resolver problemas com dados.
          Já prestamos serviços de formação para organizações como Vetor Brasil, Souk Analytics e ProForest, além de nossos cursos abertos ao público.
          Oferecemos cursos ao vivo e assíncronos e todo o valor arrecadado é revertido em investimento na Base dos Dados.
          </p>
        </div>
      )
    },
    categories: ["BD Edu"],
    keywords: "bd edu, educacao, formacao, curso",
    id: "bd-edu"
  },
  {
    question: "Quais cursos a BD Edu oferece?",
    answer: function() {
      return (
        <div id="bd-edu-courses" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Atualmente oferecemos cursos de análises de dados com ferramentas importantes para o mercado, como SQL, Python, editores de planilhas e Google Cloud.
          Porém, nossa equipe é capacitada para desenvolver cursos sob demanda e temos trabalhado para lançar novos modelos de formações.
          </p>
        </div>
      )
    },
    categories: ["BD Edu"],
    keywords: "bd edu, educacao, formacao, curso",
    id: "bd-edu-courses"
  },
  {
    question: "Os cursos da BD possuem certificado?",
    answer: function() {
      return (
        <div id="bd-edu-certificates" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Sim, sempre que um curso é concluído nós emitimos um certificado oficial da BD constando as informações pessoais do aluno e sobre o curso.
          O certificado é verificável e pode ser compartilhado nas redes ou anexado ao seu currículo.
          </p>
        </div>
      )
    },
    categories: ["BD Edu"],
    keywords: "bd edu, educacao, formacao, curso, certificado",
    id: "bd-edu-certificates"
  },
  {
    question: "Tenho dúvidas sobre os cursos da BD Edu, existe um canal especializado para contato?",
    answer: function() {
      return (
        <div id="bd-edu-contact" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Sim, você pode tirar suas dúvidas pelo email <a href="mailto:suporte.bdedu@basedosdados.org" target="_blank">suporte.bdedu@basedosdados.org</a>.
          Nossa equipe faz a checagem diária para prestar o melhor suporte possível.
          </p>
        </div>
      )
    },
    categories: ["BD Edu"],
    keywords: "bd edu, educacao, formacao, curso, certificado",
    id: "bd-edu-contact"
  },
  {
    question: "Qual plataforma é utilizada para as atividades dos cursos da BD Edu?",
    answer: function() {
      return (
        <div id="bd-edu-platform" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Utilizamos a plataforma coda.io, que funciona como um editor de documentos que combina recursos de planilhas, apresentações, processadores de texto e aplicativos.
          Por lá temos nossa Área do Aluno(a), onde é possível encontrar o cronograma, links para as aulas ao vivo, aulas gravadas, página de submissão de exercício, fórum de dúvidas, materiais extras e mais.
          </p>
        </div>
      )
    },
    categories: ["BD Edu"],
    keywords: "bd edu, educacao, formacao, curso, plataforma",
    id: "bd-edu-platform"
  },
  {
    question: "Quem organiza e ministra os cursos da BD Edu?",
    answer: function() {
      return (
        <div id="bd-edu-teacher" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Nossos cursos são desenvolvidos e revisados por especialistas que trabalham na equipe da Base dos Dados.
          Você pode checar o perfil de todos em nossa <a href="https://basedosdados.org/about-us" target="_blank">página institucional</a>.
          </p>
        </div>
      )
    },
    categories: ["BD Edu"],
    keywords: "bd edu, educacao, formacao, curso, suporte",
    id: "bd-edu-teacher"
  },
  {
    question: "A BD é uma empresa?",
    answer: function() {
      return (
        <div id="legal-nature" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Não. A BD é constituída como uma associação sem fins lucrativos chamada “Instituto Base dos Dados” com sede no Rio de Janeiro e com CNPJ 42.494.318/0001-16.
          </p>
        </div>
      )
    },
    categories: ["Institucional"],
    keywords: "natureza legal, empresa, ong, lucro",
    id: "legal-nature"
  },
  {
    question: "Como a BD se financia?",
    answer: function() {
      return (
        <div id="financing" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Ao longo dos anos, a BD cresceu com o apoio financeiro de usuários e de pessoas que se identificam com nossa missão.
            Hoje, contamos também com nossa área de Serviços e Parcerias (BD Lab) e nossos planos de acesso a dados exclusivos de alta frequência atualizados (BD Pro).
            Confira mais sobre a contabilidade da organização em nossa página de <a href="https://basedosdados.org/transparency" target="_blank">Transparência</a>.
          </p>
        </div>
      )
    },
    categories: ["Institucional"],
    keywords: "financiamento, sustentabilidade, contabilidade, serviço, parceria",
    id: "financing"
  },
  {
    question: "Como citar a BD?",
    answer: function() {
      return (
        <div id="reference" style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você pode referenciar de duas maneiras:
          </p>

          <ul>
            <li>Apenas com o nome “Base dos Dados” (em português), “Data Basis” (em inglês) ou “Base de los Datos” (em espanhol);</li>
            <li>A partir do <i>white paper</i> <a href="https://osf.io/preprints/socarxiv/r76yg" target="_blank">Data Basis: Universalizing Access to High-Quality Data</a>.</li>
          </ul>
          
          <div style={{display: "flex", flexDirection: "row", gridGap: "10px", position: "relative", top:"-18px", left: "18px"}}>
            <p id="textReferenceBD" style={{color:"#7D7D7D"}}>
              Dahis et al. (2022) Data Basis: Universalizing Access to High-Quality Data. Disponível em: {`<osf.io/preprints/socarxiv/r76yg>`}.
            </p>

            <button
              className="button-copy"
              onClick={() => {
                let copyText = "Dahis et al. (2022) Data Basis: Universalizing Access to High-Quality Data. Disponível em: <osf.io/preprints/socarxiv/r76yg>."
                navigator.clipboard.writeText(copyText)
              }}
              style={{display: "flex", alignItems: "center", color: "#42B0FF"}}
            >
              <CopyIcon alt="copiar citação" width="26px" height="26px" fill="#42B0FF"/>
              <div className="tooltip-button-copy">Copiar</div>
            </button>
          </div>
        </div>
      )
    },
    categories: ["Institucional"],
    keywords: "citar, citação, referência",
    id: "reference"
  },
  {
    question: "Como a BD coleta dados pessoais?",
    answer: function() {
      return (
        <div id="personal-data" style={{display: "flex", flexDirection: "column"}}>
          <p>
          Coletamos informações pessoais que você nos fornece diretamente ao usar nossos serviços.
          Isso pode incluir seu nome, endereço de e-mail, informações de pagamento e outras informações que você escolher compartilhar conosco.
          Também coletamos informações de forma automática, através de cookies, incluindo dados de uso, endereço IP, tipo de navegador, e informações sobre o dispositivo que você usa para acessar nossos serviços.
          </p>
          <p>
          Utilizamos suas informações pessoais para fornecer e melhorar nossos serviços, incluindo o processamento de pagamentos, o fornecimento de suporte ao cliente e a personalização da experiência do usuário.
          Não venderemos, alugaremos ou compartilharemos suas informações pessoais com terceiros não afiliados sem o seu consentimento explícito.
          Para mais informações, acesse nossos Termos de Uso e Políticas de Privacidade <a href="http://basedosdados.org/terms" target="_blank">aqui</a>.
          </p>
        </div>
      )
    },
    categories: ["Institucional"],
    keywords: "privacidade, uso, lgpd",
    id: "personal-data"
  },
]
