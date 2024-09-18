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
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();
  const { t } = useTranslation('common');

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <VStack width="80%" margin="auto">
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
            {t('partners.partnershipsWith')}
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
                name={t('partners.testimonials.fernando.name')}
                position={t('partners.testimonials.fernando.position')}
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/tesouro_nacional.png"
              >
                {t('partners.testimonials.fernando.quote')}
              </Testimonial>

              <Testimonial
                name={t('partners.testimonials.marina.name')}
                position={t('partners.testimonials.marina.position')}
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/alziras.png"
              >
                {t('partners.testimonials.marina.quote')}
              </Testimonial>

              <Testimonial
                name={t('partners.testimonials.amanda.name')}
                position={t('partners.testimonials.amanda.position')}
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/aponte.png"
              >
                {t('partners.testimonials.amanda.quote')}
              </Testimonial>
          </Carousel>
        </Center>
      }
    </VStack>
  );
}
