import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import { createWatcher } from '@makerdao/multicall';

import {
  EDCOIN_CONTRACT_ADDRESS,
  EDCOIN_STAKING_CONTRACT_ADDRESS,
} from '../config';

import { useWeb3 } from './Web3.provider';
import { toBN, toWei } from '../utils';

import * as EdcoinStake from '../../contracts/EdcoinStake.json';

const ModalContext = createContext();

const useModalContext = () => useContext(ModalContext);

const initialState = () => ({
  contract: null,
  totalStakes: 0,
  totalEdcoin: 0,
  yourEDCBalance: 0,
  yourStakedEDCBalance: 0,
  pendingRewards: 0,
});

const LOAD_CONTRACT = 'web3/LOAD_CONTRACT';

const defaultWatcher = createWatcher([], {});

const reducer = (state, { type, payload }) => {
  switch (type) {
    case LOAD_CONTRACT:
      return {
        ...state,
        ...payload,
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
      type: LOAD_CONTRACT,
      payload,
    });
  }, []);

  return (
    <ModalContext.Provider
      value={useMemo(() => [state, { update }], [state, update])}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useContract = () => {
  const [state, { update }] = useModalContext();

  const [{ web3, address }, login] = useWeb3();

  useEffect(() => {
    if (window.web3) login();
  }, []);

  const multiCallConfig = useMemo(
    () => ({
      web3,
      multicallAddress: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
      interval: 10000,
    }),
    [web3]
  );

  useEffect(() => {
    if (!web3) return;

    const contract = new web3.eth.Contract(
      EdcoinStake.abi,
      EDCOIN_STAKING_CONTRACT_ADDRESS
    );

    defaultWatcher.stop();

    defaultWatcher.recreate(
      [
        {
          target: EDCOIN_CONTRACT_ADDRESS,
          call: ['totalSupply()(uint256)'],
          returns: [['totalEDC']],
        },
        {
          target: EDCOIN_STAKING_CONTRACT_ADDRESS,
          call: ['totalStaked()(uint256)'],
          returns: [['totalStaked']],
        },
        {
          target: EDCOIN_STAKING_CONTRACT_ADDRESS,
          call: ['totalStakers()(uint256)'],
          returns: [['totalStakers']],
        },
      ],
      multiCallConfig
    );

    defaultWatcher.subscribe((payload) => {
      console.log(payload);
    });

    defaultWatcher.start();
  }, [multiCallConfig, web3]);

  const loadContract = async () => {
    if (web3) {
      const contract = new web3.eth.Contract(
        EdcoinStake.abi,
        EDCOIN_STAKING_CONTRACT_ADDRESS
      );

      console.log(await contract.methods.yourEDCBalance(address).call());

      update({
        contract,
        totalStakes: await contract.methods.totalStakes().call(),
        yourEDCBalance: await contract.methods.yourEDCBalance(address).call(),
        yourStakedEDCBalance: await contract.methods
          .yourStakedEDC(address)
          .call(),
      });
    }
  };

  const stakeEdcoin = async (amount) => {
    const totalAmount = toBN(toWei(amount || '0'));
    await state.contract.methods.STAKE(totalAmount).send({ from: address });
  };

  const withdrawRewards = async () => {
    await state.contract.methods.CLAIMREWARD().send({ from: address });
  };

  return [state, loadContract, stakeEdcoin, withdrawRewards];
};
