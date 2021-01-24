import Blockchain from 'services';
import * as EdcoinStake from 'contracts/EdcoinStake.json';
import { EDCOIN_STAKING_CONTRACT_ADDRESS } from 'constant';
import { fromWei } from 'utils/convert';

export default class EdcoinStakingContract extends Blockchain {
  public contract: any;
  constructor() {
    super();
    this.contract = this.initializeContract(
      EDCOIN_STAKING_CONTRACT_ADDRESS,
      EdcoinStake
    );
    this.stake = this.stake.bind(this);
    this.registerAndStake = this.registerAndStake.bind(this);
    this.unstake = this.unstake.bind(this);
    this.withdraw = this.withdraw.bind(this);
    this.reinvest = this.reinvest.bind(this);
    this.getTotalStaked = this.getTotalStaked.bind(this);
    this.checkIfRegistered = this.checkIfRegistered.bind(this);
    this.computeEarnings = this.computeEarnings.bind(this);
    this.countStakes = this.countStakes.bind(this);
  }

  async stake(account: string, amount: string) {
    let contract = await this.contract;
    return await contract.methods.stake(amount).send({ from: account });
  }

  async registerAndStake(
    account: string,
    amount: string,
    referralAddress: string
  ) {
    let contract = await this.contract;
    referralAddress = referralAddress
      ? referralAddress
      : '0x0000000000000000000000000000000000000000';
    let registerAndStakeTx = await contract.methods
      .registerAndStake(amount.toString(), referralAddress)
      .send({ from: account });

    return registerAndStakeTx;
  }

  async unstake(account: string, amount: string) {
    let contract = await this.contract;
    return await contract.methods
      .unstake(amount.toString())
      .send({ from: account });
  }

  async withdraw(account: string | null | undefined) {
    let contract = await this.contract;
    return await contract.methods.withdrawEarnings().send({ from: account });
  }

  async reinvest(account: string, amount: string) {
    let contract = await this.contract;
    try {
      return await contract.methods.reinvest(amount).send({ from: account });
    } catch (err) {
      return err;
    }
  }

  async getTotalStaked() {
    let contract = await this.contract;
    let totalStaked = await contract.methods.totalStaked().call();
    return parseFloat(fromWei(totalStaked.toString())).toFixed(4);
  }

  async checkIfRegistered(account: string | undefined | null) {
    let contract = await this.contract;
    return await contract.methods.registered(account).call();
  }
  async countStakes(account: string) {
    let contract = await this.contract;
    let totalStakes = await contract.methods.stakes(account).call();
    return parseFloat(fromWei(totalStakes.toString())).toFixed(4);
  }

  async getReferrals(account: string) {
    let contract = await this.contract;
    let totalReferrals = await contract.methods.referralCount(account).call();
    return totalReferrals.toString();
  }

  async computeEarnings(account: string) {
    let contract = await this.contract;
    let earnings = await contract.methods.calculateEarnings(account).call();
    console.log('Earnings ', earnings);
    return parseFloat(fromWei(earnings.toString())).toFixed(4);
  }
}
