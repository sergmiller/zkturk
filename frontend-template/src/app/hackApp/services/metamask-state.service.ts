import { Injectable } from "@angular/core";
import { observable, makeObservable, action } from "mobx";
import { ProblemModel } from "./turk-contrakt-client/TurkContractClient";

@Injectable()
export class MetamaskStateService {
  public accounts: string[] = [];

  public balance: string = "-.--";

  public chainId: string = "";

  public avalibleProblems: ProblemModel[] = [];

  public myProblems: ProblemModel[] = [];

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
