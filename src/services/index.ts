import Web3 from 'web3';
export default class Blockchain {
  constructor() {
    this.getInstance();
  }

  async init() {
    let web3: any;
    // @ts-ignore
    if (typeof window.web3 !== 'undefined') {
      // @ts-ignore
      web3 = new Web3(window.web3.currentProvider);
    } else {
      web3 = new Web3(
        'https://rinkeby.infura.io/v3/8365ba3a83054a92bac3585c1ecaa139'
      );
    }

    web3.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: web3.utils.hexToNumber as any,
        },
      ],
    });

    if ('web3' in window || 'ethereum' in window) {
      // @ts-ignore
      web3.eth.defaultAccount = window.web3.eth.accounts[0];
    }

    return {
      web3,
    };
  }
  async getInstance() {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof window !== 'undefined') {
          resolve(await this.init());
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  async initializeContract(address: string, contract: any) {
    try {
      let { web3 }: any = await this.getInstance();
      return new web3.eth.Contract(contract.default.abi, address);
    } catch (error) {
      console.log('Blockchain initializeContract error', error);
      return error;
    }
  }

  async getEth(account: string) {
    try {
      let { web3 }: any = await this.getInstance();
      return await web3.eth.getBalance(account);
    } catch (error) {
      return error;
    }
  }
}
