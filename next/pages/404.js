import {
  Text,
  Center
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router"
import FourOrFourTemplate from "../components/templates/404";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../components/templates/main";
import { ControlledInputSimple } from "../components/atoms/ControlledInput";
import { useTranslation } from 'next-i18next';
import { triggerGAEvent } from "../utils";
import Link from "../components/atoms/Link";
import SearchIcon from "../public/img/icons/searchIcon";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu',])),
    },
  };
}

export default function FourOFour() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  function openSearchLink() {
    if(search.trim() === "") return
    triggerGAEvent("search", search.trim())
    triggerGAEvent("search_four0four", search.trim())
    router.push(`/search?q=${search.trim()}`);
  }

  return (
    <MainPageTemplate>
      <FourOrFourTemplate 
        alignItems={{base: "flex-end", lg: "center"}}
        marginTop={{base: "120px", md: "0"}}
        padding="80px 24px"
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="50px"
          lineHeight="60px"
          color="#252A32"
          marginBottom="24px"
        >{t('error.ops')}</Text>
        <Center flexDirection="column" marginBottom="24px" gap="8px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="28px"
            lineHeight="42px"
            color="#252A32"
          >{t('error.notFoundPage')}</Text>
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="18px"
            lineHeight="26px"
            color="#252A32"
          >{t('error.searchNewBases')}</Text>
        </Center>

        <ControlledInputSimple
          value={search}
          onChange={setSearch}
          onEnterPress={openSearchLink}
          inputFocus={inputFocus}
          changeInputFocus={setInputFocus}
          placeholder={t('error.searchData')}
          fill="#464A51"
          icon={
            <Link
              href={`/search?q=${search.trim()}`}
              onClick={(e) => {
                e.preventDefault();
                openSearchLink();
              }}
            >
              <SearchIcon
                alt="pesquisar"
                width="16.8px"
                height="16.8px"
                cursor="pointer"
              />
            </Link>
          }
        />
      </FourOrFourTemplate>
    </MainPageTemplate>
  )
}