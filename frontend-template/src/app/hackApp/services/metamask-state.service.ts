import { Injectable } from "@angular/core";
import { observable, makeObservable, action } from "mobx";

@Injectable()
export class MetamaskStateService {
  public accounts: string[] = [];

  public balance: string = "-.--";

  public chainId: string = "";

  constructor() {
    makeObservable<MetamaskStateService>(this, {
      accounts: observable,
      balance: observable,
      resetState: action,
    });
  }

  public resetState() {
    this.accounts = [];
    this.balance = "-.--";
    this.chainId = "";
  }
}
