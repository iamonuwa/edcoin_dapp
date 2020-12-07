import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import Torus from '@toruslabs/torus-embed';
import Authereum from 'authereum';
import UniLogin from '@unilogin/provider';
import Portis from '@portis/web3';
import MewConnect from '@myetherwallet/mewconnect-web-client';
import Squarelink from 'squarelink';

const Web3Context = createContext();

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: '29a7f0c37b214a90934bec1b032d5c8f',
    },
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: 'pk_live_B853BB3433E80B5B',
    },
  },
  torus: {
    package: Torus,
  },
  authereum: {
    package: Authereum,
  },
  unilogin: {
    package: UniLogin,
  },
  portis: {
    package: Portis,
    options: {
      id: '9b1635c2-43f4-4cbe-b8b6-73bf219d6a77',
    },
  },
  squarelink: {
    package: Squarelink,
    options: {
      id: '48ff2cdfaf26656bbd86',
    },
  },
  mewconnect: {
    package: MewConnect,
    options: {
      infuraId: '53a6aee5a5c74599b815999befb91ecc',
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions,
});

const useWeb3Context = () => useContext(Web3Context);

const initialState = () => ({
  address: null,
  balance: 0,
  web3: null,
});

const UPDATE_WEB3 = 'web3/UPDATE_WEB3';

const reducer = (state, { type, payload }) => {
  let { address, balance, web3 } = payload;
  switch (type) {
    case UPDATE_WEB3:
      return {
        ...state,
        address,
        balance,
        web3,
      };
    default: {
      throw new Error(`Unknown action type ${type}`);
    }
  }
};

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const update = useCallback((payload) => {
    dispatch({
      type: UPDATE_WEB3,
      payload,
    });
  }, []);

  return (
    <Web3Context.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => {
  const [{ address, balance, web3 }, { update }] = useWeb3Context();

  const login = async () => {
    const provider = await web3Modal.connect();
    const web3Provider = new Web3(provider);
    web3Provider.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: web3Provider.utils.hexToNumber,
        },
      ],
    });

    provider.on('accountsChanged', (accounts) => {
      console.log(accounts);
    });

    // Subscribe to provider disconnection
    provider.on('disconnect', (error) => {});

    update({
      web3: web3Provider,
      address: (await web3Provider.eth.getAccounts())[0],
      balance: 0,
    });
  };

  return [{ address, balance, web3 }, login];
};
