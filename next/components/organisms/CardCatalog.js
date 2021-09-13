import React from "react";
import { Heading } from "@chakra-ui/react";
import { VStack, HStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { slidesToShowPlugin } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import BigTitle from "../atoms/BigTitle";
import SectionText from "../atoms/SectionText";

const Carousel = dynamic(() => import("@brainhubeu/react-carousel"), {
  ssr: false,
});

export default function CardCatalog({ title, text, children, containerStyle }) {
  const isMobile = useCheckMobile();

  return (
    <VStack
      {...containerStyle}
      alignItems="flex-start"
      position="relative"
      width="100%"
      alignSelf="center"
    >
      <BigTitle textAlign="center" marginBottom="0px" alignSelf="center">
        {title}
      </BigTitle>
      <SectionText
        fontSize="17px"
        alignSelf="center"
        letterSpacing="0.05em"
        fontWeight="500"
        paddingBottom="20px"
      >
        {text}
      </SectionText>
      <VStack
        width="100%"
        alignItems="flex-start"
        spacing={5}
        paddingBottom="40px"
      ></VStack>
      <VStack
        width="100%"
        alignItems="flex-start"
        spacing={5}
        paddingBottom="40px"
        position="relative"
      >
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
          {children}
        </Carousel>
      </VStack>
    </VStack>
  );
}
