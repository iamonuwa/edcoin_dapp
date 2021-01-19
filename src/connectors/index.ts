import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { PUBLIC_NODE_URLS_BY_NETWORK_ID } from 'utils';

const POLLING_INTERVAL = 12000;

const RPC_URLS: { [chainId: number]: string } = {
  1: PUBLIC_NODE_URLS_BY_NETWORK_ID[1][0],
  42: PUBLIC_NODE_URLS_BY_NETWORK_ID[42][0],
  4: PUBLIC_NODE_URLS_BY_NETWORK_ID[4][0],
  3: PUBLIC_NODE_URLS_BY_NETWORK_ID[3][0],
};

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 3: RPC_URLS[3], 4: RPC_URLS[4] },
  defaultChainId: 1,
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'Edcoin Staking',
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4],
});
