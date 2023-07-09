import { Injectable } from "@angular/core";
import { observable, makeObservable, action } from "mobx";
import {ZkTurk} from "./turk-contract-artifacts/typechain-types";

@Injectable()
export class MetamaskStateService {
  public accounts: string[] = [];

  public balance: string = "-.--";

  public chainId: string = "";

  public avalibleProblems: ZkTurk.ProblemStructOutput[] = [];

  public myProblems: ZkTurk.ProblemStructOutput[] = [];

  public joinedProblemId: number | undefined = undefined;

  constructor() {
    makeObservable<MetamaskStateService>(this, {
      accounts: observable,
      balance: observable,
      avalibleProblems: observable.shallow,
      myProblems: observable.shallow,
      joinedProblemId: observable,
      resetState: action,
    });
  }

  public resetState() {
    this.accounts = [];
    this.balance = "-.--";
    this.chainId = "";
    this.avalibleProblems = [];
    this.myProblems = [];
  }
}
