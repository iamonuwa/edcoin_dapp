/// <reference types="next" />
/// <reference types="next/types/global" />

interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
  };
  web3?: {};
}
