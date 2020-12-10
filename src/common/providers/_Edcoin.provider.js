/* eslint-disable react-hooks/exhaustive-deps */
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
import * as EdcoinToken from '../../contracts/Edcoin.json';

const ModalContext = createContext();

const useModalContext = () => useContext(ModalContext);

const initialState = () => ({
  contract: null,
  edcoinContract: null,
  totalEdcoin: '0',
  totalStaked: '0',
  totalStakers: '0',
  isRegistered: false,
  accountEdcoin: '0',
  referralCount: '0',
  accountEdcoinStaked: '0',
  accountDividends: '0',
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
  // const [state, { update }] = useModalContext();
  const [{ web3, address }, login] = useWeb3();
  const [stakingContract, setStakingContract] = React.useState(null);

  const [state, setState] = React.useState({
    totalEdcoin: '0',
    totalStaked: '0',
    totalStakers: '0',
    isRegistered: false,
    accountEdcoin: '0',
    referralCount: '0',
    accountEdcoinStaked: '0',
    accountDividends: '0',
  });

  useEffect(() => {
    if (window.web3) login();
  }, []);

  // const multiCallConfig = useMemo(
  //   () => ({
  //     web3,
  //     multicallAddress: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
  //     interval: 10000,
  //   }),
  //   [web3]
  // );

  // useEffect(() => {
  //   if (!web3) return;

  //   const edcStakingContract = new web3.eth.Contract(
  //     EdcoinStake.abi,
  //     EDCOIN_STAKING_CONTRACT_ADDRESS
  //   );

  //   setStakingContract(edcStakingContract);

  //   defaultWatcher.stop();

  //   defaultWatcher.recreate(
  //     [
  //       {
  //         target: EDCOIN_CONTRACT_ADDRESS,
  //         call: ['totalSupply()(uint256)'],
  //         returns: [['totalEdcoin']],
  //       },
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['totalStaked()(uint256)'],
  //         returns: [['totalStaked']],
  //       },
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['totalStakers()(uint256)'],
  //         returns: [['totalStakers']],
  //       },
  //     ],
  //     multiCallConfig
  //   );

  //   defaultWatcher.subscribe((update) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       [update.type]: update.value.toString(),
  //     }));
  //   });

  //   defaultWatcher.start();
  // }, [web3]);

  // useEffect(() => {
  //   if (!web3) return;

  //   defaultWatcher.stop();

  //   defaultWatcher.recreate(
  //     [
  //       {
  //         target: EDCOIN_CONTRACT_ADDRESS,
  //         call: ['totalSupply()(uint256)'],
  //         returns: [['totalEdcoin']],
  //       },
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['totalStakes()(uint256)'],
  //         returns: [['totalStakes']],
  //       },
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['totalStakers()(uint256)'],
  //         returns: [['totalStakers']],
  //       },
  //     ],
  //     multiCallConfig
  //   );

  //   defaultWatcher.subscribe((payload) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       [payload.type]: payload.value.toString(),
  //     }));
  //   });

  //   defaultWatcher.start();
  // }, [multiCallConfig, web3]);

  // useEffect(() => {
  //   if (!web3 || !address) {
  //     return;
  //   }

  //   walletWatcher.stop();

  //   walletWatcher.recreate(
  //     [
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['stakerIsRegistered(address)(bool)', address],
  //         returns: [['isRegistered']],
  //       },
  //       {
  //         target: EDCOIN_CONTRACT_ADDRESS,
  //         call: ['balanceOf(address)(uint256)', address],
  //         returns: [['accountEdcoin']],
  //       },
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['accountReferrals(address)(uint256)', address],
  //         returns: [['referralCount']],
  //       },
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['stakeValue(address)(uint256)', address],
  //         returns: [['accountStaked']],
  //       },
  //       {
  //         target: EDCOIN_STAKING_CONTRACT_ADDRESS,
  //         call: ['dividendsOf(address)(uint256)', address],
  //         returns: [['accountDividends']],
  //       },
  //     ],
  //     multiCallConfig
  //   );

  //   walletWatcher.subscribe((walletUpdate) => {
  //     const { type, value } = walletUpdate;
  //     setState((prevState) => ({
  //       ...prevState,
  //       [walletUpdate.type]: type === 'isRegistered' ? value : value.toString(),
  //     }));
  //   });

  //   walletWatcher.start();
  // }, [web3, address]);

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

      // update({
      //   contract,
      //   edcoinContract,
      //   totalEdcoin: await edcoinContract.methods.totalSupply().call(),
      //   totalStakes: await contract.methods.totalStaked().call(),
      //   yourEDCBalance: 0,
      //   yourStakedEDCBalance: 0,
      // });
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
    // const min = isRegistered
    //   ? 1
    //   : referralAddress !== '0x0000000000000000000000000000000000000000'
    //   ? 201
    //   : 401;
    // if (requestBN.lt(toBN(toWei(min.toString())))) {
    //   alert(
    //     'Must send at least ' +
    //       min.toString() +
    //       ' EDCoin to stake and register.'
    //   );
    //   return;
    // }
    // if (requestBN.gt(toBN(accountLid))) {
    //   alert('Cannot stake more EDCoin than is in your account.');
    //   return;
    // }
    // if (isRegistered) {
    await state.contract.methods
      .stake(requestBN.toString())
      .send({ from: address });
    // } else {
    // await state.contract.methods
    //   .registerAndStake(requestBN.toString(), referralAddress)
    //   .send({ from: address });
    // }
    alert(
      'Stake request sent. Check your wallet to see when it has completed, then refresh this page.'
    );
    // const totalAmount = toBN(toWei(amount || '0'));
    // await approveToken(totalAmount);
    // await state.contract.methods.STAKE(totalAmount).send({ from: address });
  };

  const withdrawRewards = async () => {
    await state.contract.methods.CLAIMREWARD().send({ from: address });
  };

  return [state, loadContract, stakeEdcoin, withdrawRewards, approveToken];
};
