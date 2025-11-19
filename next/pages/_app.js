import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 15 * 60 * 1000, // 15 minutos
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { locale } = router;

  const local = process.env.NEXT_PUBLIC_BASE_URL_FRONTEND

  const metaData = {
    en: {
      title: 'Data Basis',
      description: 'Hundreds of open datasets for you to explore however you like. Download or access processed data ready for analysis using SQL, Python, R, or Stata.',
      icon: '/favicon_en.ico',
      siteName: 'Data Basis',
      ogTitle: 'Data Basis - Open Datasets',
      ogDescription: 'Explore hundreds of open datasets ready for analysis'
    },
    es: {
      title: 'Base de los Datos',
      description: 'Cientos de conjuntos de datos abiertos para que explores como quieras. Descarga o accede a datos procesados y listos para análisis usando SQL, Python, R y Stata.',
      icon: '/favicon_default.ico',
      siteName: 'Base de los Datos',
      ogTitle: 'Base de los Datos - Conjuntos de datos abiertos',
      ogDescription: 'Explora cientos de conjuntos de datos listos para análisis'
    },
    pt: {
      title: 'Base dos Dados',
      description: 'Centenas de conjuntos de dados abertos para você explorar como quiser. Baixe ou acesse dados tratados e prontos para análise usando SQL, Python, R ou Stata.',
      icon: '/favicon_default.ico',
      siteName: 'Base dos Dados',
      ogTitle: 'Base dos Dados - Conjuntos de dados abertos',
      ogDescription: 'Explore centenas de conjuntos de dados prontos para análise'
    }
  };

  const currentMeta = metaData[locale] || metaData.pt;

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        {/* <meta/> para não noindex ambientes de development e staging */}
        {local === "https://basedosdados.org" ? null: (
          <meta name="robots" content="noindex" />
        )}
        {/* <meta/> para não noindex ambientes de development e staging */}

        <link
          rel="image_src"
          href={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/general.png`}
        />

        <title>{currentMeta.title}</title>
        <meta name="description" content={currentMeta.description} />
        <link rel="icon" href={currentMeta.icon} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={local} />
        <meta property="twitter:title" content={currentMeta.ogTitle} />
        <meta property="twitter:description" content={currentMeta.ogDescription} />
        <meta property="twitter:image" content={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/general.png`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={local} />
        <meta property="og:title" content={currentMeta.ogTitle} />
        <meta property="og:description" content={currentMeta.ogDescription} />
        <meta property="og:image" content={`https://storage.googleapis.com/basedosdados-website/thumbnails/${locale}/general.png`} />
        <meta property="og:site_name" content={currentMeta.siteName} />

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
        {/* {local === "https://development.basedosdados.org" && */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=JqCpoVwQlMgubUGPVq7Z9g&gtm_preview=env-10&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5NWMN98');`,
            }}
          ></script>
        {/* } */}
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
      {/* {local === "https://development.basedosdados.org" && */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5NWMN98&gtm_auth=JqCpoVwQlMgubUGPVq7Z9g&gtm_preview=env-10&gtm_cookies_win=x"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
      {/* } */}
      {/* <!-- End Google Tag Manager (noscript) --> */}
      {/* FIM DA TAG DEVELOPMENT */}

    </QueryClientProvider >
  );
}

export default appWithTranslation(MyApp);
