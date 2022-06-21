import {
  VStack,
  Center,
  Image,
  Tooltip,
  Skeleton,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { useMediaQuery } from "@chakra-ui/react";
import { getRecentDatalakeDatasetsByTheme } from "../../pages/api/datasets";
import DatabaseCard from "../organisms/DatabaseCard";
import Carousel from "../atoms/Carousel";

function Themes ({
  responsive,
  onSelectTheme,
  selectedTheme=[],
  listThemes=[],
 }) {
  const responsiveChange = () => {
    if(responsive.mobileQuery)
      return 5
    if(responsive.baseQuery)
      return 6
    if(responsive.lgQuery)
      return 8

    return 10
  }

  const found = (value) => {
    return selectedTheme.find(res => res === value)
  }

  if(listThemes.length === 0)
    return null

  return (
    <Center
      width="95vw"
      maxWidth="1364px"
    >
      <Carousel 
        settings={{
          spaceBetween: 10,
          slidesPerView: responsiveChange(),
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
            onClick={() => onSelectTheme(elm.name)}
            key={elm.id}
            cursor="pointer"
            width={ responsive.mobileQuery ? "45px" : "100px" }
            minWidth={ responsive.mobileQuery ? "45px" : "100px" }
            height={ responsive.mobileQuery ? "45px" : "100px" }
            minHeight={ responsive.mobileQuery ? "45px" : "100px" }
            borderRadius={ responsive.mobileQuery ? "8px" : "16px" }
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
                width="100%"
                padding={ responsive.mobileQuery ? "5px" : "10px"}
                height="100%"
                transition="all 0.5s"
                filter={found(elm.name) ? "invert(1)" :"invert(0.8)"}
                _hover={{ filter:"invert(1)"}}
                alt={`${elm.name}`}
                src={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${elm.name}.svg`}
              />
            </Tooltip>
          </Center>
        ))}
      </Carousel>
    </Center>
  )
}

function CardThemes ({ responsive, recentDataSets=[], loading }) {
  const responsiveChange = () => {
    if(responsive.mobileQuery)
      return 1
    if(responsive.baseQuery)
      return 2
    if(responsive.lgQuery)
      return 3

    return 4
  }

  return (
    <Center
      width={responsive.mobileQuery ? "100vw" : "100%"}
      maxWidth="1364px"
      marginY="48px !important"
    >
      <Carousel 
        settings={{
          spaceBetween: 10,
          slidesPerView: responsiveChange(),
          navigation: true,
          autoplay: {
            delay: 6000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          }
        }}
      >
        {loading ?
          new Array(responsiveChange()).fill(0).map(() => (
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
  )
}

export default function ThemeCatalog ({ popularDatalakeDatasets, themes }) {
  const [recentDataSets, setRecentDataSets] = useState([])
  const [listThemes, setListThemes] = useState([])
  const [selectedTheme, setSelectedTheme] = useState([])
  const [loading, setLoading] = useState(false)
  
  const mobileQuery = useCheckMobile()
  const [baseQuery] = useMediaQuery("(max-width: 938px)")
  const [lgQuery] = useMediaQuery("(max-width: 1366px)") 

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
      gap="50px"
    >
      <Themes
        listThemes={listThemes}
        selectedTheme={selectedTheme}
        onSelectTheme={handleSelectTheme}
        responsive={{mobileQuery, baseQuery, lgQuery}}
      />

      <CardThemes
        responsive={{mobileQuery, baseQuery, lgQuery}}
        recentDataSets={recentDataSets}
        loading={loading}
      />
    </VStack>
  )
}
