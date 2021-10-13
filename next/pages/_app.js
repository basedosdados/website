import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";

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
          href="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_geral.png"
        />
        <title>Base dos Dados</title>
        <meta
          property="description"
          content="Baixe dados já limpos, integrados e atualizados de forma extremamente fácil através do nosso datalake público."
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
          content="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_geral.png"
          key="twimage"
        />

        {/* Open Graph */}
        <meta
          property="og:image"
          content="https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_geral.png"
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
          content="Baixe dados já limpos, integrados e atualizados de forma extremamente fácil através do nosso datalake público."
          key="ogdesc"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-203687587-1%22%3E"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());

            gtag("config", "UA-203687587-1");`,
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
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
