import React from "react";
import { VStack } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { slidesToShowPlugin, slidesToScrollPlugin, autoplayPlugin } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

const Carousel = dynamic(
  () => import('@brainhubeu/react-carousel'),
  { ssr: false },
 )

export default function ThemeCatalog ({ children }) {
  
  return (
    <VStack
      width="100%"
      alignItems="center"
    >
      <Carousel
        itemWidth="100px"
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
        {children}
      </Carousel>
    </VStack>
  )
}