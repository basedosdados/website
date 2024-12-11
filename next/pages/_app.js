import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import "../styles/globals.css";
import { useTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('app');
  const queryClient = new QueryClient({
    cacheTime: 0,
  });

  const local = process.env.NEXT_PUBLIC_BASE_URL_FRONTEND

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        {/* <meta/> para não noindex ambientes de development e staging */}
        {local === "https://basedosdados.org" ? null: (
          <meta name="robots" content="noindex" />
        )}
        {/* <meta/> para não noindex ambientes de development e staging */}
        {locale === 'en' ?
          <link rel="icon" type="image/ico" href="/favicon_en.ico"/>
          :
          <link rel="icon" type="image/ico" href="/favicon_default.ico"/>
        }
        <link
          rel="image_src"
          href={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/general.png`}
        />

        <title>{locale === 'en' ? 'Data Basis' : locale === 'es' ? 'Base de los Datos' : 'Base dos Dados'}</title>
        <meta
          property="description"
          content={
            locale === 'en' ? 'Hundreds of open datasets for you to explore however you like. Download or access processed data ready for analysis using SQL, Python, R, or Stata.' : 
            locale === 'es' ? 'Cientos de conjuntos de datos abiertos para que explores como quieras. Descarga o accede a datos procesados y listos para análisis usando SQL, Python, R y Stata.' : 
            'Centenas de conjuntos de dados abertos para você explorar como quiser. Baixe ou acesse dados tratados e prontos para análise usando SQL, Python, R ou Stata.'
          }
        />
        <script
          defer
          src="https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js"
        ></script>

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@basedosdados" />
        <meta name="twitter:creator" content="@basedosdados" />
        <meta
          name="twitter:image"
          content={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/general.png`}
          key="twimage"
        />

        {/* Open Graph */}
        <meta
          property="og:image"
          content={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/general.png`}
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content={t('siteName')}
          key="ogsitename"
        />
        <meta property="og:title" content={t('title')} key="ogtitle" />
        <meta
          property="og:description"
          content={t('description')}
          key="ogdesc"
        />

        {/* <!-- Google Tag Manager --> */}
        {local === "https://staging.basedosdados.org" || local === "https://basedosdados.org" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5NWMN98');`,
            }}
          ></script>
        ) : null}
        {/* <!-- End Google Tag Manager --> */}

        {/* TAG GTM DEVELOPMENT */}
        {/* <!-- Google Tag Manager --> */}
        {local === "https://development.basedosdados.org" &&
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=JqCpoVwQlMgubUGPVq7Z9g&gtm_preview=env-10&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5NWMN98');`,
            }}
          ></script>
        }
        {/* <!-- End Google Tag Manager --> */}
        {/* FIM DA TAG DEVELOPMENT */}
      </Head>

      <ChakraProvider>
        <Component {...pageProps} locale={locale} />
      </ChakraProvider>

      {/*<!-- Google Tag Manager (noscript) -->*/}
      {local === "https://staging.basedosdados.org" || local === "https://basedosdados.org" ? (
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5NWMN98"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      ) : null}
      {/*<!-- End Google Tag Manager (noscript) -->*/}

      {/* TAG GTM DEVELOPMENT  */}
      {/* <!-- Google Tag Manager (noscript) --> */}
      {local === "https://development.basedosdados.org" &&
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5NWMN98&gtm_auth=JqCpoVwQlMgubUGPVq7Z9g&gtm_preview=env-10&gtm_cookies_win=x"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      }
      {/* <!-- End Google Tag Manager (noscript) --> */}
      {/* FIM DA TAG DEVELOPMENT */}

    </QueryClientProvider >
  );
}

export default appWithTranslation(MyApp);
