import { AbstractConnector } from '@web3-react/abstract-connector';
import { injected, walletconnect } from 'connectors';

export const EDCOIN_STAKING_CONTRACT_ADDRESS =
  '0xc7CA5E8e242f4f76dE05FF811F15B926844A4451';
export const EDCOIN_CONTRACT_ADDRESS =
  '0x6FD38743601655B05c8be71ED000e52Be6be265C';

export const NetworkContextName = `${new Date().getTime()}-NETWORK`;
export const DEFAULT_NETWORK = 4;

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: boolean;
  mobile?: boolean;
  mobileOnly?: boolean;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'Wallet Connect',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
};
