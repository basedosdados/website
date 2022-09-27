import CopyIcon from "../public/img/icons/copyIcon"

export const QuestionFAQ = [
  {
    question: "Preciso pagar para acessar os dados da BD?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você não precisa pagar para utilizar nenhum serviço oferecido pela BD.
            Porém, para acessar nossos dados tratados no BigQuery, você precisa criar um projeto no Google Cloud,
            que oferece até 1 Terabyte gratuito por mês para seus usuários. Caso você exceda esse limite,
            são cobrados 5 dólares por Terabyte de dados que sua consulta irá processar.
            Ressaltamos que esse limite costuma ser o suficiente, mesmo para análises com bases mais robustas,
            como a RAIS ou Censo Escolar. Para controlar os custos e otimizar sua consulta,
            confira nossas dicas de boas práticas na seção sobre BigQuery.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "pagar, custo, gratuito, grátis, mensalidade"
  },
  {
    question: "Os dados da BD são públicos ou privados?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Em sua grande maioria, as bases de dados encontradas em nossa plataforma são públicas,
            porém, também estão listadas algumas bases privadas. Nossa organização não possui fins lucrativos,
            portanto, não comercializamos a listagem de bases em nossa plataforma.
            Acreditamos ser útil listar conjuntos de dados privados,
            uma vez que as pessoas podem ter interesse em adquirí-las ao encontrá-las em nosso site.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "público, privado"
  },
  {
    question: "Quais tipos de dados encontro na BD?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Em nossa plataforma, você encontra três tipos de dados: tabelas tratadas BD+, fontes originais e pedidos LAI.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "tipo, categoria"
  },
  {
    question: "O que são tabelas tratadas BD+?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            São tabelas completas, já tratadas e prontas para análise, disponíveis no nosso <i>datalake</i> público.
            A limpeza das tabelas envolve um rigoroso processo de padronização e compatibilização de dados,
            o que permite que o cruzamento de tabelas de diferentes instituições e temas seja tão simples quanto qualquer outra consulta.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "tratada, tratado, BD+, tabela, datalake, cruzar, cruzamento, padronização, compatibilização"
  },
  {
    question: "O que são fontes originais?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            São links para páginas externas à plataforma com informações úteis sobre o conjunto de dados.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "fonte original, externo"
  },
  {
    question: "O que são pedidos LAI?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
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
    keywords: "LAI, acesso à informação, lei"
  },
  {
    question: "Como acessar as tabelas tratadas BD+?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você pode consultar as tabelas tratadas BD+ de diferentes maneiras.
            Além de fazer o download direto na plataforma,
            é possível explorar os dados com SQL através do BigQuery ou com os pacotes em Python, R e Stata.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "acesso, consulta, tratada, tratado, BD+, download, baixar, pacote, SQL, BigQuery, Python, R, Stata"
  },
  {
    question: "Como acessar as fontes originais?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você pode acessar as fontes originais dos dados clicando no botão de redirecionamento para o link externo à plataforma.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "acesso, consulta, fonte original, externo"
  },
  {
    question: "Como acessar os pedidos LAI?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Você pode acessar os pedidos LAI clicando no botão de redirecionamento para o link externo à plataforma.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "acesso, consulta, LAI, acesso à informação, lei"
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
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Alguns dados são atualizados automaticamente e outros não.
            Estamos no esforço de mudar para um fluxo automático todos os
            conjuntos que são atualizados com uma frequência maior que mensalmente.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "atualização, automatização, frequência"
  },
  {
    question: "É possível fazer o download dos dados da BD?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Sim, você pode baixar o arquivo CSV completo das tabelas tratadas BD+ direto na plataforma.
            No entanto, tabelas com mais de 200.000 linhas só podem ser acessados através do
            nosso <i>datalake</i> no BigQuery ou dos nossos pacotes em Python, R e Stata.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "download, baixar, CSV, arquivo"
  },
  {
    question: "Qual é o limite de download dos dados da BD na plataforma?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            O limite para download dos dados na nossa plataforma é de 200.000 linhas.
            Para acessar tabelas que ultrapassam esse limite,
            utilize nosso <i>datalake</i> no BigQuery ou nossos pacotes em Python, R e Stata.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "limite, download, baixar, tamanho, máximo, arquivo"
  },
  {
    question: "Como utilizar os pacotes da BD?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Nossos pacotes permitem o acesso ao <i>datalake</i> público direto do seu computador ou ambiente de desenvolvimento.
            Para começar a explorar nossos dados em Python, R ou Stata,
            siga os tutoriais de instalação dos pacotes presentes na nossa <a href="https://basedosdados.github.io/mais/access_data_packages/" target="_blank">
            documentação</a>.
          </p>
        </div>
      )
    },
    categories: ["Dados"],
    keywords: "pacote, Python, R, Stata, instalação, documentação"
  },
  {
    question: "O que é nível da observação?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
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
    keywords: "nível, observação, chave, primária"
  },
  {
    question: "O que é o datalake da BD no BigQuery?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
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
    keywords: "BigQuery, Google, Cloud, datalake, BD+"
  },
  {
    question: "Por que preciso de uma conta no Google Cloud?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
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
    keywords: "conta, cadastro, BigQuery, Google, Cloud"
  },
  {
    question: "O que acontece se eu exceder o limite mensal de 1 TB gratuito do Google Cloud?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Caso você exceda o limite, são cobrados 5 dólares por Terabyte de dados que sua consulta irá processar.
            Mas ressaltamos que o limite de 1 Terabyte do Google costuma ser suficiente,
            mesmo para análises com bases mais robustas, como a RAIS ou Censo Escolar. 
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "limite, terabyte, TB, Google, Cloud"
  },
  {
    question: "Como criar um projeto no Google Cloud?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Para criar um projeto no Google Cloud, basta ter um e-mail cadastrado no Google.
            É necessário ter um projeto seu, mesmo que vazio, para você fazer consultas em nosso <i>datalake</i> público.
          </p>
          
          <ol>
            <li>Acesse o <a href="https://console.cloud.google.com/projectselector2/home/dashboard" target="_blank">Google Cloud</a>. Caso for a sua primeira vez, aceite os Termos de Serviços.</li>
            <li>Clique em <i>Create Project/Criar Projeto</i>. Escolha um nome bacana para o projeto.</li>
            <li>Clique em <i>Create/Criar</i>.</li>
          </ol>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "criar, cadastrar, projeto, Google, Cloud"
  },
  {
    question: "Quais as melhores práticas para fazer uma consulta no BigQuery?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Para verificar uma amostra de todas as variáveis da tabela, use: 
          </p>

          <code className="language-sql" style={{margin: "16px 0", padding: "6px"}}>
            {`SELECT * FROM  dataset.table_name LIMIT 100`}
          </code>
          
          <ul>
            <li>
              A primeira dica valiosa é selecionar as colunas que você vai usar.
              O BigQuery funciona usando um modelo colunar, portanto, quanto menos colunas você usar,
              melhor vai ser o desempenho da sua consulta. Isso significa evitar o clássico<br/> <code className="language-sql">SELECT * FROM table_name</code> e
              escolher as colunas de seu interesse. Parece chato, mas ajuda muito!
            </li>
            <li>
              Para tabelas grandes, uma boa prática é filtrar os anos e estados de seu interesse com a cláusula <code className="language-sql">WHERE</code>.
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
    keywords: "prática, dica, otimização, desempenho, consulta, BigQuery, selecionar, filtrar"
  },
  {
    question: "O que são os tipos no BigQuery?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
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
    keywords: "tipo, categoria, BigQuery, INTEGER, STRING, DATE, FLOAT, GEOGRAPHY"
  },
  {
    question: "O que são as partições no BigQuery?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            As partições são divisões feitas em uma tabela para facilitar o gerenciamento e a consulta aos dados.
            Ao segmentar uma tabela grande em partições menores, a quantidade de bytes lidos é reduzida,
            o que ajuda a controlar os custos e melhora o desempenho da consulta. 
          </p>
        </div>
      )
    },
    categories: ["BigQuery"],
    keywords: "partição, particionamento, otimização, desempenho, BigQuery"
  },
  {
    question: "Como a BD se financia?",
    answer: function() {
      return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <p>
            Ao longo dos anos, a BD cresceu com o apoio financeiro de usuários e de pessoas que se identificam com nossa missão.
            Hoje, contamos também com nossa área de Serviços e Parcerias, criada para garantir a sustentabilidade da organização,
            de forma a manter e expandir nossos produtos de forma gratuita.
            A prestação de serviços de dados e a realização de projetos com parceiros vêm sendo chave não só na geração de receita,
            mas também no fortalecimento da nossa posição de referência na disponibilização de dados de qualidade.
            Confira mais sobre a contabilidade da organização em nossa página de <a href="https://basedosdados.org/transparencia" target="_blank">Transparência</a>.
          </p>
        </div>
      )
    },
    categories: ["Institucional"],
    keywords: "financiamento, sustentabilidade, contabilidade, serviço, parceria"
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
              <CopyIcon widthIcon="26px" heightIcon="26px" fill="#42B0FF"/>
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
]