import "../styles/globals.scss";

import { useEffect } from "react";
import type { AppProps } from "next/app";

import Head from "next/head";
import { ThemeProvider } from "@contexts";

const AskMedApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Ask Med</title>
        <link rel="icon" type="image/x-icon" href="/logo.svg" />
      </Head>

      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default AskMedApp;
