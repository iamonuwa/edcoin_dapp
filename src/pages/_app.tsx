import React from 'react';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from 'utils';
import { NetworkContextName } from 'constant';

const Header = dynamic(() => import('components/Header'), { ssr: false });

import theme from 'theme';
import dynamic from 'next/dynamic';

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Header />
          <Component {...pageProps} />
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </ChakraProvider>
  );
}

export default MyApp;
