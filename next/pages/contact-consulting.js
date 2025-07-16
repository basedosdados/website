import {
    Box,
    Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  const pages = await withPages();
  return {
    ...pages,
    props: {
      ...pages.props,
      ...(await serverSideTranslations(locale, ['common', 'menu', 'contact'])),
    },
  };
}

export default function ContactConsulting() {
  const { t } = useTranslation('contact');
  const { locale } = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    script.src='https://js.hsforms.net/forms/embed/v2.js';
    document.body.appendChild(script);

    script.addEventListener('load', () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "9331013",
          formId:
            locale === "en" ? "a81d259d-7c97-494d-866d-639416f70df2" :
            locale === "es" ? "3e1063fa-f29e-4044-9f71-37e6e0cdf678" :
            "1b1d4a12-5cbc-4ffc-837a-12b905c2d87b",
          target: '#form-hbspt',
          onFormSubmit: function($form) {
            window.dataLayer.push({
              'event': 'contact_consulting_form_submit',
              'formId': $form.attr('data-form-id'),
              'formLocale': locale
            });
          }
        })
      }
    })
  }, [locale])
    
  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{t('consulting.title')}</title>
        <meta
          property="og:title"
          content={t('consulting.title')}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={t('consulting.description')}
          key="ogdesc"
        />
      </Head>

      <Stack
        width="100%"
        maxWidth="1440px"
        alignItems="center"
        margin="0 auto"
      >
        <Box 
          width="100%"
          minWidth={{base:"100%", lg: "800px"}} 
          maxWidth="500px"
          height="100%" 
          id="form-hbspt"
          boxShadow="none !important"
        />
      </Stack>
    </MainPageTemplate>
  )
}
