import {
  Stack,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import LabelText from "../../atoms/Text/LabelText";

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
        loading="lazy"
        src={src}
        {...props}
      />
    </Stack>
  );
}

export function BePartner() {
  const { t } = useTranslation("home");

  const partners = [
    { alt: "tesouro nacional", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/tesouro_nacional.png"},
    { alt: "ipea", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/ipea.png"},
    { alt: "alziras", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/alziras.png"},
    { alt: "fiquem sabendo", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/fiquem_sabendo.png"},
    { alt: "bg lemann", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/bg__lemann.png"},
    { alt: "rio", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/rio.png"},
    { alt: "governosp", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/governosp.png"},
    { alt: "aponte", src: "https://storage.googleapis.com/basedosdados-website/logos/2022/aponte.png"}
  ];

  return (
    <VStack margin="auto" spacing="0">
      <Stack
        width="100%"
        maxWidth="1440px"
        justifyContent="space-between"
        direction="column"
        spacing="24px"
      >
        <LabelText
          as="h3"
          typography="x-large"
          zIndex={2}
          textAlign="center"
          fontWeight="400"
          color="#464A51"
        >
          {t("partners.partnershipsWith")}
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
          {partners.map((p) => (
            <PartnerBox key={p.alt} alt={p.alt} src={p.src} />
          ))}
        </Stack>
      </Stack>
    </VStack>
  );
}
