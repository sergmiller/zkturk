import { Injectable } from "@angular/core";
import detectEthereumProvider from "@metamask/detect-provider";
import { MetamaskStateService } from "./metamask-state.service";
import { runInAction } from "mobx";
import { MetamaskUtils } from "./metamask-utils";
import Web3 from "web3";
import {ZkTurkClient} from "./turk-contract-artifacts/frontend-clients/ZkTurkClient";
import {ethers} from "ethers";
// @ts-ignore
import ZkTurkArtifacts from "./turk-contract-artifacts/artifacts/contracts/ZkTurk.sol/ZkTurk.json";

interface MetaMaskEthereumProvider {
  isMetaMask?: boolean;
  once(eventName: string | symbol, listener: (...args: any[]) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
}

const networkIdToContractAddress: any = {
  //   TODO: more networks.
  // 137: "0xD9245acA14c7E1985e8E16CB987Cd11C7b485c53",
  80001: "0xFa024FEcebE35A552C564E6eA2c38ecF52Be7a9f", //mumbai
  // 10200: "0x5a1b840CB796c697C1185dB9F43432C08Ba7B6AA",
};

@Injectable()
export class MetamaskProviderService {
  private metamaskProvider: MetaMaskEthereumProvider | undefined;

  private anyMetamaskProvider: any | undefined;

  private web3: any | undefined;

  private turkContraksClient: ZkTurkClient | undefined;

  constructor(private metamaskStateService: MetamaskStateService) {
    console.log("MetamaskProviderService constructor!");
    this.detectMetamask();
  }

  public get providerIsAvailable(): boolean {
    return this.metamaskProvider !== undefined;
  }

  public get getTurkContraksClient() {
    return this.turkContraksClient;
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
      // TODO: does it works correctly?
      // @ts-ignore
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = ethersProvider.getSigner()
      this.web3 = new Web3(provider as any);

      const networkId = await this.web3.eth.net.getId();
      console.log("Detected network:", networkId);
      const contractAddress = networkIdToContractAddress[networkId];
      console.log("contractAddress is", contractAddress);
      //  TODO: if not supported network.
      this.turkContraksClient = new ZkTurkClient(signer, ZkTurkArtifacts.abi, contractAddress);

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

      const myProblems = await this.turkContraksClient.getAllMyProblems();
      console.log("%cmyProblems: ", "color: green", myProblems);

      runInAction(() => {
        this.metamaskStateService.myProblems = myProblems;
      });

      const problemId = await this.turkContraksClient.getJoinedProblem();
      console.log("%cmyProblems: ", "color: green", problemId);
      runInAction(() => {
        // @ts-ignore
          this.metamaskStateService.joinedProblemId = problemId;
      });
    }
  }
}
