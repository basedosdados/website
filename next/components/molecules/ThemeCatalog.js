import {
  VStack,
  Center,
  Box,
  Image,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

import { 
  getAllThemes,
  getAllDatasets,
  getDatasetsByThemes
} from "../../pages/api/themes/index"

import Carousel from "../atoms/Carousel";
import SectionText from "../atoms/SectionText";
import DatabaseCard from "../organisms/DatabaseCard";
import RemoveIcon from "../../public/img/icons/removeIcon";
import styles from "../../styles/themeCatalog.module.css";

function Themes ({
  responsive,
  onSelectTheme,
  selectedTheme=[],
  listThemes=[],
}) {
  const [screenQuery, setScreenQuery] = useState(0)

  useEffect(() => {
    if(responsive.mobileQuery)
      return setScreenQuery(4)
    if(responsive.baseQuery)
      return setScreenQuery(6)
    if(responsive.mediumQuery)
      return setScreenQuery(9)
    if(responsive.lgQuery)
      return setScreenQuery(10)

    return setScreenQuery(10)
  },[responsive])

  const found = (value) => {
    return selectedTheme.find(res => res === value)
  }

  if(listThemes.length === 0) return null

  return (
    <Center
      width="95vw"
      maxWidth="1264px"
    >
      <Carousel 
        settings={{
          spaceBetween: responsive.mobileQuery ? 20 : 10,
          slidesPerView: screenQuery,
          slidesPerGroup: 2,
          navigation: !responsive.mobileQuery && true,
          loop: true,
          autoplay:{
            delay: selectedTheme[0] ? 1000000 : 3000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }
        }}
      >
        {listThemes && listThemes.map((elm) => (
          <Center
            position="relative"
            onClick={() => onSelectTheme(elm.node.slug)}
            key={elm.node._id}
            cursor="pointer"
            width={responsive.mobileQuery ? "65px" : "100px" }
            minWidth={responsive.mobileQuery ? "65px" : "100px" }
            height={responsive.mobileQuery ? "65px" : "100px" }
            minHeight={responsive.mobileQuery ? "65px" : "100px" }
            borderRadius={responsive.mobileQuery ? "12px" : "16px" }
            backgroundColor={ found(elm.node.slug) ? "#2B8C4D" : "FFF"}
            boxShadow="0px 1px 8px 1px rgba(64, 60, 67, 0.16)"
            _hover={{ transform:"scale(1.1)", backgroundColor:"#2B8C4D" }}
            transition="all 0.5s"
            margin="10px 0"
          >
            <Tooltip
              hasArrow
              bg="#2A2F38"
              label={elm.node.name}
              fontSize="16px"
              fontWeight="500"
              padding="5px 16px 6px"
              marginTop="10px"
              color="#FFF"
              borderRadius="6px"
            >
              <Image
                className={styles.iconTheme}
                width="100%"
                padding={responsive.mobileQuery ? "5px" : "10px"}
                height="100%"
                transition="all 0.5s"
                filter={found(elm.node.slug) && "invert(1)"}
                _hover={{ filter:"invert(1)"}}
                alt={`${elm.node.name}`}
                src={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${elm.node.slug}.svg`}
              />
            </Tooltip>
            <RemoveIcon
              alt="remover tema do filtro"
              display={found(elm.node.slug) ? "flex" : "none"}
              fill="#42B0FF"
              width={responsive.mobileQuery ? "20px" : "30px"}
              height={responsive.mobileQuery ? "20px" : "30px"}
              transition="all 0.5s"
              position="absolute"
              top="-1"
              right="-1"
            />
          </Center>
        ))}
      </Carousel>
    </Center>
  )
}

function CardThemes ({ responsive, datasetsCards, loading }) {
  const [screenQuery, setScreenQuery] = useState(0)
  useEffect(() => {
    if(responsive.mobileQuery)
      return setScreenQuery(1)
    if(responsive.baseQuery)
      return setScreenQuery(2)
    if(responsive.mediumQuery)
      return setScreenQuery(3)

    return setScreenQuery(4)
  },[responsive])

  return (
    <Box
      width={responsive.mobileQuery ? "100vw" : "95vw"}
      maxWidth="1264px"
      margin={responsive.mobileQuery ? "24px 0 48px !important" : "40px 0 48px !important"}
    >
      {!loading && !datasetsCards &&
        <Center padding="0 40px">
          <SectionText
            fontSize={responsive.mobileQuery ? "14px" : "18px"}
            color="#A3A3A3"
            textAlign="center"
            marginBottom={responsive.mobileQuery ? "16px" : "32px"}
          >
            Nenhum conjunto com todos os temas selecionados foi encontrado.
            Tente desmarcar algum dos temas.
          </SectionText>
        </Center>
      }
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
            }
          }}
        >
          {loading ?
            new Array(screenQuery).fill(0).map(() => (
              <Skeleton
                width="280px"
                height="290px"
                margin="20px 0"
                borderRadius="12px"
                startColor="#F0F0F0"
                endColor="#F0F0F0"
              />
            ))
          :
          !datasetsCards ?
            new Array(screenQuery).fill(0).map(() => (
              <>
                <Skeleton
                  width="280px"
                  height="290px"
                  margin="20px 0"
                  borderRadius="12px"
                />
              </>
            ))
            :
            datasetsCards.map((elm) => (
              <DatabaseCard
                name={elm?.name}
                categories={elm?.themes}
                organization={elm?.organization[0]}
                tags={elm?.tags}
                tables={{
                  id: elm?.tables?.[0]?.id,
                  number: elm?.n_bdm_tables
                }}
                rawDataSources={{
                  id: elm?.first_original_source_id,
                  number: elm?.n_original_sources
                }}
                informationRequests={{
                  id: elm?.first_lai_id,
                  number: elm?.n_lais
                }}
                link={`/dataset/${elm.id}`}
              />
            ))
          }
        </Carousel>
      </Center>
    </Box>
  )
}

export default function ThemeCatalog () {
  const [listThemes, setListThemes] = useState([])
  const [defaultDatasetsCards, setDefaultDatasetCards] = useState([])
  const [fetchThemesTimeout, setFetchThemesTimeout] = useState(null)

  const [datasetsCards, setDatasetsCards] = useState([])
  const [selectedTheme, setSelectedTheme] = useState([])
  const [loading, setLoading] = useState(true)

  const mobileCheck = useCheckMobile()
  const [mobileQuery, setMobileQuery] = useState(false)
  const [baseQuery] = useMediaQuery("(max-width: 938px)")
  const [mediumQuery] = useMediaQuery("(max-width: 1250px)")
  const [lgQuery] = useMediaQuery("(max-width: 1366px)")

  useEffect(() => {
    setMobileQuery(mobileCheck)
    fetchData()
  },[])

  const fetchData = async () => {
    const promises = []
    promises.push(fetchThemes())
    promises.push(fetchDatasets())
    await Promise.all(promises)
    setLoading(false)
  }

  const fetchDatasets = async () => {
    const defaultDataset = await getAllDatasets()
    setDefaultDatasetCards(defaultDataset)
  }

  const fetchThemes = async () => {
    const themes = await getAllThemes()
    setListThemes(themes)
  }

  useEffect(() => {
    if(selectedTheme.length > 0) {
      if(fetchThemesTimeout) clearTimeout(fetchThemesTimeout)
      setLoading(true)

      const fetchFunc = setTimeout(() => {
        getDatasetsByThemes(selectedTheme)
        .then(res => {
          setDatasetsCards(res)
          setLoading(false)
        })
      }, 500)
      
      setFetchThemesTimeout(fetchFunc)
    }
  },[selectedTheme])

  const handleSelectTheme = (elm) => {
    window.open("#theme", "_self")
    if(selectedTheme.includes(elm)) {
      setSelectedTheme(selectedTheme.filter(res => res !== elm))
    } else {
      setSelectedTheme([elm, ...selectedTheme])
    }
  }

  return (
    <VStack
      width="100%"
      alignItems="center"
    >
      <Themes
        listThemes={listThemes}
        selectedTheme={selectedTheme}
        onSelectTheme={handleSelectTheme}
        responsive={{mobileQuery, baseQuery, mediumQuery, lgQuery}}
      />

      <CardThemes
        datasetsCards={
          selectedTheme.length === 0 ?
          defaultDatasetsCards :
          datasetsCards
        }
        loading={loading}
        responsive={{mobileQuery, baseQuery, mediumQuery, lgQuery}}
      />
    </VStack>
  )
}
