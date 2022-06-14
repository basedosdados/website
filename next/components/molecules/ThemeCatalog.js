import {
  VStack,
  Center,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { getRecentDatalakeDatasetsByTheme } from "../../pages/api/datasets";
import DatabaseCard from "../organisms/DatabaseCard";
import Carousel from "../atoms/Carousel";
import { SwiperSlide } from "swiper/react";

function Themes ({ isMobileMod, newRecentDataLakeDataSets, listThemes=[] }) {
  const [selectedTheme, setSelectedTheme] = useState()

  const searchTheme = (elm) => {
    window.open("#theme", "_self")
    setSelectedTheme(elm.name)
    newRecentDataLakeDataSets({
      name: elm.name,
    })
  }

  if(listThemes.length === 0)
    return null

  return (
    <Center
      width="95vw"
      // width="100%" 
      maxWidth="1364px"
    >
      <Carousel 
        settings={{
          spaceBetween: 10,
          slidesPerView: isMobileMod ? 5 :10,
          navigation: !isMobileMod && true,
          loop: true,
          autoplay: true,
        }}
      >
        {listThemes && listThemes.map((elm) => (
          <SwiperSlide>
            <Center
              onClick={() => searchTheme(elm)}
              key={elm.id}
              cursor="pointer"
              width={ isMobileMod ? "45px" : "100px" }
              minWidth={ isMobileMod ? "45px" : "100px" }
              height={ isMobileMod ? "45px" : "100px" }
              minHeight={ isMobileMod ? "45px" : "100px" }
              borderRadius={ isMobileMod ? "8px" : "16px" }
              backgroundColor={ selectedTheme === elm.name ? "#2B8C4D" : "FFF"}
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
                  padding={ isMobileMod ? "5px" : "10px"}
                  height="100%"
                  transition="all 0.5s"
                  filter={selectedTheme === elm.name ? "invert(1)" :"invert(0.8)"}
                  _hover={{ filter:"invert(1)"}}
                  alt={`${elm.name}`}
                  src={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/2022/icone_${elm.name}.svg`}
                />
              </Tooltip>
            </Center>
          </SwiperSlide>
        ))}
      </Carousel>
    </Center>
  )
}


function CardThemes ({ isMobileMod, recentThemes }) {

  return (
    // <VStack
    //   width="90vw"
    //   minWidth="370px"
    //   maxWidth="1284px"
    //   alignItems="flex-start"
    //   padding="24px 0"
    //   margin="48px 0 !important"
    //   position="relative"
    // >
    <Center
      width="95vw"
      // width="100%"
      maxWidth="1364px"
      marginY="48px !important"
    >
      <Carousel 
        settings={{
          spaceBetween: 10,
          slidesPerView: isMobileMod ? 1 : 4,
          navigation: true,
          loop: true,
          autoplay: false,
        }}
      >
        {recentThemes && recentThemes.map((elm) => (
          <SwiperSlide>
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
          </SwiperSlide>
        ))}
      </Carousel>
    </Center>
    // </VStack>
  )
}

export default function ThemeCatalog ({ recentDatalakeDatasets, themes }) {
  const [recentThemes, setRecentThemes] = useState([])
  const [listThemes, setListThemes] = useState([])
  const isMobile = useCheckMobile()

  useEffect(() => {
    setListThemes(themes)
    recentDatalakeDatasets ? setRecentThemes(recentDatalakeDatasets) : setRecentThemes()
  },[recentDatalakeDatasets, themes])

  const newRecentDataLake = (elm) => {
    return getRecentDatalakeDatasetsByTheme(elm.name)
      .then(res => {
        setRecentThemes(res)
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
        newRecentDataLakeDataSets={newRecentDataLake}
        isMobileMod={isMobile}
      />

      <CardThemes
        isMobileMod={isMobile}
        recentThemes={recentThemes}
      />
    </VStack>
  )
}
