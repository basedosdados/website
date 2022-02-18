import React, { useState, useEffect } from "react";
import { VStack, Center } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { slidesToShowPlugin, slidesToScrollPlugin, autoplayPlugin } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

const Carousel = dynamic(
  () => import('@brainhubeu/react-carousel'),
  { ssr: false },
 )

const themes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]

function Themes () {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)

  useEffect(() => {
    setIsMobileMod(isMobile)
  },[isMobile])

  return (
    <Carousel
      itemWidth={ isMobileMod ? "50px" : "100px" }
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
      {themes.map((elm) => (
        <Center
          cursor="pointer"
          width={ isMobileMod ? "50px" : "100px" }
          minWidth={ isMobileMod ? "50px" : "100px" }
          height={ isMobileMod ? "50px" : "100px" }
          minHeight={ isMobileMod ? "50px" : "100px" }
          borderRadius="14px"
          backgroundColor="#FFF"
          boxShadow="0px 1px 6px rgba(0, 0, 0, 0.25)"
          _hover={{ transform:"scale(1.1)", backgroundColor:"#2B8C4D" }}
          transition="all 0.5s" 
          margin="10px 0"
        >
          {elm}
        </Center>
      ))}
    </Carousel>
  )
}


function CardThemes ({ Children }) {

  return (
    <VStack
      width="100%"
      padding="60px 00px"
      alignItems="flex-start"
      spacing={5}
      paddingTop="75px"
      paddingBottom="160px"
      position="relative"
    >
      <Carousel>
        {Children}
      </Carousel>
    </VStack>
  )
}


export default function ThemeCatalog () {
  return (
    <VStack
      width="100%"
      alignItems="center"
      gap="50px"
    >
      <Themes/>
    </VStack>
  )
}