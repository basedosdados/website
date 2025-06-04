import { 
  Stack,
  ModalCloseButton
} from "@chakra-ui/react";
import cookies from "js-cookie";
import introJs from 'intro.js';
import { useTranslation } from "next-i18next";
import { ModalGeneral, Button } from "./uiUserPage";
import { triggerGAEvent } from "../../utils";
import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import 'intro.js/introjs.css';

export const ModalInitialTour = ({ isOpen, onClose, begin }) => {
  const { t } = useTranslation('tour');

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
        padding: "16px",
        borderRadius: "8px"
      }}
    >
      <Stack spacing={0} marginBottom="16px">
        <TitleText
          width="100%"
          typography="small"
        >
          {t('initialTour.title')}

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
        <LabelText typography="small" fontWeight="400" dangerouslySetInnerHTML={{ __html: t('initialTour.content') }}/>
      </Stack>

      <Stack spacing={0} marginTop="10px">
        <Button
          width={{base: "100%", lg: "fit-content"}}
          onClick={() => handleAction()}
        >
          {t('initialTour.button')}
        </Button>
      </Stack>
    </ModalGeneral>
  )
}

export const ModalSurveyTour = ({ isOpen, onClose }) => {
  return (
    <ModalGeneral
      isOpen={isOpen}
      onClose={onClose}
      propsModalContent={{
        minWidth: "328px",
        maxWidth: "328px",
        padding: "16px",
        borderRadius: "8px"
      }}
    >
      <Stack spacing={0} marginBottom="16px">
        <ModalCloseButton
          fontSize="14px"
          top="14px"
          right="16px"
          _hover={{backgroundColor: "transparent", color:"#0B89E2"}}
        />
      </Stack>

      <Stack spacing={0} id="dataset_tour_survey"/>
    </ModalGeneral>
  )
}


function translateText(locale, pt, en, es = pt) {
  const translations = {
    en: en,
    es: es,
    pt: pt
  };
  
  return translations[locale] || pt;
}

export const exploreTour = (datasetTab, setTabIndex, setTourBegin, query, locale) => {
  const tour = introJs().setOptions({
    steps: [
      {
        element: '#tab_database_dataset',
        title: translateText(locale,
          'Explore os dados do conjunto',
          'Explore the dataset',
          'Explora el conjunto de datos'
        ),
        intro: translateText(locale,
          'Neste tour, iremos guiar você na exploração das tabelas tratadas e das fontes originais deste conjunto de dados. Vamos começar?',
          'In this tour, we will guide you through exploring the processed tables and original sources of this dataset. Shall we begin?',
          'En este recorrido, te guiaremos en la exploración de las tablas procesadas y las fuentes originales de este conjunto de datos. ¿Comenzamos?'
        ),
        position: 'bottom'
      }
    ],
    doneLabel: translateText(locale,
      'Começar',
      'Start',
      'Iniciar'
    ),
    exitOnOverlayClick: false,
    showBullets: false,
    buttonClass: "tour-dataset-buttons",
    tooltipClass: "tour-dataset-tooltip"
  });

  const buttonBar = document.querySelector('.introjs-tooltipbuttons');
  if (buttonBar) {
    const customSkip = document.createElement('a');
    customSkip.className = 'introjs-custom-skip-dataset';
    customSkip.innerHTML = translateText(locale, 'Pular', 'Skip', 'Saltar');

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
    window.dispatchEvent(new CustomEvent('loadingTourBegin'));
    setTourBegin(true)
  };

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 });
    triggerGAEvent('tour_dataset', "skip in step 0");
  };

  tour.start()
}

export const startFirstTour = (locale) => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#dataset_select_tables',
        title: translateText(locale,
          '<div class="tour-step">Passo 1 de 10</div>Escolha uma tabela tratada',
          '<div class="tour-step">Step 1 of 10</div>Select a processed table',
          '<div class="tour-step">Paso 1 de 10</div>Seleccione una tabla procesada'
        ),
        intro: translateText(locale,
          'Para começar, <strong>selecione uma das opções</strong> para acessar os dados desejados. As tabelas tratadas já contêm dados <strong>prontos para análise</strong>. O tratamento das tabelas envolve a padronização dos nomes das variáveis, o que permite que o cruzamento de tabelas de diferentes instituições e temas seja tão simples quanto qualquer outra consulta.',
          'To get started, <strong>select one of the options</strong> to access the desired data. The processed tables already contain data <strong>ready for analysis</strong>. The table processing involves standardizing variable names, which makes cross-referencing tables from different institutions and topics as simple as any other query.',
          'Para comenzar, <strong>seleccione una de las opciones</strong> para acceder a los datos deseados. Las tablas procesadas ya contienen datos <strong>listos para análisis</strong>. El procesamiento de las tablas implica la estandarización de los nombres de las variables, lo que permite que el cruce de tablas de diferentes instituciones y temas sea tan sencillo como cualquier otra consulta.'
        ),
        position: 'right'
      },
      {
        element: '#table_temporalcoverage',
        title: translateText(locale,
          '<div class="tour-step">Passo 2 de 10</div>Verifique a cobertura temporal da tabela',
          '<div class="tour-step">Step 2 of 10</div>Check the table\'s temporal coverage',
          '<div class="tour-step">Paso 2 de 10</div>Verifique la cobertura temporal de la tabla'
        ),
        intro: translateText(locale,
          'A cobertura temporal dos dados pode variar entre <strong>totalmente grátis</strong>, <strong>parcialmente grátis</strong> e <strong>totalmente pago</strong>. Os dados dentro do intervalo de anos gratuitos podem ser acessados sem custos, enquanto os dados nos anos pagos exigem uma assinatura do plano <strong>Pro</strong> ou <strong>Empresas</strong>.',
          'The temporal coverage of data may vary between <strong>fully free</strong>, <strong>partially free</strong>, and <strong>fully paid</strong>. Data within the free year range can be accessed at no cost, while data in paid years requires a <strong>Pro</strong> or <strong>Enterprise</strong> plan subscription.',
          'La cobertura temporal de los datos puede variar entre <strong>totalmente gratuito</strong>, <strong>parcialmente gratuito</strong> y <strong>totalmente pago</strong>. Los datos dentro del rango de años gratuitos pueden ser accedidos sin costo, mientras que los datos en los años pagos requieren una suscripción al plan <strong>Pro</strong> o <strong>Empresas</strong>.'
        ),
        position: 'right'
      },
      {
        element: '#table_access_data',
        title: translateText(locale,
          '<div class="tour-step">Passo 3 de 10</div>Conheça as formas de acessar os dados',
          '<div class="tour-step">Step 3 of 10</div>Learn how to access the data',
          '<div class="tour-step">Paso 3 de 10</div>Conozca las formas de acceder a los datos'
        ),
        intro: translateText(locale,
          'Você pode acessar os dados de duas formas: <br/> <ul><li><strong>BigQuery e Pacotes</strong>: Acesse os dados no BigQuery ou por meio de pacotes em Python e R.</li><li><strong>Download</strong>: Baixe o arquivo CSV diretamente na plataforma.</li></ul> Nos próximos passos, vamos te mostrar primeiro como acessar pelo <strong>BigQuery e Pacotes</strong>. Em seguida, explicaremos como fazer o <strong>download</strong> dos dados.',
          'You can access the data in two ways: <ul><li><strong>BigQuery and Packages</strong>: Access the data in BigQuery or through Python and R packages.</li><li><strong>Download</strong>: Download the CSV file directly from the platform.</li></ul> In the next steps, we\'ll first show you how to access via <strong>BigQuery and Packages</strong>. Then, we\'ll explain how to <strong>download</strong> the data.',
          'Puedes acceder a los datos de dos formas: <ul><li><strong>BigQuery y Paquetes</strong>: Accede a los datos en BigQuery o mediante paquetes de Python y R.</li><li><strong>Descarga</strong>: Descarga el archivo CSV directamente en la plataforma.</li></ul> En los próximos pasos, primero te mostraremos cómo acceder mediante <strong>BigQuery y Paquetes</strong>. Luego, explicaremos cómo realizar la <strong>descarga</strong> de los datos.'
        ),
        position: 'right'
      },
      {
        element: '#access_via_bigquery',
        title: translateText(locale,
          '<div class="tour-step">Passo 4 de 10</div>Acesso via BigQuery e Pacotes',
          '<div class="tour-step">Step 4 of 10</div>Access via BigQuery and Packages',
          '<div class="tour-step">Paso 4 de 10</div>Acceso mediante BigQuery y Paquetes'
        ),
        intro: translateText(locale,
          'Para continuar, <strong>selecione as colunas</strong> que deseja acessar. Como nossa missão é facilitar sua análise, a plataforma traduz automaticamente todas as colunas que contêm códigos institucionais, como município. Depois, basta clicar no botão para <strong>gerar a consulta</strong>.',
          'To continue, <strong>select the columns</strong> you want to access. Since our mission is to simplify your analysis, the platform automatically translates all columns containing institutional codes, such as municipality. Then simply click the button to <strong>generate the query</strong>.',
          'Para continuar, <strong>seleccione las columnas</strong> que desea acceder. Como nuestra misión es facilitar su análisis, la plataforma traduce automáticamente todas las columnas que contienen códigos institucionales, como municipio. Luego solo debe hacer clic en el botón para <strong>generar la consulta</strong>.'
        ),
        position: 'left'
      }
    ],
    nextLabel: translateText(locale,
      'Avançar',
      'Next',
      'Adelante'
    ),
    doneLabel: translateText(locale,
      'Avançar',
      'Next',
      'Adelante'
    ),
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

  let currentStep = 0
  tour.onchange(() => {
    currentStep = tour.currentStep() + 1
  })

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 });
    triggerGAEvent('tour_dataset', `skip in step ${currentStep}`);
    window.dispatchEvent(new CustomEvent('datasetSurveyTour'));
  };

  tour.start();
}

export const startSecondTour = (doneFunction, locale) => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#access_query_language',
        title: translateText(locale,
          '<div class="tour-step">Passo 5 de 10</div>Escolha a linguagem de sua preferência',
          '<div class="tour-step">Step 5 of 10</div>Choose your preferred language',
          '<div class="tour-step">Paso 5 de 10</div>Seleccione el lenguaje de su preferencia'
        ),
        intro: translateText(locale,
          'Agora, <strong>selecione a aba</strong> com a linguagem que você deseja acessar os dados: SQL, Python ou R.',
          'Now, <strong>select the tab</strong> for the language you want to use to access the data: SQL, Python or R.',
          'Ahora, <strong>seleccione la pestaña</strong> con el lenguaje que desea utilizar para acceder a los datos: SQL, Python o R.'
        ),
        position: 'right'
      },
      {
        element: '#access_generated_query',
        title: translateText(locale,
          '<div class="tour-step">Passo 6 de 10</div>Consulta gerada',
          '<div class="tour-step">Step 6 of 10</div>Generated query',
          '<div class="tour-step">Paso 6 de 10</div>Consulta generada'
        ),
        intro: translateText(locale,
          'A plataforma disponibiliza a consulta na linguagem escolhida, permitindo que você acesse os dados como preferir.',
          'The platform provides the query in your selected language, allowing you to access the data as you prefer.',
          'La plataforma proporciona la consulta en el lenguaje seleccionado, permitiéndole acceder a los datos como prefiera.'
        ),
        position: 'left'
      },
      {
        element: '#access_generated_query',
        title: translateText(locale,
          '<div class="tour-step">Passo 7 de 10</div>Copie a consulta e acesse os dados',
          '<div class="tour-step">Step 7 of 10</div>Copy the query and access the data',
          '<div class="tour-step">Paso 7 de 10</div>Copie la consulta y acceda a los datos'
        ),
        intro: translateText(locale,
          'Agora, <strong>copie a consulta gerada</strong> e execute-a no ambiente correspondente à linguagem escolhida. Se você estiver usando o BigQuery, pode clicar no botão para abrir diretamente o editor e colar a consulta.',
          'Now, <strong>copy the generated query</strong> and run it in the environment corresponding to the chosen language. If you are using BigQuery, you can click the button to directly open the editor and paste the query.',
          'Ahora, <strong>copie la consulta generada</strong> y ejecutarlo en el entorno correspondiente al idioma elegido. Si está utilizando BigQuery, puede hacer clic en el botón para abrir directamente el editor y pegar la consulta.'
        ),
        position: 'left'
      }
    ],
    nextLabel: translateText(locale,
      'Avançar',
      'Next',
      'Adelante'
    ),
    doneLabel: translateText(locale,
      'Avançar',
      'Next',
      'Adelante'
    ),
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

  let currentStep = 0
  tour.onchange(() => {
    currentStep = tour.currentStep() + 5
  })

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 });
    triggerGAEvent('tour_dataset', `skip in step ${currentStep}`);
    window.dispatchEvent(new CustomEvent('datasetSurveyTour'));
  };

  tour.start();
}

export const startThirdTour = (locale) => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#access_content_table',
        title: translateText(locale,
          '<div class="tour-step">Passo 8 de 10</div>Acesso via Download',
          '<div class="tour-step">Step 8 of 10</div>Access via Download',
          '<div class="tour-step">Paso 8 de 10</div>Acceso mediante Descarga'
        ),
        intro: translateText(locale,
          'Clique no botão para baixar o arquivo <strong>CSV</strong> diretamente na plataforma. Lembre-se de que o download está disponível apenas para tabelas de até <strong>1 GB</strong>. Tabelas até <strong>100 MB</strong> podem ser baixadas <strong>gratuitamente</strong>, enquanto tabelas entre <strong>100 MB</strong> e <strong>1 GB</strong> exigem uma assinatura do plano <strong>Pro</strong> ou <strong>Empresas</strong>.',
          'Click the button to download the <strong>CSV</strong> file directly from the platform. Please note downloads are only available for tables up to <strong>1 GB</strong>. Tables up to <strong>100 MB</strong> can be downloaded <strong>for free</strong>, while tables between <strong>100 MB</strong> and <strong>1 GB</strong> require a <strong>Pro</strong> or <strong>Enterprise</strong> plan subscription.',
          'Haga clic en el botón para descargar el archivo <strong>CSV</strong> directamente en la plataforma. Tenga en cuenta que la descarga solo está disponible para tablas de hasta <strong>1 GB</strong>. Las tablas de hasta <strong>100 MB</strong> se pueden descargar <strong>gratuitamente</strong>, mientras que las tablas entre <strong>100 MB</strong> y <strong>1 GB</strong> requieren una suscripción al plan <strong>Pro</strong> o <strong>Empresas</strong>.'
        ),
        position: 'left'
      },
      {
        element: '#dataset_select_rawdatasource',
        title: translateText(locale,
          '<div class="tour-step">Passo 9 de 10</div>Escolha uma fonte original',
          '<div class="tour-step">Step 9 of 10</div>Select an original source',
          '<div class="tour-step">Paso 9 de 10</div>Seleccione una fuente original'
        ),
        intro: translateText(locale,
          'Você também pode <strong>selecionar uma das opções</strong> para acessar a fonte dos dados desejados. As fontes originais são links para páginas externas à plataforma com informações úteis sobre os dados.',
          'You can also <strong>select one of the options</strong> to access the source of the desired data. The original sources are links to pages external to the platform with useful information about the data.',
          'También puede <strong>seleccionar una de las opciones</strong> para acceder a la fuente de los datos deseados. Las fuentes originales son enlaces a páginas externas a la plataforma con información útil sobre los datos.'
        ),
        position: 'right'
      }
    ],
    nextLabel: translateText(locale,
      'Avançar',
      'Next',
      'Adelante'
    ),
    doneLabel: translateText(locale,
      'Avançar',
      'Next',
      'Adelante'
    ),
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

  let currentStep = 0
  tour.onchange(() => {
    currentStep = tour.currentStep() + 8
  })

  const onSkipClick = () => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 });
    triggerGAEvent('tour_dataset', `skip in step ${currentStep}`);
    window.dispatchEvent(new CustomEvent('datasetSurveyTour'));
  };

  tour.start();
}

export const startFourthTour = (locale) => {
  const tour = introJs();
  tour.setOptions({
    steps: [
      {
        element: '#dataset_rawdatasource_header',
        title: translateText(locale,
          '<div class="tour-step">Passo 10 de 10</div>Acesse a fonte original',
          '<div class="tour-step">Step 10 of 10</div>Access the original source',
          '<div class="tour-step">Paso 10 de 10</div>Acceda a la fuente original'
        ),
        intro: translateText(locale,
          'Se quiser, você pode clicar no botão para acessar a fonte original. Tentamos sempre fornecer o caminho mais próximo possível à fonte para baixar os dados originais.',
          'If you wish, you can click the button to access the original source. We always try to provide the closest possible path to the source to download the original data.',
          'Si lo deseas puedes hacer clic en el botón para acceder a la fuente original. Siempre intentamos proporcionar la ruta más cercana posible a la fuente para descargar los datos originales.'
        ),
        position: 'bottom'
      },
      {
        element: '#widget_help_and_resources',
        title: translateText(locale,
          'Parabéns, você completou o tour!',
          'Congratulations, you have completed the tour!',
          '¡Felicitaciones, has completado el recorrido!'
        ),
        intro: translateText(locale,
          'Agora, você já sabe explorar as principais funcionalidades da plataforma. Lembre-se de que pode contar com o <strong>botão de ajuda no canto da tela</strong> sempre que precisar. Por lá, você encontra tutoriais, documentação, respostas às perguntas mais frequentes e pode até reiniciar este tour.',
          'Now you know how to explore the platform\'s main features. Remember that you can always use the <strong>help button in the corner of the screen</strong>. There, you can find tutorials, documentation, answers to frequently asked questions, and you can even restart this tour.',
          'Ahora ya sabes cómo explorar las principales características de la plataforma. Recuerda que puedes contar con el <strong>botón de ayuda en la esquina de la pantalla</strong> siempre que lo necesites. Allí encontrarás tutoriales, documentación, respuestas a preguntas frecuentes e incluso podrás reiniciar este recorrido.'
        ),
        position: 'left'
      }
    ],
    nextLabel: translateText(locale,
      'Avançar',
      'Next',
      'Adelante'
    ),
    doneLabel: translateText(locale,
      'Concluir',
      'Conclude',
      'Concluir'
    ),
    hidePrev: true,
    exitOnOverlayClick: false,
    showBullets: false,
    keyboardNavigation: false,
    exitOnEsc: false,
    buttonClass: "tour-dataset-buttons",
    tooltipClass: "tour-dataset-tooltip"
  })

  tour.onexit(() => {
    cookies.set('tourBD', '{"state":"skip"}', { expires: 360 });
    triggerGAEvent('tour_dataset', `tour conclusion`);
    window.dispatchEvent(new CustomEvent('datasetSurveyTour'));
  });

  tour.start();
}