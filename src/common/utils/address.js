import Web3 from 'web3';

export function shortenAddress(address, digits = 4) {
  if (!Web3.utils.isAddress(address.toString())) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${address.substring(0, digits + 2)}...${address.substring(
    42 - digits
  )}`;
}

export const formatAddress = (address) => {
  let pre = address.toLowerCase().slice(0, 12);
  let post = address.toLowerCase().slice(address.length - 4);

  return `${pre}...${post}`;
};
