import { 
  Stack,
  ModalCloseButton
} from "@chakra-ui/react";
import cookies from "js-cookie";
import introJs from 'intro.js';
import { ModalGeneral, Button } from "./uiUserPage";
import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import 'intro.js/introjs.css';

export const ModalInitialTour = ({ isOpen, onClose, begin }) => {
  function handleAction() {
    cookies.set('tourBD', '{"state":"explore"}', { expires: 360 })
    onClose()
    if(!!begin) begin(true)
  }

  return (
    <ModalGeneral
      isOpen={isOpen}
      onClose={() => handleAction()}
      propsModalContent={{
        minWidth: "328px",
        maxWidth: "328px",
        padding: "16px"
      }}
    >
      <Stack spacing={0} marginBottom="16px">
        <TitleText
          width="100%"
          typography="small"
        >
          Boas-vindas à nossa plataforma!
        </TitleText>
        <ModalCloseButton
          fontSize="14px"
          top="14px"
          right="16px"
          onClick={() => handleAction()}
          _hover={{backgroundColor: "transparent", color:"#0B89E2"}}
        />
      </Stack>

      <Stack spacing={0}>
        <LabelText typography="small" fontWeight="400">
          Antes de começar, saiba que os dados aqui são disponibilizados em <strong>formato bruto</strong>.
          Para filtrar por categorias, como região ou período, você precisará manipulá-los em <strong>ferramentas externas</strong>,
          como Excel, BigQuery, Python ou R. Não se preocupe! Temos tutoriais para ajudar você.
        </LabelText>
      </Stack>

      <Stack spacing={0} marginTop="10px">
        <Button
          width={{base: "100%", lg: "fit-content"}}
          onClick={() => handleAction()}
        >
          Entendi
        </Button>
      </Stack>
    </ModalGeneral>
  )
}

export const ModalFinishTour = ({ isOpen, onClose }) => {
  return (
    <ModalGeneral
      isOpen={isOpen}
      onClose={onClose}
      propsModalContent={{
        minWidth: "328px",
        maxWidth: "328px",
        padding: "16px"
      }}
    >
      <Stack spacing={0} marginBottom="16px">
        <TitleText
          width="100%"
          typography="small"
        >
          Parabéns, você completou a tour!
        </TitleText>
        <ModalCloseButton
          fontSize="14px"
          top="14px"
          right="16px"
          _hover={{backgroundColor: "transparent", color:"#0B89E2"}}
        />
      </Stack>

      <Stack spacing={0}>
        <LabelText typography="small" fontWeight="400">
          Agora, você já sabe explorar as principais funcionalidades da plataforma.
          Se precisar de ajuda a qualquer momento, nossa equipe está à disposição.
        </LabelText>
      </Stack>

      <Stack spacing={0} marginTop="10px">
        <Button
          width={{base: "100%", lg: "fit-content"}}
          onClick={() => onClose()}
        >
          Concluir
        </Button>
      </Stack>
    </ModalGeneral>
  )
}

export const exploreTour = (datasetTab, setTabIndex, setTourBegin, query) => {
  const tour = introJs().setOptions({
    steps: [
      {
        element: '#tab_database_dataset',
        title: 'Explore os dados do conjunto',
        intro: 'Nesta tour, iremos guiar você na exploração das tabelas tratadas e das fontes originais deste conjunto de dados. Vamos começar?',
        position: 'bottom'
      }
    ],
    doneLabel: 'Começar',
    exitOnOverlayClick: false,
    showBullets: false,
    buttonClass: "tour-dataset-buttons",
    tooltipClass: "tour-dataset-tooltip"
  });

  const buttonBar = document.querySelector('.introjs-tooltipbuttons');
  if (buttonBar) {
    const customSkip = document.createElement('a');
    customSkip.className = 'introjs-custom-skip-dataset';
    customSkip.innerHTML = 'Pular';

    customSkip.addEventListener('click', () => {
      onSkipClick()
      tour.exit();
    });

    buttonBar.insertBefore(customSkip, buttonBar.firstChild);
  }

  tour.onafterchange(() => {
    document.querySelector('.introjs-donebutton')?.removeEventListener('click', onDoneClick);
    document.querySelector('.introjs-skipbutton')?.removeEventListener('click', onSkipClick);

    document.querySelector('.introjs-donebutton')?.addEventListener('click', onDoneClick);
    document.querySelector('.introjs-skipbutton')?.addEventListener('click', onSkipClick);
  });

  const onDoneClick = () => {
    if(!!query.tab) {
      datasetTab()
      setTabIndex(0)
    }

    cookies.set('tourBD', '{"state":"begin"}', { expires: 360 })
    setTourBegin(true)
  };

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
  };

  tour.start()
}

export const startFirstTour = () => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#dataset_select_tables',
        title: '<div class="tour-step">Passo 1 de 10</div>Escolha uma tabela tratada',
        intro: 'Para começar, selecione uma das opções para acessar os dados desejados. As tabelas tratadas já contêm dados prontos para análise. O tratamento das tabelas envolve a padronização dos nomes das variáveis, o que permite que o cruzamento de tabelas de diferentes instituições e temas seja tão simples quanto qualquer outra consulta.',
        position: 'right'
      },
      {
        element: '#table_temporalcoverage',
        title: '<div class="tour-step">Passo 2 de 10</div>Verifique a cobertura temporal da tabela',
        intro: 'A cobertura temporal dos dados pode variar entre <strong>totalmente grátis</strong>, <strong>parcialmente grátis</strong> e <strong>totalmente pago</strong>. Os dados dentro do intervalo de anos gratuitos podem ser acessados sem custos, enquanto os dados nos anos pagos exigem uma assinatura do plano <strong>Pro</strong> ou <strong>Empresas</strong>.',
        position: 'right'
      },
      {
        element: '#table_access_data',
        title: '<div class="tour-step">Passo 3 de 10</div>Conheça as formas de acessar os dados',
        intro: 'Você pode acessar os dados de duas formas: <br/> <ul><li><strong>BigQuery e Pacotes</strong>: Acesse os dados no BigQuery ou por meio de pacotes em Python e R.</li><li><strong>Download</strong>: Baixe o arquivo CSV diretamente na plataforma.</li></ul> Nos próximos passos, vamos te mostrar primeiro como acessar pelo <strong>BigQuery e Pacotes</strong>. Em seguida, explicaremos como fazer o <strong>download</strong> dos dados.',
        position: 'right'
      },
      {
        element: '#access_via_bigquery',
        title: '<div class="tour-step">Passo 4 de 10</div>Acesso via BigQuery e Pacotes',
        intro: 'Para continuar, <strong>selecione as colunas</strong> que deseja acessar. Como nossa missão é facilitar sua análise, a plataforma traduz automaticamente todas as colunas que contêm códigos institucionais, como município. Depois, basta clicar no botão para <strong>gerar a consulta</strong>.',
        position: 'left'
      }
    ],
    nextLabel: 'Avançar',
    doneLabel: 'Avançar',
    exitOnOverlayClick: false,
    showBullets: false,
    keyboardNavigation: false,
    exitOnEsc: false,
    buttonClass: "tour-dataset-buttons",
    tooltipClass: "tour-dataset-tooltip"
  })

  tour.onafterchange(() => {
    const doneButton = document.querySelector('.introjs-donebutton');
    if (doneButton) {
      doneButton.style.pointerEvents = 'none';
      doneButton.style.backgroundColor = '#ACAEB1';
      doneButton.style.cursor = 'not-allowed';
    }

    document.querySelector('.introjs-skipbutton')?.removeEventListener('click', onSkipClick);
    document.querySelector('.introjs-skipbutton')?.addEventListener('click', onSkipClick);
  });

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
  };

  tour.start();
}

export const startSecondTour = (doneFunction) => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#access_query_language',
        title: '<div class="tour-step">Passo 5 de 10</div>Escolha a linguagem de sua preferência',
        intro: 'Agora, <strong>selecione a aba</strong> com a linguagem que você deseja acessar os dados: SQL, Python ou R.',
        position: 'right'
      },
      {
        element: '#access_generated_query',
        title: '<div class="tour-step">Passo 6 de 10</div>Consulta gerada',
        intro: 'A plataforma disponibiliza a consulta na linguagem escolhida, permitindo que você acesse os dados como preferir.',
        position: 'left'
      },
      {
        element: '#access_generated_query',
        title: '<div class="tour-step">Passo 7 de 10</div>Copie a consulta e acesse os dados',
        intro: 'Agora, <strong>copie a consulta gerada</strong> e:<br/><ul><li>Clique no botão para <strong>acessar o BigQuery</strong>. No editor de consultas do BigQuery.</li><li>No terminal do Python.</li><li>No terminal do R.</li></ul>Basta colar a consulta e executá-la.',
        position: 'left'
      }
    ],
    nextLabel: 'Avançar',
    doneLabel: 'Avançar',
    exitOnOverlayClick: false,
    showBullets: false,
    keyboardNavigation: false,
    exitOnEsc: false,
    buttonClass: "tour-dataset-buttons",
    tooltipClass: "tour-dataset-tooltip"
  })

  tour.onafterchange(() => {
    document.querySelector('.introjs-donebutton')?.removeEventListener('click', onDoneClick);
    document.querySelector('.introjs-skipbutton')?.removeEventListener('click', onSkipClick);

    document.querySelector('.introjs-donebutton')?.addEventListener('click', onDoneClick);
    document.querySelector('.introjs-skipbutton')?.addEventListener('click', onSkipClick);
  });

  const onDoneClick = () => {
    doneFunction(true)
  };

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
  };

  tour.start();
}

export const startThirdTour = () => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#access_via_bigquery',
        title: '<div class="tour-step">Passo 8 de 10</div>Acesso via Download',
        intro: 'Clique no botão para baixar o arquivo <strong>CSV</strong> diretamente na plataforma. Lembre-se de que o download está disponível aoenas para tabelas de até <strong>1 GB</strong>. Tabelas até <strong>100 MB</strong> podem ser baixadas <strong>gratuitamente</strong>, enquanto tabelas entre <strong>100 MB</strong> e <strong>1 GB</strong> exigem uma assinatura do plano <strong>Pro</strong> ou <strong>Empresas</strong>.',
        position: 'left'
      },
      {
        element: '#dataset_select_rawdatasource',
        title: '<div class="tour-step">Passo 9 de 10</div>Escolha uma fonte original',
        intro: 'Agora, <strong>selecione uma das opções</strong> para acessar a fonte dos dados desejados. As fontes originais são links para páginas externas à plataforma com informações úteis sobre os dados.',
        position: 'right'
      }
    ],
    nextLabel: 'Avançar',
    doneLabel: 'Avançar',
    exitOnOverlayClick: false,
    showBullets: false,
    keyboardNavigation: false,
    exitOnEsc: false,
    buttonClass: "tour-dataset-buttons",
    tooltipClass: "tour-dataset-tooltip"
  })

  tour.onafterchange(() => {
    const doneButton = document.querySelector('.introjs-donebutton');
    if (doneButton) {
      doneButton.style.pointerEvents = 'none';
      doneButton.style.backgroundColor = '#ACAEB1';
      doneButton.style.cursor = 'not-allowed';
    }

    document.querySelector('.introjs-skipbutton')?.removeEventListener('click', onSkipClick);
    document.querySelector('.introjs-skipbutton')?.addEventListener('click', onSkipClick);
  });

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
  };

  tour.start();
}

export const startFourthTour = (modalOpen) => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#dataset_rawdatasource_header',
        title: '<div class="tour-step">Passo 10 de 10</div>Acesse a fonte original',
        intro: 'Clique no botão para acessar a fonte original. Tentamos sempre fornecer o caminho mais próximo possível à fonte para baixar os dados originais.',
        position: 'right'
      }
    ],
    doneLabel: 'Avançar',
    hidePrev: true,
    exitOnOverlayClick: false,
    showBullets: false,
    keyboardNavigation: false,
    exitOnEsc: false,
    buttonClass: "tour-dataset-buttons",
    tooltipClass: "tour-dataset-tooltip"
  })

  tour.onexit(() => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
    modalOpen()
  });

  tour.start();
}