import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/api";
import { LayoutService } from "../../service/app.layout.service";
import { MetamaskProviderService } from "src/app/hackApp/services/metamask-provider.service";
import { IReactionDisposer, reaction } from "mobx";
import { MetamaskStateService } from "src/app/hackApp/services/metamask-state.service";

@Component({
  selector: "my-topbar",
  templateUrl: "./my.topbar.component.html",
  styleUrls: ["./my.topbar.component.scss"],
})
export class MyTopBarComponent implements OnInit, OnDestroy {
  items!: MenuItem[];

  @ViewChild("menubutton") menuButton!: ElementRef;

  @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;

  @ViewChild("topbarmenu") menu!: ElementRef;

  public isConnected: boolean = false;

  private reactions: IReactionDisposer[] = [];

  constructor(
    public layoutService: LayoutService,
    private metamaskProvider: MetamaskProviderService,
    private metamaskStateService: MetamaskStateService,
  ) {}

  get balance() {
    return this.metamaskStateService.balance;
  }

  ngOnInit() {
    console.log("MyTopBarComponent.ngOnInit()");

    this.reactions.push(
      reaction(
        () => this.metamaskStateService.accounts,
        () => {
          console.log("reaction");
          this.isConnected = this.metamaskProvider.isConnected;
        },
      ),
    );
    this.isConnected = this.metamaskProvider.isConnected;
    console.log("connected: ", this.isConnected);
  }

  ngOnDestroy() {
    this.reactions.forEach((disposer) => disposer());
  }

  public clickConnect() {
    this.metamaskProvider.handleConnect();
  }
}
