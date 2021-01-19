import Blockchain from 'services';
import * as EdcoinToken from 'contracts/Edcoin.json';
import {
  EDCOIN_CONTRACT_ADDRESS,
  EDCOIN_STAKING_CONTRACT_ADDRESS,
} from 'constant';
import { fromWei } from 'utils/convert';

export default class Edcoin extends Blockchain {
  public contract: any;
  constructor() {
    super();
    this.contract = this.initializeContract(
      EDCOIN_CONTRACT_ADDRESS,
      EdcoinToken
    );
  }

  async approveToken(amount: string, account: string) {
    let contract = await this.contract;
    try {
      return await contract.methods
        .approve(EDCOIN_STAKING_CONTRACT_ADDRESS, amount.toString())
        .send({ from: account });
    } catch (err) {
      console.log('Approving error...', err);
      return err;
    }
  }

  async increaseAllowance(amount: string, account: string) {
    let contract = await this.contract;
    try {
      return await contract.methods
        .increaseAllowance(EDCOIN_STAKING_CONTRACT_ADDRESS, amount)
        .send({ from: account });
    } catch (err) {
      return err;
    }
  }

  async getBalance(account: string) {
    let contract = await this.contract;
    try {
      let balance = await contract.methods.balanceOf(account).call();
      return parseFloat(fromWei(balance.toString())).toFixed(4);
    } catch (err) {
      console.log('getBalance() ', err);
      return 0;
    }
  }

  async getSupply() {
    let contract = await this.contract;
    try {
      let totalSupply = await contract.methods.totalSupply().call();
      return parseFloat(fromWei(totalSupply.toString())).toFixed(4);
    } catch (err) {
      console.log('getSupply() ', err);
      return '0';
    }
  }

  async getAllowance(account: string) {
    let contract = await this.contract;
    try {
      return await contract.methods
        .allowance(EDCOIN_CONTRACT_ADDRESS, account)
        .call();
    } catch (err) {
      return err;
    }
  }

  async getEtherBalance(account: string) {
    try {
      let balance = await this.getEth(account);
      return parseFloat(fromWei(balance.toString())).toFixed(4);
    } catch (err) {
      return err;
    }
  }
}
