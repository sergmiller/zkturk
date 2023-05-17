import { NgModule } from "@angular/core";
// import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppLayoutModule } from "./layout/app.layout.module";
import { NotfoundComponent } from "./demo/components/notfound/notfound.component";
// import { ProductService } from "./demo/service/product.service";
// import { CountryService } from "./demo/service/country.service";
// import { CustomerService } from "./demo/service/customer.service";
// import { EventService } from "./demo/service/event.service";
// import { IconService } from "./demo/service/icon.service";
// import { PhotoService } from "./demo/service/photo.service";
import { MainLayoutComponent } from "./hackApp/layouts/main-layout/main-layout.component";
import { MetamaskProviderService } from "./hackApp/services/metamask-provider.service";
import { configure } from "mobx";
import { MetamaskStateService } from "./hackApp/services/metamask-state.service";
import { MyEventService } from "./hackApp/services/event.service";
@NgModule({
  declarations: [AppComponent, NotfoundComponent, MainLayoutComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    // CountryService,
    // CustomerService,
    // EventService,
    // IconService,
    // PhotoService,
    // ProductService,
    MetamaskProviderService,
    MetamaskStateService,
    MyEventService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    configure({ isolateGlobalState: true });
  }
}
