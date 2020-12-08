import Web3 from 'web3';

export const toEther = (amount) => Web3.utils.fromWei(amount, 'ether');
export const toBN = Web3.utils.toBN;
export const toWei = Web3.utils.toWei;
export const fromWei = Web3.utils.fromWei;

export const formatAmount = (value) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(value);
