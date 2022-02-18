import React, { useState, useEffect } from "react";
import { VStack, Center, Image } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { slidesToShowPlugin, slidesToScrollPlugin, autoplayPlugin } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { getGroupList } from "../../pages/api/groups"
import { getRecentDatalakeDatasets } from "../../pages/api/datasets";
import DatabaseCard from "./DatabaseCard";

const Carousel = dynamic(
  () => import('@brainhubeu/react-carousel'),
  { ssr: false },
)

function Themes ({ isMobileMod }) {
  const [listThemes, setListThemes] = useState([])

  useEffect(() => {
    getGroupList().then(res => {
      setListThemes(res.data.result)
    })
  },[])

  return (
    <Carousel
      itemWidth={ isMobileMod ? "45px" : "90px" }
      offset={20}
      animationSpeed={1000}
      plugins={[
        'arrows',
        'infinite',
        {
          resolve: slidesToShowPlugin,
          options: {
            numberOfSlides: 22
          }
        },
        {
          resolve: slidesToScrollPlugin,
          options: {
            numberOfSlides: 10,
          },
        },
        {
          resolve: autoplayPlugin,
          options: {
            interval: 5000,
          }
        }
      ]}
    >
      {listThemes && listThemes.map((elm) => (
        <Center
          key={elm.id}
          cursor="pointer"
          width={ isMobileMod ? "45px" : "90px" }
          minWidth={ isMobileMod ? "45px" : "90px" }
          height={ isMobileMod ? "45px" : "90px" }
          minHeight={ isMobileMod ? "45px" : "90px" }
          borderRadius="14px"
          backgroundColor="#FFF"
          boxShadow="0px 1px 6px rgba(0, 0, 0, 0.25)"
          _hover={{ transform:"scale(1.1)", backgroundColor:"#2B8C4D" }}
          transition="all 0.5s" 
          margin="10px 0"
        >
          <Image
            width="100%"
            height="100%"
            alt={`${elm.name}`}
            src={`https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/icone_${elm.name}.svg`} 
          >
          </Image>
        </Center>
      ))}
    </Carousel>
  )
}


function CardThemes ({ isMobileMod }) {
  const [recentThemes, setRecentThemes] = useState([])

  useEffect(() => {
    try {
      getRecentDatalakeDatasets().then(res => {
        setRecentThemes(res)
      })
    } catch {
      setRecentThemes('')
    }
  },[])

  recentThemes ? console.log(recentThemes) : ''

  return (
    <VStack
      width="100%"
      minWidth="280px"
      alignItems="flex-start"
      padding="25px 0"
      margin="50px 0 !important"
      borderRadius="15px"
      position="relative"
      backgroundColor="#fbfbfb"
    >
      <Carousel
        itemWidth={ isMobileMod ? "150px" : "300px"}
        offset={20}
        animationSpeed={1000}
        plugins={[
          'arrows',
          'infinite',
          {
            resolve: slidesToShowPlugin,
            options: {
              numberOfSlides: 5
            }
          },
          {
            resolve: autoplayPlugin,
            options: {
              interval: 8000,
            }
          }
        ]}
      >
        {recentThemes && recentThemes.map((elm) => (
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
              elm.resources.filter((r) => r.resource_type === "external_link")
                .length
            }
            updatedSince={elm.metadata_modified}
            categories={elm.groups.map((g) => g.name)}
          />
          ))}
      </Carousel>
    </VStack>
  )
}


export default function ThemeCatalog () {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();
  
  useEffect(() => {
    setIsMobileMod(isMobile)
  },[isMobile])

  return (
    <VStack
      width="100%"
      alignItems="center"
      gap="50px"
    >
      <Themes isMobileMod={isMobileMod} />
      <CardThemes isMobileMod={isMobileMod} />
    </VStack>
  )
}