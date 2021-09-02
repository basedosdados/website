import React from "react";
import { Heading } from "@chakra-ui/react";
import { VStack, HStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { slidesToShowPlugin } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

const Carousel = dynamic(() => import("@brainhubeu/react-carousel"), {
  ssr: false,
});

export default function CardCatalog({ sections, containerStyle }) {
  const isMobile = useCheckMobile();

  return (
    <VStack
      {...containerStyle}
      alignItems="flex-start"
      position="relative"
      width="100%"
    >
      {Object.keys(sections).map((key) => (
        <VStack
          width="100%"
          alignItems="flex-start"
          spacing={5}
          paddingBottom="40px"
        >
          <Heading
            fontSize="16px"
            backgroundColor="#2B8C4D"
            borderRadius="15px"
            color="white"
            fontWeight="500"
            fontFamily="Ubuntu"
            letterSpacing="0.1em"
            padding="10px 15px"
            marginLeft="6%"
          >
            + {key}
          </Heading>
          <Carousel
            plugins={[
              "infinite",
              "arrows",
              "fastSwipe",
              {
                resolve: slidesToShowPlugin,
                options: {
                  numberOfSlides: isMobile ? 1 : 4,
                },
              },
            ]}
          >
            {sections[key]}
          </Carousel>
        </VStack>
      ))}
    </VStack>
  );
}
