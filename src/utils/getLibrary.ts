import Web3 from 'web3';
export const getLibrary = (): any => {
  let web3: any;
  // @ts-ignore
  if (typeof window.web3 !== 'undefined') {
    // @ts-ignore
    web3 = new Web3(window.web3.currentProvider);
  } else {
    web3 = new Web3(
      'https://rinkeby.infura.io/v3/8365ba3a83054a92bac3585c1ecaa139'
    );
  }
  const library = web3.currentProvider;
  return library;
};
