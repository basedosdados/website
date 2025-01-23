import {
  Stack,
  VStack,
  HStack,
  Text,
  Center,
  Image,
  Avatar
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";
import Carousel from "../atoms/Carousel";

function Testimonial({ children, name, position, src }) {
  return (
    <VStack
      margin="100px 24px 30px"
      width="800px"
      minHeight="482px"
      boxSizing="border-box"
      spacing={0}
    >
      <Text
        as="span"
        position="absolute"
        top="-14px"
        height="0"
        pointerEvents="none"
        userSelect="none"
        fontFamily="Roboto"
        fontSize="100px"
        color="#464A51"
      >
        “
      </Text>
      <TitleText
        typography="large"
        color="#464A51"
        textAlign="center"
        marginBottom="72px !important"
        height="100%"
      >
        {children}
      </TitleText>

      <HStack width="100%" spacing="10px" justifyContent="end">
        <VStack spacing={0} align="flex-end">
          <LabelText
            textAlign="right"
            color="#464A51"
          >
            {name}
          </LabelText>
          <BodyText
            textAlign="right"
            color="#464A51"
          >
            {position}
          </BodyText>
        </VStack>
        <Avatar
          name=""
          backgroundColor="#FFF"
          height="75px"
          src={src} 
        />
      </HStack>
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
  const { t } = useTranslation('common');

  return (
    <VStack margin="auto" spacing="0">
      <Stack
        width="100%"
        maxWidth="1440px"
        justifyContent="space-between"
        marginTop="64px"
        direction="column"
        spacing="24px"
      >
        <LabelText
          typography="large"
          zIndex={2}
          textAlign="center"
          color="#71757A"
        >
          {t('partners.partnershipsWith')}
        </LabelText>

        <Stack
          direction="row"
          width="100%"
          maxWidth="1440px"
          spacing={0}
          gap="40px"
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

      <Center
        display={{base : "none", lg: "flex"}}
        width="100%"
        maxWidth="1440px" 
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
    </VStack>
  );
}
