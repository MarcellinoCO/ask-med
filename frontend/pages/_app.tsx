import "../styles/globals.css";

import { useEffect } from "react";
import type { AppProps } from "next/app";

import { themeChange } from "theme-change";
import Head from "next/head";

const AskMedApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <>
      <Head>
        <title>Ask Med</title>
        <link rel="icon" type="image/x-icon" href="/logo.svg" />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default AskMedApp;
