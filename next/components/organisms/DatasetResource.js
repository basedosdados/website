import {
  Stack,
  Box,
  HStack,
  Divider,
  Tooltip,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuList,
  MenuItem,
  MenuDivider,
  useBreakpointValue
} from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { capitalize } from "lodash";
import cookies from "js-cookie";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";

import TablePage from "./TablePage";
import RawDataSourcesPage from "./RawDataSourcesPage";
import InformationRequestPage from "./InformationRequestPage";

import introJs from 'intro.js';
import 'intro.js/introjs.css';

import ChevronIcon from "../../public/img/icons/chevronIcon";

export default function DatasetResource({
  dataset,
  isBDSudo,
  tourBegin
}) {
  const { t } = useTranslation('dataset');
  const router = useRouter()
  const { query, locale } = router
  const [tables, setTables] = useState([]);
  const [rawDataSources, setRawDataSources] = useState([]);
  const [informationRequests, setInformationRequests] = useState([]);
  const displayScreen = useBreakpointValue({ base: "mobile", lg: "desktop" });
  const [tourBeginTable, setTourBeginTable] = useState(false);
  const [pinTablesSelect, setPinTablesSelect] = useState(false);
  const [changeTabDataInformationQuery, setChangeTabDataInformationQuery] = useState(false);

  useEffect(() => {
    if (tourBegin) {
      const tourBD = cookies.get('tourBD') ? JSON.parse(cookies.get('tourBD')) : null;
      if (tourBD && tourBD.state === "begin") {
        if (!query.table) {
          const dataset_tables = dataset?.tables?.edges
            ?.map((elm) => elm.node)
              ?.filter(
                (elm) =>
                  !["under_review", "excluded"].includes(elm?.status?.slug) &&
                  !["dicionario", "dictionary"].includes(elm?.slug)
              )
                ?.sort(sortElements) || [];
          
          if (dataset_tables.length > 0) {
            pushQuery("table", dataset_tables[0]?._id);
          }
        }
      }
    }
  }, [tourBegin, query.table, dataset]);

  const pushQuery = (key, value) => {
    router.replace({
      pathname: `/dataset/${query.dataset}`,
      query: { [key]: value }
    },
      undefined, { shallow: true }
    )
  }

  const startFirstTour = () => {
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

  const startSecondTour = () => {
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
      setChangeTabDataInformationQuery(true);
    };

    const onSkipClick = () => {
      cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
    };

    tour.start();
  }

  const startThirdTour = () => {
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

  const startFourthTour = () => {
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

    tour.onafterchange(() => {
      document.querySelector('.introjs-skipbutton')?.removeEventListener('click', onSkipClick);
      document.querySelector('.introjs-skipbutton')?.addEventListener('click', onSkipClick);
    });

    const onSkipClick = () => {
      cookies.set('tourBD', '{"state":"skip"}', { expires: 360 })
    };

    tour.start();
  }

  useEffect(() => {
    let activeTour = null;
    let isTourRunning = false;
    const tourBD = cookies.get('tourBD') ? JSON.parse(cookies.get('tourBD')) : null;

    const checkTourState = () => {
      try {
        const tourBD = cookies.get('tourBD') ? JSON.parse(cookies.get('tourBD')) : null;
        if (!tourBD || !tourBeginTable || displayScreen !== 'desktop') {
          return;
        }

        if(tourBD.state === "explore" || tourBD.state === "skip") return

        if (isTourRunning) {
          return;
        }

        setPinTablesSelect(true);

        if (activeTour && activeTour !== tourBD.state) {
          introJs().exit();
          activeTour = null;
        }

        if (activeTour === tourBD.state) {
          return;
        }

        isTourRunning = true;

        switch (tourBD.state) {
          case 'begin':
            setTimeout(() => {
              requestAnimationFrame(() => {
                startFirstTour();
                activeTour = 'begin';
                isTourRunning = false;
              });
            }, 500);
            break;

          case 'table':
            setTimeout(() => {
              requestAnimationFrame(() => {
                startSecondTour();
                activeTour = 'table';
                isTourRunning = false;
              });
            }, 500);
            break;

          case 'download':
            setTimeout(() => {
              requestAnimationFrame(() => {
                startThirdTour();
                activeTour = 'download';
                isTourRunning = false;
              });
            }, 500);
            break;

          case 'last':
            setTimeout(() => {
              requestAnimationFrame(() => {
                startFourthTour();
                activeTour = 'last';
                isTourRunning = false;
              });
            }, 500);
            break;
        }
      } catch (error) {
        console.error('Erro no tour:', error);
        isTourRunning = false;
      }
    };

    if (tourBeginTable) {
      setTimeout(() => {
        checkTourState();
      }, 500);
    }

    const cookieCheckInterval = setInterval(checkTourState, 500);

    return () => {
      clearInterval(cookieCheckInterval);
      if(tourBD?.state === "explore" || tourBD?.state === "skip") return
      introJs().exit();
    };
  }, [cookies, displayScreen, tourBeginTable]);

  function sortElements(a, b) {
    if (a.order < b.order) {
      return -1
    }
    if (a.order > b.order) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    let dataset_tables
    let raw_data_sources
    let information_request

    if(isBDSudo) {
      dataset_tables = dataset?.tables?.edges?.map((elm) => elm.node)?.sort(sortElements) || [];
      raw_data_sources = dataset?.rawDataSources?.edges?.map((elm) => elm.node)?.sort(sortElements) || [];
      information_request = dataset?.informationRequests?.edges?.map((elm) => elm.node)?.sort(sortElements) || [];
    } else {
      dataset_tables = dataset?.tables?.edges
        ?.map((elm) => elm.node)
          ?.filter(
            (elm) =>
              !["under_review", "excluded"].includes(elm?.status?.slug) &&
              !["dicionario", "dictionary"].includes(elm?.slug)
          )
            ?.sort(sortElements) || [];

      raw_data_sources = dataset?.rawDataSources?.edges
        ?.map((elm) => elm.node)
          ?.filter((elm) => !["under_review", "excluded"].includes(elm?.status?.slug))
            ?.sort(sortElements) || [];

      information_request = dataset?.informationRequests?.edges
        ?.map((elm) => elm.node)
          ?.filter((elm) => !["under_review", "excluded"].includes(elm?.status?.slug))
            ?.sort(sortElements) || [];
    }

    setTables(dataset_tables);
    setRawDataSources(raw_data_sources);
    setInformationRequests(information_request);

    const queryParams = new URLSearchParams(window.location.search)

    if(queryParams.toString().length === 0) {
      if(dataset_tables.length > 0) return pushQuery("table", dataset_tables[0]?._id)
      if(raw_data_sources.length > 0) return pushQuery("raw_data_source", raw_data_sources[0]?._id)
      if(information_request.length > 0) return pushQuery("information_request", information_request[0]?._id)
    }
  }, [dataset, isBDSudo === true])

  function SwitchResource ({route}) {
    switch(true) {
      case route.hasOwnProperty("table"):
        return (
          <TablePage
            id={route.table}
            isBDSudo={isBDSudo}
            tourBegin={setTourBeginTable}
            changeTab={changeTabDataInformationQuery}
          />
        );

      case route.hasOwnProperty("raw_data_source"):
        return (
          <RawDataSourcesPage
            id={route.raw_data_source}
            locale={locale}
            isBDSudo={isBDSudo}
          />
        );

      case route.hasOwnProperty("information_request"):
        return (
          <InformationRequestPage
            id={route.information_request}
            isBDSudo={isBDSudo}
          />
        );

      default:
        return null;
    }
  }

  function ContentFilter({
    id,
    fieldName,
    choices,
    onChange,
    value,
    hasDivider = true
  }) {
    const [isOverflow, setIsOverflow] = useState({})
    const textRefs = useRef({})

    if(choices.length === 0) return null

    useEffect(() => {
      choices.forEach((elm, i) => {
        const textElement = textRefs.current[i]
        if (textElement) {
          setIsOverflow((prev) => ({
            ...prev,
            [i]: textElement.scrollWidth > textElement.clientWidth,
          }))
        }
      })
    }, [choices])

    return (
      <Box width="272px">
        <Divider
          display={hasDivider ? "flex" : "none"}
          marginY="24px"
          borderColor="#DEDFE0"
        />

        <Stack spacing={0} id={id} backgroundColor="#FFFFFF">
          <LabelText
            typography="small"
            paddingLeft="15px"
            marginBottom="8px"
          >
            {fieldName}
          </LabelText>

          <Box>
            {choices.map((elm, i) => (
              <HStack
                key={i}
                spacing="4px"
                cursor="pointer"
                pointerEvents={elm._id === value ? "none" : "default"}
              >
                <Box 
                  width="3px"
                  height="24px"
                  backgroundColor={elm._id === value && "#2B8C4D"}
                  borderRadius="10px"
                />
                <Tooltip
                  label={elm[`name${capitalize(locale)}`] || elm.name || elm.number}
                  isDisabled={!isOverflow[i]}
                  hasArrow
                  padding="16px"
                  backgroundColor="#252A32"
                  boxSizing="border-box"
                  borderRadius="8px"
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  textAlign="center"
                  color="#FFFFFF"
                  placement="top"
                  maxWidth="100%"
                >
                  <LabelText
                    typography="small"
                    ref={(el) => (textRefs.current[i] = el)}
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    width="100%"
                    color={elm._id === value ? "#2B8C4D" : "#71757A"}
                    backgroundColor={elm._id === value && "#F7F7F7"}
                    _hover={{
                      backgroundColor:elm._id === value ? "#F7F7F7" :"#EEEEEE",
                    }}
                    borderRadius="8px"
                    padding="6px 8px"
                    onClick={() => onChange(elm._id)}
                  >
                    {elm[`name${capitalize(locale)}`] || elm.name || elm.number}
                  </LabelText>
                </Tooltip>
              </HStack>
            ))}
          </Box>
        </Stack>
      </Box>
    )
  }

  function SelectResource ({ selectedResource }) {
    const { t } = useTranslation('dataset');
    const [widthScreen, setWidthScreen] = useState(0);
    const [value, setValue] = useState("")
    const {table, raw_data_source, information_request} = selectedResource;

    const findResourceName = (source, id) => {
      const resource = source.find(item => item._id === id);
      return resource ? resource[`name${capitalize(locale)}`] || resource.name : "";
    };

    useEffect(() => {
      setValue(
        table ? findResourceName(tables, table) :
        raw_data_source ? findResourceName(rawDataSources, raw_data_source) :
        information_request ? findResourceName(informationRequests, information_request) : ""
      );

      const updateWidthScreen = () => {
        setWidthScreen(window.innerWidth - 48)
      }

      updateWidthScreen()

      window.addEventListener('resize', updateWidthScreen)

      return () => {
        window.removeEventListener('resize', updateWidthScreen)
      }
    }, [table, raw_data_source, information_request]);

    return (
      <Menu>
        <LabelText
          as="label"
          display="flex"
          flexDirection="column"
          gap="8px"
        >
          {t('selectResource')}

          <MenuButton
            width="100%"
            maxWidth="360px"
            borderRadius="8px"
            padding="14px 20px"
            backgroundColor="#EEEEEE"
            textAlign="start"
          >
            <BodyText
              typography="small"
              display="flex"
              color="#464A51"
              justifyContent="space-between"
              alignItems="center"
            >
              {value}
              <ChevronIcon
                marginLeft="auto"
                transform="rotate(90deg)"
              />
            </BodyText>
          </MenuButton>
        </LabelText>

        <MenuList
          minWidth={widthScreen}
          maxWidth={widthScreen}
          maxHeight="420px"
          overflowY="auto"
          borderWidth={0}
          padding={0}
          zIndex={100}
          boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
        >
          {tables.length > 0 &&
            <MenuOptionGroup
              title="Tabelas tratadas"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="16px"
              lineHeight="24px"
              color="#71757A"
              margin="0"
              padding="24px 20px 8px"
            >
              {tables.map((elm, i) => {return (
                <MenuItem
                  key={i}
                  width="100%"
                  whiteSpace="normal"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  wordBreak="break-all"
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#252A32"
                  padding="16px 20px"
                  _hover={{ backgroundColor: "transparent"}}
                  _focus={{ backgroundColor: "transparent"}}
                  _active={{ backgroundColor: "transparent" }}
                  _focusVisible={{ backgroundColor: "transparent" }}
                  onClick={() => pushQuery("table", elm._id)}
                  >
                  {elm.name || elm.number}
                </MenuItem>
              )})}
            </MenuOptionGroup>
          }

          {rawDataSources.length > 0 &&
            <>
              <MenuDivider margin="0" borderWidth="2px" borderColor="#DEDFE0"/>
              <MenuOptionGroup
                title="Fontes originais"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#71757A"
                margin="0"
                padding="24px 20px 8px"
              >
                {rawDataSources.map((elm, i) => {return (
                  <MenuItem
                    key={i}
                    width="100%"
                    whiteSpace="normal"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    wordBreak="break-all"
                    fontFamily="Roboto"
                    fontWeight="500"
                    fontSize="14px"
                    lineHeight="20px"
                    color="#252A32"
                    padding="16px 20px"
                    _hover={{ backgroundColor: "transparent"}}
                    _focus={{ backgroundColor: "transparent"}}
                    _active={{ backgroundColor: "transparent" }}
                    _focusVisible={{ backgroundColor: "transparent" }}
                    onClick={() => pushQuery("raw_data_source", elm._id)}
                  >
                    {elm.name || elm.number}
                  </MenuItem>
                )})}
              </MenuOptionGroup>
            </>
          }

          {informationRequests.length > 0 &&
            <>
              <MenuDivider margin="0" borderWidth="2px" borderColor="#DEDFE0"/>
              <MenuOptionGroup
                title="Pedidos LAI"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#71757A"
                margin="0"
                padding="24px 20px 8px"
              >
                {informationRequests.map((elm, i) => {return (
                  <MenuItem
                    key={i}
                    width="100%"
                    whiteSpace="normal"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    wordBreak="break-all"
                    fontFamily="Roboto"
                    fontWeight="500"
                    fontSize="14px"
                    lineHeight="20px"
                    color="#252A32"
                    padding="16px 20px"
                    _hover={{ backgroundColor: "transparent"}}
                    _focus={{ backgroundColor: "transparent"}}
                    _active={{ backgroundColor: "transparent" }}
                    _focusVisible={{ backgroundColor: "transparent" }}
                    onClick={() => pushQuery("information_request", elm._id)}
                  >
                    {elm.name || elm.number}
                  </MenuItem>
                )})}
              </MenuOptionGroup>
            </>
          }
        </MenuList>
      </Menu>
    )
  }

  return (
    <Stack
      paddingTop="32px"
      direction={{ base: "column", lg: "row" }}
      gap="24px"
      spacing={0}
      height="100%"
    >
      {displayScreen === "desktop" ? 
        <Stack
          minWidth={{base: "100%", lg: "296px"}}
          maxWidth={{base: "100%", lg: "296px"}}
          spacing={0}
          position={pinTablesSelect ? "relative" : "sticky"}
          height="100%"
          top={pinTablesSelect ? "0" : "80px"}
        >
          <ContentFilter
            id="dataset_select_tables"
            fieldName={t('tables')}
            choices={tables}
            value={query.table}
            onChange={(id) => {
              pushQuery("table", id)
            }}
            hasDivider={false}
          />

          <ContentFilter
            id="dataset_select_rawdatasource"
            fieldName={t('rawDataSources')}
            choices={rawDataSources}
            value={query.raw_data_source}
            onChange={(id) => {
              pushQuery("raw_data_source", id)
              const tourBD = cookies.get('tourBD') ? JSON.parse(cookies.get('tourBD')) : null;
              if(tourBD && tourBD.state === 'download') {
                cookies.set('tourBD', '{"state":"last"}', { expires: 360 })
              }
            }}
            hasDivider={tables.length > 0 ? true : false}
          />

          <ContentFilter
            fieldName={t('informationRequests')}
            choices={informationRequests}
            value={query.information_request}
            onChange={(id) => {
              pushQuery("information_request", id)
            }}
            hasDivider={tables.length > 0 || rawDataSources.length > 0 ? true : false}
          />
        </Stack>
        :
        <SelectResource selectedResource={query}/>
      }

      <SwitchResource route={query}/>
    </Stack>
  )
}