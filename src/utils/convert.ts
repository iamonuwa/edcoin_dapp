import Web3 from 'web3';

export const toEther = (amount: any) => Web3.utils.fromWei(amount, 'ether');
export const toBN = Web3.utils.toBN;
export const toWei = Web3.utils.toWei;
export const fromWei = Web3.utils.fromWei;

export const formatNumber = Intl.NumberFormat('en');
