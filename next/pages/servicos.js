import { Image } from "@chakra-ui/image";
import { VStack } from "@chakra-ui/layout";
import BigTitle from "../components/atoms/BigTitle";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import SectionText from "../components/atoms/SectionText";
import { KnowOurServices } from "../components/molecules/KnowOurServices";
import { NamedAvatar } from "../components/molecules/NamedAvatar";
import { MainPageTemplate } from "../components/templates/main";
import { withStrapiPages } from "../hooks/strapi.hook";

export async function getStaticProps(context) {
  return await withStrapiPages();
}

export default function Services({ strapiPages }) {
  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <VStack width="100%">
        <KnowOurServices paddingBottom="50px" />
        <Link href="/blog/1/">
          <RoundedButton height="40px" fontSize="14px" minWidth="190px">
            Entre em contato
          </RoundedButton>
        </Link>
        <BigTitle paddingTop="50px" textAlign="center" paddingBottom="20px">
          Depoimentos
        </BigTitle>
        <VStack width="50%" maxW="600px">
          <Image
            width="60px"
            paddingBottom="15px"
            alignSelf="flex-start"
            src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/%E2%80%9C.png"
          />
          <SectionText lineHeight="35px">
            Com o apoio da Base dos Dados realizamos o levantamento das
            desigualdades de gênero e raça nas eleições 2016-2020 e das
            distorções de financiamento de campanhas de prefeitas e vereadoras
            nas últimas eleições, o que resultará no lançamento de uma
            publicação inédita.
          </SectionText>
          <NamedAvatar
            paddingBottom="50px"
            alignSelf="flex-end"
            name="Marina Barros"
            position="Instituto Alziras"
          />
        </VStack>
      </VStack>
    </MainPageTemplate>
  );
}
