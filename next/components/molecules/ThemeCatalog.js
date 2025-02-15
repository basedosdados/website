import {
  VStack,
  Center,
  Box,
  Image,
  Tooltip,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import { useMediaQuery } from "@chakra-ui/react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { triggerGAEvent } from "../../utils";

import Carousel from "../atoms/Carousel";
import DatasetThemeCatalogCard from "../organisms/DatasetThemeCatalogCard";
import RemoveIcon from "../../public/img/icons/removeIcon";
import styles from "../../styles/themeCatalog.module.css";

function Themes({
  loading,
  responsive,
  onSelectTheme,
  selectedTheme = [],
  listThemes,
  locale,
}) {
  const [screenQuery, setScreenQuery] = useState(0);

  useEffect(() => {
    if (responsive.mobileQuery) return setScreenQuery(4);
    if (responsive.baseQuery) return setScreenQuery(6);
    if (responsive.mediumQuery) return setScreenQuery(9);
    if (responsive.lgQuery) return setScreenQuery(10);

    return setScreenQuery(10);
  }, [responsive]);

  const found = (value) => {
    return selectedTheme.find((res) => res === value);
  };

  return (
    <Center width="95vw" height="120px" maxWidth="1264px">
      <Carousel
        settings={{
          spaceBetween: responsive.mobileQuery ? 20 : 10,
          slidesPerView: screenQuery,
          slidesPerGroup: 2,
          navigation: !responsive.mobileQuery && true,
          loop: true,
          autoplay: {
            delay: selectedTheme[0] ? 1000000 : 3000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          },
        }}
      >
        {loading
          ? new Array(screenQuery)
              .fill(0)
              .map((elm, i) => (
                <Skeleton
                  key={i}
                  position="relative"
                  margin="10px 0"
                  startColor="#F0F0F0"
                  endColor="#CECECE"
                  width={responsive.mobileQuery ? "65px" : "100px"}
                  minWidth={responsive.mobileQuery ? "65px" : "100px"}
                  height={responsive.mobileQuery ? "65px" : "100px"}
                  minHeight={responsive.mobileQuery ? "65px" : "100px"}
                  borderRadius={responsive.mobileQuery ? "12px" : "16px"}
                />
              ))
          : listThemes
            ? Object.values(listThemes).map((elm) => (
                <Center
                  key={elm.node._id}
                  position="relative"
                  onClick={() => onSelectTheme(elm.node.slug)}
                  cursor="pointer"
                  width={responsive.mobileQuery ? "65px" : "100px"}
                  minWidth={responsive.mobileQuery ? "65px" : "100px"}
                  height={responsive.mobileQuery ? "65px" : "100px"}
                  minHeight={responsive.mobileQuery ? "65px" : "100px"}
                  borderRadius={responsive.mobileQuery ? "12px" : "16px"}
                  backgroundColor={found(elm.node.slug) ? "#2B8C4D" : "FFF"}
                  boxShadow="0px 1px 8px 1px rgba(64, 60, 67, 0.16)"
                  _hover={{
                    transform: "scale(1.1)",
                    backgroundColor: "#2B8C4D",
                  }}
                  transition="all 0.5s"
                  margin="10px 0"
                >
                  <Tooltip
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
                    maxWidth="160px"
                    label={
                      elm.node[`name${capitalize(locale)}`] || elm.node.name
                    }
                  >
                    <Image
                      className={styles.iconTheme}
                      width="100%"
                      padding={responsive.mobileQuery ? "5px" : "10px"}
                      height="100%"
                      transition="all 0.5s"
                      filter={found(elm.node.slug) && "invert(1)"}
                      _hover={{ filter: "invert(1)" }}
                      alt={
                        elm.node[`name${capitalize(locale)}`] || elm.node.name
                      }
                      src={`https://storage.googleapis.com/basedosdados-website/theme_icons/${elm.node.slug}.svg`}
                    />
                  </Tooltip>
                  <RemoveIcon
                    alt="remover tema do filtro"
                    display={found(elm.node.slug) ? "flex" : "none"}
                    fill="#0D99FC"
                    width={responsive.mobileQuery ? "20px" : "30px"}
                    height={responsive.mobileQuery ? "20px" : "30px"}
                    transition="all 0.5s"
                    position="absolute"
                    top="-1"
                    right="-1"
                  />
                </Center>
              ))
            : new Array(screenQuery)
                .fill(0)
                .map((elm, i) => (
                  <Skeleton
                    key={i}
                    position="relative"
                    margin="10px 0"
                    startColor="#F0F0F0"
                    endColor="#CECECE"
                    width={responsive.mobileQuery ? "65px" : "100px"}
                    minWidth={responsive.mobileQuery ? "65px" : "100px"}
                    height={responsive.mobileQuery ? "65px" : "100px"}
                    minHeight={responsive.mobileQuery ? "65px" : "100px"}
                    borderRadius={responsive.mobileQuery ? "12px" : "16px"}
                  />
                ))}
      </Carousel>
    </Center>
  );
}

const SkeletonWaitCard = () => {
  return (
    <Box
      width="280px"
      height="320px"
      margin="20px 0"
      borderRadius="12px"
      backgroundColor="#FFF"
      boxShadow="0 2px 5px 1px rgba(64, 60, 67, 0.16)"
      padding="29px 25px 25px 25px"
    >
      <Box display="flex" flexDirection="row" gap="8px" marginBottom="16px">
        <Skeleton
          width="30px"
          height="30px"
          borderRadius="6px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
        <Skeleton
          width="30px"
          height="30px"
          borderRadius="6px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
        <Skeleton
          width="30px"
          height="30px"
          borderRadius="6px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
      </Box>
      <SkeletonText
        noOfLines={2}
        spacing="4"
        startColor="#F0F0F0"
        endColor="#F0F0F0"
      />
      <SkeletonText
        marginTop="20px"
        noOfLines={1}
        startColor="#F0F0F0"
        endColor="#F0F0F0"
      />
      <Box display="flex" flexDirection="row" gap="8px" marginTop="72px">
        <Skeleton
          width="30%"
          height="24px"
          borderRadius="6px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
        <Skeleton
          width="30%"
          height="24px"
          borderRadius="6px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
        <Skeleton
          width="30%"
          height="24px"
          borderRadius="6px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
      </Box>
      <SkeletonText
        marginTop="26px"
        noOfLines={2}
        spacing="4"
        startColor="#F0F0F0"
        endColor="#F0F0F0"
      />
    </Box>
  );
};

function CardThemes({ responsive, datasetsCards = [], loading, locale }) {
  const { t } = useTranslation("common");
  const [screenQuery, setScreenQuery] = useState(0);

  useEffect(() => {
    if (responsive.mobileQuery) return setScreenQuery(1);
    if (responsive.baseQuery) return setScreenQuery(2);
    if (responsive.mediumQuery) return setScreenQuery(3);

    return setScreenQuery(4);
  }, [responsive]);

  return (
    <Box
      width={responsive.mobileQuery ? "100vw" : "95vw"}
      maxWidth="1440px"
      margin={
        responsive.mobileQuery
          ? "24px 0 48px !important"
          : "40px 0 48px !important"
      }
    >
      {!loading && datasetsCards?.length === 0 && (
        <Center padding="0 40px">
          <Text
            fontFamily="Roboto"
            color="#71757A"
            fontSize={responsive.mobileQuery ? "14px" : "18px"}
            lineHeight={responsive.mobileQuery ? "20px" : "26px"}
            textAlign="center"
            marginBottom={responsive.mobileQuery ? "16px" : "32px"}
          >
            {t("noDatasetsFound", { returnObjects: true })[0]}
            {useCheckMobile() ? null : <br />}
            {t("noDatasetsFound", { returnObjects: true })[1]}
          </Text>
        </Center>
      )}
      <Center
        className={styles.cards}
        width={responsive.mobileQuery ? "100vw" : "100%"}
      >
        <Carousel
          settings={{
            spaceBetween: 10,
            slidesPerView: screenQuery,
            navigation: true,
            loop: screenQuery < !datasetsCards ? true : false,
            autoplay: {
              delay: 6000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            },
          }}
        >
          {loading
            ? new Array(screenQuery)
                .fill(0)
                .map((elm, i) => <SkeletonWaitCard key={i} />)
            : datasetsCards.length === 0
              ? new Array(screenQuery)
                  .fill(0)
                  .map((elm, i) => <SkeletonWaitCard key={i} />)
              : datasetsCards.map((elm, i) => (
                  <DatasetThemeCatalogCard
                    key={i}
                    name={elm?.name}
                    themes={elm?.themes}
                    organizations={elm?.organizations}
                    tags={elm?.tags}
                    tables={{
                      id: elm?.first_table_id || elm?.first_closed_table_id,
                      number: elm?.n_tables,
                    }}
                    rawDataSources={{
                      id: elm?.first_raw_data_source_id,
                      number: elm?.n_raw_data_sources,
                    }}
                    link={`/dataset/${elm.id}`}
                    locale={locale}
                  />
                ))}
        </Carousel>
      </Center>
    </Box>
  );
}

export default function ThemeCatalog({ data, locale }) {
  const router = useRouter();
  const [listThemes, setListThemes] = useState([]);
  const [defaultDatasetsCards, setDefaultDatasetCards] = useState([]);
  const [fetchThemesTimeout, setFetchThemesTimeout] = useState(null);

  const [datasetsCards, setDatasetsCards] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTheme, setLoadingTheme] = useState(true);

  const mobileCheck = useCheckMobile();
  const [mobileQuery, setMobileQuery] = useState(false);
  const [baseQuery] = useMediaQuery("(max-width: 938px)");
  const [mediumQuery] = useMediaQuery("(max-width: 1250px)");
  const [lgQuery] = useMediaQuery("(max-width: 1366px)");

  useEffect(() => {
    setMobileQuery(mobileCheck);
    setListThemes(data.themes);
    setDefaultDatasetCards(data.defaultDataset);
    setLoading(false);
    setLoadingTheme(false);
  }, [data]);

  useEffect(() => {
    if (selectedTheme.length > 0) {
      if (fetchThemesTimeout) clearTimeout(fetchThemesTimeout);
      setLoading(true);

      const fetchFunc = setTimeout(async () => {
        try {
          const response = await axios.get("/api/themes/getDatasetsByThemes", {
            params: { themes: selectedTheme.join(","), locale },
          });
          setDatasetsCards(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching datasets by themes:", error);
          setLoading(false);
        }
      }, 500);

      setFetchThemesTimeout(fetchFunc);
    } else {
      setDatasetsCards(defaultDatasetsCards);
    }
  }, [selectedTheme, locale, defaultDatasetsCards]);

  const handleSelectTheme = (elm) => {
    router.push("#theme", undefined, { locale: router.locale });
    if (selectedTheme.includes(elm)) {
      setSelectedTheme(selectedTheme.filter((res) => res !== elm));
    } else {
      triggerGAEvent("theme_home", elm);
      triggerGAEvent("theme", elm);
      setSelectedTheme([elm, ...selectedTheme]);
    }
  };

  return (
    <VStack width="100%" alignItems="center">
      <Themes
        loading={loadingTheme}
        listThemes={listThemes}
        selectedTheme={selectedTheme}
        onSelectTheme={handleSelectTheme}
        responsive={{ mobileQuery, baseQuery, mediumQuery, lgQuery }}
        locale={locale}
      />

      <CardThemes
        datasetsCards={
          selectedTheme.length === 0 ? defaultDatasetsCards : datasetsCards
        }
        loading={loading}
        responsive={{ mobileQuery, baseQuery, mediumQuery, lgQuery }}
        locale={locale}
      />
    </VStack>
  );
}
