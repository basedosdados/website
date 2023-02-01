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
import { getRecentDatalakeDatasetsByTheme } from "../../pages/api/datasets";
import DatabaseCard from "../organisms/DatabaseCard";
import Carousel from "../atoms/Carousel";
import SectionText from "../atoms/SectionText";
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
            onClick={() => onSelectTheme(elm.name)}
            key={elm.id}
            cursor="pointer"
            width={responsive.mobileQuery ? "65px" : "100px" }
            minWidth={responsive.mobileQuery ? "65px" : "100px" }
            height={responsive.mobileQuery ? "65px" : "100px" }
            minHeight={responsive.mobileQuery ? "65px" : "100px" }
            borderRadius={responsive.mobileQuery ? "12px" : "16px" }
            backgroundColor={ found(elm.name) ? "#2B8C4D" : "FFF"}
            boxShadow="0px 1px 8px 1px rgba(64, 60, 67, 0.16)"
            _hover={{ transform:"scale(1.1)", backgroundColor:"#2B8C4D" }}
            transition="all 0.5s"
            margin="10px 0"
          >
            <Tooltip
              hasArrow
              bg="#2A2F38"
              label={elm.display_name}
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
                filter={found(elm.name) && "invert(1)"}
                _hover={{ filter:"invert(1)"}}
                alt={`${elm.name}`}
                src={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${elm.name}.svg`}
              />
            </Tooltip>
            <RemoveIcon
              alt="remover tema do filtro"
              display={found(elm.name) ? "flex" : "none"}
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

function CardThemes ({ responsive, recentDataSets=[], loading }) {
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
      {recentDataSets.length === 0 &&
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
            loop: true,
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
          recentDataSets.length === 0 ?
            new Array(screenQuery).fill(0).map(() => (
              <>
                <Skeleton width="280px" height="290px" margin="20px 0"/>
              </>
            ))
            :
            recentDataSets.map((elm) => (
              <DatabaseCard
                link={`/dataset/${elm.name}`}
                name={elm.title}
                organization={elm.organization.title}
                organizationSlug={elm.organization.name}
                tags={elm.tags.map((g) => g.name)}
                size={
                  elm.resources.filter((r) => r.bdm_file_size && r.bdm_file_size > 0)
                    .length > 0
                    ? elm.resources.filter((r) => r.bdm_file_size)[0].bdm_file_size
                    : null
                }
                tableNum={
                  elm.resources.filter((r) => r.resource_type === "bdm_table").length
                }
                externalLinkNum={
                  elm.resources.filter((r) => r.resource_type === "external_link").length
                }
                informationRequestNum={
                  elm.resources.filter((r) => r.resource_type === "information_request").length
                }
                updatedSince={elm.metadata_modified}
                categories={elm.groups.map((g) => [g.name, g.display_name])}
              />
            ))
          }
        </Carousel>
      </Center>
    </Box>
  )
}

export default function ThemeCatalog ({ popularDatalakeDatasets, themes }) {
  const [recentDataSets, setRecentDataSets] = useState([])
  const [listThemes, setListThemes] = useState([])
  const [selectedTheme, setSelectedTheme] = useState([])
  const [loading, setLoading] = useState(false)
  
  const mobileCheck = useCheckMobile()
  const [mobileQuery, setMobileQuery] = useState(false)
  const [baseQuery] = useMediaQuery("(max-width: 938px)")
  const [mediumQuery] = useMediaQuery("(max-width: 1250px)")
  const [lgQuery] = useMediaQuery("(max-width: 1366px)")

  useEffect(() => {
    setMobileQuery(mobileCheck)
  },[])

  useEffect(() => {
    setListThemes(themes)
    setRecentDataSets(popularDatalakeDatasets)
  },[popularDatalakeDatasets, themes])

  const handleSelectTheme = (elm) => {
    window.open("#theme", "_self")
    const newSelectedTheme = [elm, ...selectedTheme]
    setSelectedTheme(newSelectedTheme)

    const filtedThemes = newSelectedTheme.filter(res => res !== elm)

    if(found(elm)) {
      setSelectedTheme(filtedThemes)
      newRecentDataLake(filtedThemes)   
    } else {
      newRecentDataLake(newSelectedTheme)
    }
  }
  
  const found = (value) => {
    return selectedTheme.find(res => res === value)
  }

  const newRecentDataLake = (themes) => {
    setLoading(true)
    getRecentDatalakeDatasetsByTheme(themes.toString())
      .then(res => {
        setRecentDataSets(res.slice(0,10))
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
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
        responsive={{mobileQuery, baseQuery, mediumQuery, lgQuery}}
        recentDataSets={recentDataSets}
        loading={loading}
      />
    </VStack>
  )
}
