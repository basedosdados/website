import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import themeBD from "../styles/themeBD";
import "../styles/globals.css";
import "../styles/fonts.css";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient({
    cacheTime: 0,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="icon" type="image/ico" href="/favicon.ico" />
        <link
          rel="image_src"
          href="https://storage.googleapis.com/basedosdados-website/thumbnails/2022/thumbnail_padrao.png"
        />

        <title>Base dos Dados</title>
        <meta
          property="description"
          content="São centenas de conjuntos de dados abertos para você explorar como quiser. Baixe ou acesse dados tratados e prontos para análise usando SQL, Python, R ou Stata."
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
          content="https://storage.googleapis.com/basedosdados-website/thumbnails/2022/thumbnail_padrao.png"
          key="twimage"
        />

        {/* Open Graph */}
        <meta
          property="og:image"
          content="https://storage.googleapis.com/basedosdados-website/thumbnails/2022/thumbnail_padrao.png"
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content="Base dos Dados"
          key="ogsitename"
        />
        <meta property="og:title" content="Base dos Dados" key="ogtitle" />
        <meta
          property="og:description"
          content="São centenas de conjuntos de dados abertos para você explorar como quiser. Baixe ou acesse dados tratados e prontos para análise usando SQL, Python, R ou Stata."
          key="ogdesc"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-8WFE4K8RZX"
        ></script>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GTM-5NWMN98"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KC6ZJFF');`,
          }}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:2636848,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        ></script>
      </Head>
      <ChakraProvider theme={themeBD}>
        <Component {...pageProps} />
      </ChakraProvider>
      {/*<!-- Google Tag Manager (noscript) -->*/}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-KC6ZJFF"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>
      {/*<!-- End Google Tag Manager (noscript) -->*/}
    </QueryClientProvider>
  );
}

export default MyApp;
