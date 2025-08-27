import {
  Stack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import Display from "../../atoms/Text/Display";

export default function SocioeconomicData() {
  const { t } = useTranslation("home");

  const data = [
    { alt: "ibge", src: "https://storage.googleapis.com/basedosdados-website/logos/ibge.png"},
    { alt: "receita federal", src: "https://storage.googleapis.com/basedosdados-website/logos/receita-federal.png"},
    { alt: "tse", src: "https://storage.googleapis.com/basedosdados-website/logos/tse.png"},
    { alt: "cgu", src: "https://storage.googleapis.com/basedosdados-website/logos/cgu.png"},
    { alt: "inep", src: "https://storage.googleapis.com/basedosdados-website/logos/inep.png"}
  ];

  return (
    <Stack
      width="100%"
      maxWidth="1440px"
      justifyContent="center"
      flexDirection="column"
      padding="120px 24px 40px"
      spacing={0}
      margin="0 auto"
    >
      <Display
        as="h3"
        typography={isMobileMod() ? "small" : "large"}
        padding="40px 0"
        width="100%"
        maxWidth="800px"
        textAlign="center"
        margin="0 auto"
      >
        {t("socioeconomic_data")}
      </Display>
      <HStack
        spacing={0}
        gap="16px 29px"
        flexWrap="wrap"
        justifyContent="center"
      >
        {data.map((d) => (
          <Image
            key={d.alt}
            alt={d.alt}
            src={d.src}
            width="100px"
            height="100px"
            objectFit="contain"
            loading="lazy"
          />
        ))}
      </HStack>
    </Stack>
  )
}