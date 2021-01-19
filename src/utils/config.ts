const INFURA_API_KEY =
  process.env.NODE_ENV === 'development'
    ? '8365ba3a83054a92bac3585c1ecaa139'
    : '8365ba3a83054a92bac3585c1ecaa139';

export const PUBLIC_NODE_URLS_BY_NETWORK_ID = {
  1: [`https://mainnet.infura.io/v3/${INFURA_API_KEY}`],
  42: [`https://kovan.infura.io/v3/${INFURA_API_KEY}`, 'https://kovan.0x.org'],
  3: [`https://ropsten.infura.io/v3/${INFURA_API_KEY}`],
  4: [`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`],
};
