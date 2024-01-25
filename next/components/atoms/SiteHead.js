import Head from "next/head";

export default function SiteHead({ children }) {
  return (
    <Head>
      <meta name="theme-color" content="#34A15A" />
      <meta name="description" content="Base dos Dados" />

      {children}
    </Head>
  );
}
