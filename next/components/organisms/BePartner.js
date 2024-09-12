import {
  Stack,
  VStack,
  Text,
  Center,
  Box,
  Image
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NamedAvatar } from "../molecules/NamedAvatar";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Carousel from "../atoms/Carousel";
import { useTranslation } from 'next-i18next';

function Testimonial({ children, name, position, src }) {
  const { t } = useTranslation();
  return (
    <VStack
      margin={{ base: "0px", lg: "80px 32px 32px" }}
      width="80%"
    >
      <Stack
        alignItems="center"
      >
        <Image
          alt="aspas"
          width="50px"
          height="36px"
          src="https://storage.googleapis.com/basedosdados-website/images/quote.png"
        />
      </Stack>
      <Text
        margin="32px 16px 48px !important"
        fontFamily="Ubuntu"
        fontSize="28px"
        fontWeight="300"
        letterSpacing="-0.1px"
        textAlign="center"
        lineHeight="45px"
        color="#252A32"
      >
        {children}
      </Text>
      <NamedAvatar
        alignSelf="flex-end"
        name={name}
        position={position}
        src={src}
      />
    </VStack>
  );
}

function PartnerBox({ src, ...props }) {
  return (
    <Stack
      width="100%"
      height="100%"
      minWidth="100px"
      minHeight="100px"
      maxWidth="100px"
      maxHeight="100px"
      align="center"
      justify="center"
      padding="0px"
      filter="grayscale(100%)"
    >
      <Image
        width="100%"
        height="100%"
        objectFit="contain"
        src={src}
        {...props}
      />
    </Stack>
  );
}

export function BePartner() {
  const { t } = useTranslation();
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <VStack width="80%" margin="auto">
      {/* <BigTitle>{t("How we impact people and organizations")}</BigTitle> */}
      <Stack
        width="100%"
        maxWidth="1264px"
        justifyContent="space-between"
        marginTop="40px"
        direction="column"
        spacing={10}
      >
        <Center width="100%">
          <Text
            zIndex={2}
            fontFamily="Ubuntu"
            fontSize={isMobileMod ? "16px" : "18px"}
            fontWeight="300"
            letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
            color="#7D7D7D"
          >
            {t("Partnerships with")}
          </Text>
        </Center>
        <Stack
          direction="row"
          width="100%"
          maxWidth="1264px"
          spacing={0}
          gridGap="30px"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <PartnerBox alt="tesouro nacional" src="https://storage.googleapis.com/basedosdados-website/logos/2022/tesouro_nacional.png" />
          <PartnerBox alt="ipea" src="https://storage.googleapis.com/basedosdados-website/logos/2022/ipea.png" />
          <PartnerBox alt="alziras" src="https://storage.googleapis.com/basedosdados-website/logos/2022/alziras.png" />
          <PartnerBox alt="fiquem sabendo" src="https://storage.googleapis.com/basedosdados-website/logos/2022/fiquem_sabendo.png" />
          <PartnerBox alt="bg lemann" src="https://storage.googleapis.com/basedosdados-website/logos/2022/bg__lemann.png" />
          <PartnerBox alt="rio" src="https://storage.googleapis.com/basedosdados-website/logos/2022/rio.png" />
          <PartnerBox alt="governosp" src="https://storage.googleapis.com/basedosdados-website/logos/2022/governosp.png" />
          <PartnerBox alt="aponte" src="https://storage.googleapis.com/basedosdados-website/logos/2022/aponte.png" />
        </Stack>
      </Stack>
      {!isMobile &&
        <Center 
          width="100%"
          maxWidth="1264px" 
        >
          <Carousel
            settings={{
              loop: true,
              autoplay: true,
              pagination: {
                clickable: true,
              }
            }}
          >
              <Testimonial
                name="Fernando Barbalho"
                position={t("Data Scientist at National Treasury")}
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/tesouro_nacional.png"
              >
                {t("The siconfiBD is a package that quickly and programmatically brings data from the National Treasury Secretariat. The code is built in an open-source manner by the Treasury team and uses the treated BD+ tables to compose functions in R. What is the personnel expense of the 100 most populous Brazilian municipalities? These and more than 18 other questions can be consulted directly by the package, without the need for SQL.")}
              </Testimonial>

              <Testimonial
                name="Marina Barros"
                position={t("Executive Director of the Alziras Institute")}
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/alziras.png"
              >
                {t("With the support of Base dos Dados, we conducted a survey of gender and race inequalities in the 2016-2020 elections and the distortions in campaign financing for mayors and councilors in the last elections, which will result in the launch of an unprecedented publication.")}
              </Testimonial>

              <Testimonial
                name="Amanda de Albuquerque e Mariana Carvalho"
                position={t("Co-founders of A Ponte")}
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/aponte.png"
              >
                {t("We created an important product of ours, the Municipality Photography, in partnership with BD. The Photography aggregates various socioeconomic indicators of Brazilian municipalities. A Ponte did the planning and design of the report, while BD took care of the technical part of visualization and data management. The partnership was what allowed us to advance quickly in the development of the tool, and ensured the high data quality we wanted from the beginning.")}
              </Testimonial>
          </Carousel>
        </Center>
      }
    </VStack>
  );
}
