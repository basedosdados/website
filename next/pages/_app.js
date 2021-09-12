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
          href="https://i.ibb.co/nD79bG7/thumbnail-conjunto.png"
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
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content="Base dos Dados" key="twhandle" />

        {/* Open Graph */}
        <meta
          property="og:image"
          content="https://i.ibb.co/nD79bG7/thumbnail-conjunto.png"
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
        <meta property="og:image:width" content="1201" />
        <meta property="og:image:height" content="601" />
      </Head>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
