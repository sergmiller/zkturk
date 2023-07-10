import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { MetamaskStateService } from './metamask-state.service';
import { runInAction } from 'mobx';
import { MetamaskUtils } from './metamask-utils';
import Web3 from 'web3';
import { ZkTurkClient } from './turk-contract-artifacts/frontend-clients/ZkTurkClient';
import { ethers } from 'ethers';
import ZkTurkArtifacts from './turk-contract-artifacts/artifacts/contracts/ZkTurk.sol/ZkTurk.json';
import { environment } from 'src/environments/environment.prod';
const networkIdToContractAddress: Record<string, string> = environment.networkIdToContractAddress;

interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  once(eventName: string | symbol, listener: (...args: any[]) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
}

@Injectable()
export class MetamaskProviderService {
  private metamaskProvider: MetaMaskEthereumProvider | undefined;

  private anyMetamaskProvider: any | undefined;

  private web3: any | undefined;

  private ethersProvider: ethers.providers.Web3Provider | undefined;

  private zkTurkContractsClient: ZkTurkClient | undefined;

  constructor(private metamaskStateService: MetamaskStateService) {
    this.detectMetamask();
  }

  public get providerIsAvailable(): boolean {
    return this.metamaskProvider !== undefined;
  }

  public get getTurkContraksClient() {
    return this.zkTurkContractsClient;
  }

  public get isConnected(): boolean {
    return this.metamaskStateService.accounts.length > 0;
  }

  public async handleConnect() {
    const accounts = await this.anyMetamaskProvider.request({ method: 'eth_requestAccounts' });

    this.updateWallet(accounts);
  }

  private async detectMetamask() {
    const provider = await detectEthereumProvider();

    if (provider) {
      this.web3 = new Web3(provider as any);
      this.metamaskProvider = provider;
      this.anyMetamaskProvider = provider;
      this.ethersProvider = new ethers.providers.Web3Provider(provider);

      const networkId = await this.web3.eth.net.getId();
      console.log('Detected network:', networkId);
      const contractAddress = networkIdToContractAddress[networkId];
      console.log('contractAddress is', contractAddress);
      const signer = this.ethersProvider.getSigner();
      this.zkTurkContractsClient = new ZkTurkClient(signer, ZkTurkArtifacts.abi, contractAddress);

      console.log('%cweb3', 'color:blue', this.web3);
      console.log('%cturkContraksClient', 'color:blue', this.zkTurkContractsClient);
      console.log('%c=== Metamask successfully detected! ===', 'color: green');

      const accounts = await this.anyMetamaskProvider.request({ method: 'eth_accounts' });
      this.refreshAccounts(accounts);
      this.metamaskProvider.on('chainChanged', this.handleChainChanged);
      this.anyMetamaskProvider.on('accountsChanged', this.refreshAccounts);
    } else {
      console.error('Please install MetaMask!');
    }
  }

  private refreshAccounts(accounts: string[]) {
    if (accounts.length > 0) {
      this.updateWallet(accounts);
    } else {
      this.metamaskStateService.resetState();
    }
  }

  private handleChainChanged(chainId: any) {
    console.log('chainChanged: ', chainId);
    // We recommend reloading the page, unless you must do otherwise.
  }

  private async updateWallet(accounts: string[]) {
    // console.log("accounts: ", accounts);
    runInAction(() => {
      this.metamaskStateService.accounts = accounts;
    });
    const account = accounts[0];

    const balance = await this.anyMetamaskProvider.request({
      method: 'eth_getBalance',
      params: [account, 'latest'],
    });
    const formatedBalance = MetamaskUtils.formatBalance(balance);
    console.log('balance: ', formatedBalance);
    runInAction(() => {
      this.metamaskStateService.balance = formatedBalance;
    });

    const chainId = await this.anyMetamaskProvider.request({
      method: 'eth_chainId',
    });
    console.log('chainId: ', chainId);
    runInAction(() => {
      this.metamaskStateService.chainId = chainId;
    });

    this.getProblems();
  }

  private async getProblems() {
    if (this.zkTurkContractsClient) {
      const problems = await this.zkTurkContractsClient.getAvailableProblems();
      console.log('%cproblems: ', 'color: green', problems);

      runInAction(() => {
        this.metamaskStateService.avalibleProblems = problems;
      });

      const myProblems = await this.zkTurkContractsClient.getAllMyProblems();
      console.log('%cmyProblems: ', 'color: green', myProblems);

      runInAction(() => {
        this.metamaskStateService.myProblems = myProblems;
      });

      const problemId = await this.zkTurkContractsClient.getJoinedProblem();
      console.log('%cmyProblems: ', 'color: green', problemId);
      runInAction(() => {
        this.metamaskStateService.joinedProblemId = problemId.toNumber();
      });
    }
  }
}
