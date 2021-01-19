import { DEFAULT_NETWORK } from 'constant';

export const getNetworkDetails = async (provider: any, address: string) => {
  try {
    let currentNetwork = await provider.getNetwork();
    if (currentNetwork.chainId !== Number(DEFAULT_NETWORK)) {
      return {
        error: `Wrong network selected. Please make sure you are on ${await getNetworkName(
          Number(DEFAULT_NETWORK)
        )}`,
      };
    }
    return {
      currentNetwork,
      networkAddress: address,
      currentBalance: await provider.getBalance(address),
    };
  } catch (error) {
    return {
      error: `Unable to detect Web3 on browser`,
    };
  }
};

export const getNetworkName = async (id: string | number) => {
  switch (id) {
    case 1:
      return 'Main Network';
    case 3:
      return 'Ropsten Testnet';
    case 4:
      return 'Rinkeby Testnet';
    case 42:
      return 'Kovan Testnet';
    case 77:
      return 'Sokol Testnet';
    default:
      return 'Local Testnet';
  }
};
