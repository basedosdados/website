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
  const [tables, setTables] = useState([])
  const [rawDataSources, setRawDataSources] = useState([])
  const [informationRequests, setInformationRequests] = useState([])
  const displayScreen = useBreakpointValue({ base: "mobile", lg: "desktop" })
  const [tourBeginTable, setTourBeginTable] = useState(false)
  const [pinTablesSelect, setPinTablesSelect] = useState(false)

  const TourTable = () => {
    const tour = introJs().setOptions({
      steps: [
        {
          element: '#dataset_select_tables',
          title: 'Escolha uma tabela tratada',
          intro: 'Para começar, selecione uma das opções para acessar os dados desejados. As tabelas tratadas já contêm dados prontos para análise. O tratamento das tabelas envolve a padronização dos nomes das variáveis, o que permite que o cruzamento de tabelas de diferentes instituições e temas seja tão simples quanto qualquer outra consulta.',
          position: 'right'
        },
        {
          element: '#table_temporalcoverage',
          title: 'Verifique a cobertura temporal da tabela',
          intro: 'A cobertura temporal dos dados pode variar entre <strong>totalmente grátis</strong>, <strong>parcialmente grátis</strong> e <strong>totalmente pago</strong>. Os dados dentro do intervalo de anos gratuitos podem ser acessados sem custos, enquanto os dados nos anos pagos exigem uma assinatura do plano <strong>Pro</strong> ou <strong>Empresas</strong>.',
          position: 'right'
        },
        {
          element: '#table_access_data',
          title: 'Conheça as formas de acessar os dados',
          intro: 'Você pode acessar os dados de duas formas: <br/> <ul><li><strong>BigQuery e Pacotes</strong>: Acesse os dados no BigQuery ou por meio de pacotes em Python e R.</li><li><strong>Download</strong>: Baixe o arquivo CSV diretamente na plataforma.</li></ul><br/> Nos próximos passos, vamos te mostrar primeiro como acessar pelo <strong>BigQuery e Pacotes</strong>. Em seguida, explicaremos como fazer o <strong>download</strong> dos dados.',
          position: 'right'
        },
        {
          element: '#access_via_bigquery',
          title: 'Acesso via BigQuery e Pacotes',
          intro: 'Para continuar, <strong>selecione as colunas</strong> que deseja acessar. Como nossa missão é facilitar sua análise, a plataforma traduz automaticamente todas as colunas que contêm códigos institucionais, como município. Depois, basta clicar no botão para <strong>gerar a consulta</strong>.',
          position: 'left'
        },
        {
          element: '#access_query_language',
          title: 'Escolha a linguagem de sua preferência',
          intro: 'Agora, <strong>selecione a aba</strong> com a linguagem que você deseja acessar os dados: SQL, Python ou R.',
          position: 'right'
        },
        {
          element: '#access_generated_query',
          title: 'Consulta gerada',
          intro: 'A plataforma disponibiliza a consulta na linguagem escolhida, permitindo que você acesse os dados como preferir.',
          position: 'left'
        }
      ],
      nextLabel: 'Avançar',
      prevLabel: 'Voltar',
      exitOnOverlayClick: false,
      showBullets: false,
      showStepNumbers: true
    })

    tour.onafterchange(() => {
      document.querySelector('.introjs-donebutton')?.removeEventListener('click', onDoneClick);
      document.querySelector('.introjs-skipbutton')?.removeEventListener('click', onSkipClick);

      document.querySelector('.introjs-donebutton')?.addEventListener('click', onDoneClick);
      document.querySelector('.introjs-skipbutton')?.addEventListener('click', onSkipClick);
    });

    const onDoneClick = () => {
      // cookies.set('tourBD', '{"state":"table"}', { expires: 30 })
    };

    const onSkipClick = () => {
      console.log('Usuário pulou o tour');
    };

    tour.start()
  }

  useEffect(() => {
    const tourBD = cookies.get("tourBD") ? JSON.parse(cookies.get("tourBD")) : null;
    if(tourBD && tourBD.state === "begin" && displayScreen === "desktop" && tourBeginTable) {
      setPinTablesSelect(true)
      requestAnimationFrame(() => {
        TourTable();
      });
    }
  }, [cookies.get("tourBD"), displayScreen, tourBegin, tourBeginTable])

  const pushQuery = (key, value) => {
    router.replace({
      pathname: `/dataset/${query.dataset}`,
      query: { [key]: value }
    },
      undefined, { shallow: true }
    )
  }

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
    if (route.hasOwnProperty("table")) return <TablePage id={route.table} isBDSudo={isBDSudo} tourBegin={setTourBeginTable}/>
    if (route.hasOwnProperty("raw_data_source")) return <RawDataSourcesPage id={route.raw_data_source} locale={locale} isBDSudo={isBDSudo}/>
    if (route.hasOwnProperty("information_request")) return <InformationRequestPage id={route.information_request} isBDSudo={isBDSudo}/>
    return null
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
      <Box width="272px" id={id} backgroundColor="#FFFFFF">
        <Divider
          display={hasDivider ? "flex" : "none"}
          marginY="24px"
          borderColor="#DEDFE0"
        />

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
            fieldName={t('rawDataSources')}
            choices={rawDataSources}
            value={query.raw_data_source}
            onChange={(id) => {
              pushQuery("raw_data_source", id)
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