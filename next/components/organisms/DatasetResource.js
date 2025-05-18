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
  Spinner,
  useBreakpointValue
} from "@chakra-ui/react";
import { useRef, useEffect, useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { capitalize } from "lodash";
import cookies from "js-cookie";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";
import {
  startFirstTour,
  startSecondTour,
  startThirdTour,
  startFourthTour
} from "../molecules/Tour";

import TablePage from "./TablePage";
import RawDataSourcesPage from "./RawDataSourcesPage";
import InformationRequestPage from "./InformationRequestPage";

import introJs from 'intro.js';
import 'intro.js/introjs.css';

import ChevronIcon from "../../public/img/icons/chevronIcon";

const ContentFilter = memo(({ id, fieldName, choices, onChange, value, hasDivider = true }) => {
  const [isOverflow, setIsOverflow] = useState({});
  const textRefs = useRef({});
  const { locale } = useRouter();

  const choicesWithNames = useMemo(() => 
    choices.map(choice => ({
      ...choice,
      displayName: choice[`name${capitalize(locale)}`] || choice.name || choice.number
    })),
    [choices, locale]
  );

  useEffect(() => {
    choicesWithNames.forEach((elm, i) => {
      const textElement = textRefs.current[i];
      if (textElement) {
        setIsOverflow((prev) => ({
          ...prev,
          [i]: textElement.scrollWidth > textElement.clientWidth,
        }));
      }
    });
  }, [choicesWithNames]);

  if(choices.length === 0) return null;

  const handleClick = useCallback((id) => {
    onChange(id);
  }, [onChange]);

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
          {choicesWithNames.map((elm, i) => (
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
                label={elm.displayName}
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
                  onClick={() => handleClick(elm._id)}
                >
                  {elm.displayName}
                </LabelText>
              </Tooltip>
            </HStack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
});

const SelectResource = memo(({ selectedResource, pushQuery, tables, rawDataSources, informationRequests }) => {
  const { t } = useTranslation('dataset');
  const [widthScreen, setWidthScreen] = useState(0);
  const [value, setValue] = useState("");
  const { locale } = useRouter();
  const { table, raw_data_source, information_request } = selectedResource;

  const findResourceName = useCallback((source, id) => {
    const resource = source.find(item => item._id === id);
    return resource ? resource[`name${capitalize(locale)}`] || resource.name : "";
  }, [locale]);

  const updateWidthScreen = useCallback(() => {
    setWidthScreen(window.innerWidth - 48);
  }, []);

  const menuItems = useMemo(() => ({
    tables: tables.map(elm => ({
      ...elm,
      displayName: elm.name || elm.number
    })),
    rawDataSources: rawDataSources.map(elm => ({
      ...elm,
      displayName: elm.name || elm.number
    })),
    informationRequests: informationRequests.map(elm => ({
      ...elm,
      displayName: elm.name || elm.number
    }))
  }), [tables, rawDataSources, informationRequests]);

  useEffect(() => {
    setValue(
      table ? findResourceName(tables, table) :
      raw_data_source ? findResourceName(rawDataSources, raw_data_source) :
      information_request ? findResourceName(informationRequests, information_request) : ""
    );

    updateWidthScreen();
    window.addEventListener('resize', updateWidthScreen);

    return () => {
      window.removeEventListener('resize', updateWidthScreen);
    };
  }, [table, raw_data_source, information_request, findResourceName, updateWidthScreen, tables, rawDataSources, informationRequests]);

  const handleMenuItemClick = useCallback((type, id) => {
    pushQuery(type, id);
  }, [pushQuery]);

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
        {menuItems.tables.length > 0 &&
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
            {menuItems.tables.map((elm, i) => (
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
                onClick={() => handleMenuItemClick("table", elm._id)}
              >
                {elm.displayName}
              </MenuItem>
            ))}
          </MenuOptionGroup>
        }

        {menuItems.rawDataSources.length > 0 &&
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
              {menuItems.rawDataSources.map((elm, i) => (
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
                  onClick={() => handleMenuItemClick("raw_data_source", elm._id)}
                >
                  {elm.displayName}
                </MenuItem>
              ))}
            </MenuOptionGroup>
          </>
        }

        {menuItems.informationRequests.length > 0 &&
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
              {menuItems.informationRequests.map((elm, i) => (
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
                  onClick={() => handleMenuItemClick("information_request", elm._id)}
                >
                  {elm.displayName}
                </MenuItem>
              ))}
            </MenuOptionGroup>
          </>
        }
      </MenuList>
    </Menu>
  );
});

const SwitchResource = memo(({ route, isBDSudo, changeTabDataInformationQuery, locale }) => {
  switch(true) {
    case route.hasOwnProperty("table"):
      return (
        <TablePage
          id={route.table}
          isBDSudo={isBDSudo}
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
});

export default function DatasetResource({
  dataset,
  isBDSudo,
  tourBegin
}) {
  const { t } = useTranslation('dataset');
  const router = useRouter();
  const { query, locale } = router;
  const [tables, setTables] = useState([]);
  const [rawDataSources, setRawDataSources] = useState([]);
  const [informationRequests, setInformationRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const displayScreen = useBreakpointValue({ base: "mobile", lg: "desktop" });
  const [tourBeginTable, setTourBeginTable] = useState(false);
  const [pinTablesSelect, setPinTablesSelect] = useState(false);
  const [changeTabDataInformationQuery, setChangeTabDataInformationQuery] = useState(false);

  const getTourBD = useCallback(() => {
    try {
      return cookies.get('tourBD') ? JSON.parse(cookies.get('tourBD')) : null;
    } catch (error) {
      console.error('Error parsing tourBD:', error);
      return null;
    }
  }, []);

  const pushQuery = useCallback((key, value) => {
    router.replace({
      pathname: `/dataset/${query.dataset}`,
      query: { [key]: value }
    },
      undefined, { shallow: true }
    );
  }, [query.dataset, router]);

  const sortElements = useCallback((a, b) => {
    if (a.order < b.order) return -1;
    if (a.order > b.order) return 1;
    return 0;
  }, []);

  useEffect(() => {
    if (tourBegin) {
      const tourBD = getTourBD();
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
  }, [tourBegin, query.table, dataset, getTourBD, pushQuery, sortElements]);

  useEffect(() => {
    document.body.style.overflow = isLoading ? "hidden" : "auto";
    document.body.style.pointerEvents = isLoading ? "none" : "auto";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    };
  }, [isLoading]);

  useEffect(() => {
    const handleTablePageLoaded = (e) => {
      setTourBeginTable(true);
    };

    window.addEventListener('tablePageLoaded', handleTablePageLoaded);

    return () => {
      window.removeEventListener('tablePageLoaded', handleTablePageLoaded);
    };
  }, []);

  useEffect(() => {
    const handleLoadingTourBegin = (e) => {
      setIsLoading(true);
    };

    window.addEventListener('loadingTourBegin', handleLoadingTourBegin);

    return () => {
      window.removeEventListener('loadingTourBegin', handleLoadingTourBegin);
    };
  }, []);

  const tourStateRef = useRef({
    activeTour: null,
    isTourRunning: false
  });

  useEffect(() => {
    const TOUR_STATES = {
      EXPLORE: 'explore',
      SKIP: 'skip',
      BEGIN: 'begin',
      TABLE: 'table',
      DOWNLOAD: 'download',
      LAST: 'last'
    };

    const shouldRunTour = (tourBD) => {
      return tourBD?.state && 
            tourBD.state !== TOUR_STATES.EXPLORE && 
            tourBD.state !== TOUR_STATES.SKIP &&
            (tourBD.state === TOUR_STATES.LAST || tourBeginTable) && 
            displayScreen === 'desktop' &&
            !tourStateRef.current.isTourRunning;
    };

    const startTour = (state) => {
      const startTourWithDelay = (callback) => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            callback();
            tourStateRef.current.isTourRunning = false;
          });
        }, 500);
      };

      switch (state) {
        case TOUR_STATES.BEGIN:
          startTourWithDelay(() => {
            startFirstTour(locale);
            tourStateRef.current.activeTour = TOUR_STATES.BEGIN;
          });
          break;
        case TOUR_STATES.TABLE:
          startTourWithDelay(() => {
            startSecondTour(setChangeTabDataInformationQuery, locale);
            tourStateRef.current.activeTour = TOUR_STATES.TABLE;
          });
          break;
        case TOUR_STATES.DOWNLOAD:
          startTourWithDelay(() => {
            startThirdTour(locale);
            tourStateRef.current.activeTour = TOUR_STATES.DOWNLOAD;
          });
          break;
        case TOUR_STATES.LAST:
          startTourWithDelay(() => {
            startFourthTour(locale);
            tourStateRef.current.activeTour = TOUR_STATES.LAST;
          });
          break;
        default:
          break;
      }
    };

    const checkTourState = () => {
      try {
        const tourBD = getTourBD();
        if (!shouldRunTour(tourBD)) return;

        setPinTablesSelect(true);

        if (tourStateRef.current.activeTour && tourStateRef.current.activeTour !== tourBD.state) {
          introJs().exit();
          tourStateRef.current.activeTour = null;
        }

        if (tourStateRef.current.activeTour === tourBD.state) return;

        tourStateRef.current.isTourRunning = true;
        setIsLoading(false);
        startTour(tourBD.state);
      } catch (error) {
        console.error('Tour error:', error);
        tourStateRef.current.isTourRunning = false;
      }
    };

    const tourBD = getTourBD();
    if (tourBD?.state === TOUR_STATES.EXPLORE || tourBD?.state === TOUR_STATES.SKIP) {
      return;
    }

    const interval = setInterval(checkTourState, 1000);

    return () => {
      clearInterval(interval);
      introJs().exit();
    };
  }, [cookies, displayScreen, tourBeginTable, isLoading, locale, getTourBD]);

  useEffect(() => {
    let dataset_tables;
    let raw_data_sources;
    let information_request;

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

    const queryParams = new URLSearchParams(window.location.search);

    if(queryParams.toString().length === 0) {
      if(dataset_tables.length > 0) return pushQuery("table", dataset_tables[0]?._id);
      if(raw_data_sources.length > 0) return pushQuery("raw_data_source", raw_data_sources[0]?._id);
      if(information_request.length > 0) return pushQuery("information_request", information_request[0]?._id);
    }
  }, [dataset, isBDSudo, sortElements, pushQuery]);

  return (
    <Stack
      paddingTop="32px"
      direction={{ base: "column", lg: "row" }}
      gap="24px"
      spacing={0}
      height="100%"
    >
      <Stack
        display={isLoading ? "flex" : "none"}
        position="fixed"
        top="0"
        left="0"
        zIndex="99999999"
        width="100%"
        height="100vh"
        justifyContent="center"
        backgroundColor="#00000025"
      >
        <Spinner
          margin="0 auto"
          width="200px"
          height="200px"
          color="#2B8C4D"
        />
      </Stack>

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
              pushQuery("table", id);
            }}
            hasDivider={false}
          />

          <ContentFilter
            id="dataset_select_rawdatasource"
            fieldName={t('rawDataSources')}
            choices={rawDataSources}
            value={query.raw_data_source}
            onChange={(id) => {
              pushQuery("raw_data_source", id);
              const tourBD = getTourBD();
              if(tourBD && tourBD.state === 'download') {
                cookies.set('tourBD', '{"state":"last"}', { expires: 360 });
              }
            }}
            hasDivider={tables.length > 0 ? true : false}
          />

          <ContentFilter
            fieldName={t('informationRequests')}
            choices={informationRequests}
            value={query.information_request}
            onChange={(id) => {
              pushQuery("information_request", id);
            }}
            hasDivider={tables.length > 0 || rawDataSources.length > 0 ? true : false}
          />
        </Stack>
        :
        <SelectResource 
          selectedResource={query}
          pushQuery={pushQuery}
          tables={tables}
          rawDataSources={rawDataSources}
          informationRequests={informationRequests}
        />
      }

      <SwitchResource 
        route={query}
        isBDSudo={isBDSudo}
        changeTabDataInformationQuery={changeTabDataInformationQuery}
        locale={locale}
      />
    </Stack>
  );
}