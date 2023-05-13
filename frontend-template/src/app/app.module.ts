import { NgModule } from "@angular/core";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppLayoutModule } from "./layout/app.layout.module";
import { NotfoundComponent } from "./demo/components/notfound/notfound.component";
import { ProductService } from "./demo/service/product.service";
import { CountryService } from "./demo/service/country.service";
import { CustomerService } from "./demo/service/customer.service";
import { EventService } from "./demo/service/event.service";
import { IconService } from "./demo/service/icon.service";
import { NodeService } from "./demo/service/node.service";
import { PhotoService } from "./demo/service/photo.service";
import { MainLayoutComponent } from "./hackApp/layouts/main-layout/main-layout.component";
import { IntegrationLayoutComponent } from "./hackApp/layouts/integration-layout/integration-layout.component";
import { MetamaskProviderService } from "./hackApp/services/metamask-provider.service";
import { configure } from "mobx";
import { MetamaskStateService } from "./hackApp/services/metamask-state.service";
import { NewTaskLayoutComponent } from "./hackApp/layouts/new-task-layout/new-task-layout.component";
import { AllMyTasksLayoutComponent } from './hackApp/layouts/all-my-tasks-layout/all-my-tasks-layout.component';
import { AvailableTasksLayoutComponent } from './hackApp/layouts/available-tasks-layout/available-tasks-layout.component';

@NgModule({
  declarations: [AppComponent, NotfoundComponent, MainLayoutComponent, IntegrationLayoutComponent, NewTaskLayoutComponent, AllMyTasksLayoutComponent, AvailableTasksLayoutComponent],
  imports: [AppRoutingModule, AppLayoutModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    CountryService,
    CustomerService,
    EventService,
    IconService,
    NodeService,
    PhotoService,
    ProductService,
    MetamaskProviderService,
    MetamaskStateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    configure({ isolateGlobalState: true });
  }
}
