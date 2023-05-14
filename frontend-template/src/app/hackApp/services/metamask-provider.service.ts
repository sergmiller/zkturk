﻿import { Injectable } from "@angular/core";
import detectEthereumProvider from "@metamask/detect-provider";
import { MetamaskStateService } from "./metamask-state.service";
import { runInAction } from "mobx";
import { MetamaskUtils } from "./metamask-utils";
import Web3 from "web3";
import { TurkContractClient } from "./turk-contrakt-client/TurkContractClient";

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

  private turkContraksClient: TurkContractClient | undefined;

  private turkContraksClient: TurkContractClient | undefined;

  constructor(private metamaskStateService: MetamaskStateService) {
    console.log("MetamaskProviderService constructor!");
    this.detectMetamask();
  }

  public get providerIsAvailable(): boolean {
    return this.metamaskProvider !== undefined;
  }

  public get isConnected(): boolean {
    return this.metamaskStateService.accounts.length > 0;
  }

  public async handleConnect() {
    const accounts = await this.anyMetamaskProvider.request({ method: "eth_requestAccounts" });

    this.updateWallet(accounts);
  }

  private async detectMetamask() {
    const provider = await detectEthereumProvider();

    if (provider) {
      this.metamaskProvider = provider;
      this.anyMetamaskProvider = provider;
      this.web3 = new Web3(provider as any);

      this.turkContraksClient = new TurkContractClient(this.web3);

      console.log("%cweb3", "color:blue", this.web3);
      console.log("%cturkContraksClient", "color:blue", this.turkContraksClient);

      console.log("%c=== Metamask successfully detected! ===", "color: green");
      const accounts = await this.anyMetamaskProvider.request({ method: "eth_accounts" });
      // console.log("refreshedAccounts: ", accounts);
      this.refreshAccounts(accounts);
      this.metamaskProvider.on("chainChanged", this.handleChainChanged);
      this.anyMetamaskProvider.on("accountsChanged", this.refreshAccounts); /* New */
    } else {
      console.error("%cPlease install MetaMask!", "color: blue");
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
    console.log("chainChanged: ", chainId);
    // We recommend reloading the page, unless you must do otherwise.
  }

  private async updateWallet(accounts: string[]) {
    // console.log("accounts: ", accounts);
    runInAction(() => {
      this.metamaskStateService.accounts = accounts;
    });
    const account = accounts[0];

    const balance = await this.anyMetamaskProvider.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    const formatedBalance = MetamaskUtils.formatBalance(balance);
    console.log("balance: ", formatedBalance);
    runInAction(() => {
      this.metamaskStateService.balance = formatedBalance;
    });

    const chainId = await this.anyMetamaskProvider.request({
      method: "eth_chainId",
    });
    console.log("chainId: ", chainId);
    runInAction(() => {
      this.metamaskStateService.chainId = chainId;
    });

    this.getProblems();
  }

  private async getProblems() {
    if (this.turkContraksClient) {
      const problems = await this.turkContraksClient.getAvailableProblems();
      console.log("%cproblems: ", "color: green", problems);

      runInAction(() => {
        this.metamaskStateService.avalibleProblems = problems;
      });
    }

    this.getProblems();
  }

  private async getProblems() {
    if (this.turkContraksClient) {
      const problems = await this.turkContraksClient.getAvailableProblems();
      console.log("%cproblems: ", "color: green", problems);

      runInAction(() => {
        this.metamaskStateService.avalibleProblems = problems;
      });
    }
  }
}
