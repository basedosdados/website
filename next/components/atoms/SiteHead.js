import Head from "next/head";

export default function SiteHead({ children }) {
  return (
    <Head>
      <meta name="theme-color" content="#34A15A" />
      <meta name="description" content="Base dos Dados" />
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat:400,700"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Lato:300,400,500,700"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700"
        rel="stylesheet"
      />
      <link href="/vendor/terminal.css" rel="stylesheet" />
      <script
        charset="utf-8"
        type="text/javascript"
        src="https://js.hsforms.net/forms/shell.js"
      ></script>
      {children}
    </Head>
  );
}
