/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import {
  EDCOIN_CONTRACT_ADDRESS,
  EDCOIN_STAKING_CONTRACT_ADDRESS,
} from '../config';

import { useWeb3 } from './Web3.provider';
import { toBN, toWei } from '../utils';

import * as EdcoinStake from '../../contracts/EdcoinStake.json';
import * as EdcoinToken from '../../contracts/Edcoin.json';

const ModalContext = createContext();

const useEdcoinContext = () => useContext(ModalContext);

const initialState = () => ({
  contract: null,
  edcoinContract: null,
  totalEdcoin: 0,
  totalStaked: 0,
  totalStakers: 0,
  isRegistered: false,
  accountBalance: 0,
  referralCount: 0,
  accountEdcoinStaked: 0,
  accountDividends: 0,
});

const LOAD_CONTRACT = 'web3/LOAD_CONTRACT';

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
  const [state, { update }] = useEdcoinContext();
  const [{ web3, address }, login] = useWeb3();

  useEffect(() => {
    if (window.web3) login();
  }, []);

  const loadContract = async () => {
    if (web3) {
      const contract = new web3.eth.Contract(
        EdcoinStake.abi,
        EDCOIN_STAKING_CONTRACT_ADDRESS
      );

      const edcoinContract = new web3.eth.Contract(
        EdcoinToken.abi,
        EDCOIN_CONTRACT_ADDRESS
      );

      update({
        contract,
        edcoinContract,
        isRegistered: await contract.methods.stakerIsRegistered(address).call(),
        totalEdcoin: await edcoinContract.methods.totalSupply().call(),
        totalStaked: await contract.methods.totalStaked().call(),
        accountEdcoinStaked: await contract.methods.stakeValue(address).call(),
        accountBalance: await edcoinContract.methods.balanceOf(address).call(),
        accountDividends: await contract.methods.dividendsOf(address).call(),
      });
    }
  };

  const approveToken = async (amount) => {
    const contract = new web3.eth.Contract(
      EdcoinToken.abi,
      EDCOIN_CONTRACT_ADDRESS
    );
    return contract.methods
      .approve(EDCOIN_STAKING_CONTRACT_ADDRESS, amount)
      .send({ from: address });
  };

  const stakeEdcoin = async (amount, referralAddress) => {
    const requestBN = toBN(toWei(amount || '0'));
    if (!web3 || !address || !state.contract) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    const min = 1;

    if (requestBN.lt(toBN(toWei(min.toString())))) {
      alert(
        'Must send at least ' +
          min.toString() +
          ' Edcoin to stake and register.'
      );
      return;
    }

    if (requestBN.gt(toBN(state.accountBalance))) {
      alert('Cannot stake more Edcoin than is in your account.');
      return;
    }

    if (state.isRegistered) {
      await approveToken(requestBN.toString());
      await state.contract.methods
        .stake(requestBN.toString())
        .send({ from: address });
    } else {
      await approveToken(requestBN.toString());
      await state.contract.methods
        .registerAndStake(requestBN.toString(), referralAddress)
        .send({ from: address });
    }
    alert(
      'Stake request sent. Check your wallet to see when it has completed, then refresh this page.'
    );
  };

  const unStakeEdcoin = async (amount) => {
    const requestBN = toBN(toWei(amount));
    if (!web3 || !address || !state.contract) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    if (requestBN.lt(toBN('1'))) {
      alert('Must unstake at least 1 Edcoin.');
      return;
    }
    if (requestBN.gt(toBN(state.accountEdcoinStaked))) {
      alert('Cannot unstake more Edcoin than you have staked.');
      return;
    }
    console.log(state.contract.methods);
    await state.contract.methods
      .unstake(requestBN.toString())
      .send({ from: address });
    alert(
      'Unstake request sent. Check your wallet to see when it has completed, then refresh this page.'
    );
  };

  const withdrawRewards = async () => {
    const requestBN = toBN(state.accountDividends);
    if (!web3 || !address || !state.contract) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    if (requestBN.lt(toBN('1'))) {
      alert('Must have at least 1 Edcoin in dividends.');
      return;
    }
    await state.contract.methods
      .withdraw(requestBN.toString())
      .send({ from: address });
    alert(
      'Unstake request sent. Check your wallet to see when it has completed, then refresh this page.'
    );
  };

  const reInvest = async () => {
    const requestBN = toBN(state.accountDividends);
    if (!web3 || !address || !state.contract) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    if (requestBN.lt(toBN('1'))) {
      alert('Must have at least 1 Edcoin in dividends.');
      return;
    }
    await state.contract.methods
      .reinvest(requestBN.toString())
      .send({ from: address });
    alert(
      'Reinvest request sent. Check your wallet to see when it has completed, then refresh this page.'
    );
  };

  return [
    state,
    loadContract,
    stakeEdcoin,
    unStakeEdcoin,
    withdrawRewards,
    reInvest,
  ];
};
