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
    </VStack>
  );
}
