import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InputTextModule } from "primeng/inputtext";
import { SidebarModule } from "primeng/sidebar";
import { BadgeModule } from "primeng/badge";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputSwitchModule } from "primeng/inputswitch";
import { RippleModule } from "primeng/ripple";
import { AppMenuComponent } from "./app.menu.component";
import { AppMenuitemComponent } from "./app.menuitem.component";
import { RouterModule } from "@angular/router";
import { AppTopBarComponent } from "./app.topbar.component";
import { AppFooterComponent } from "./app.footer.component";
import { AppConfigModule } from "./config/config.module";
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppLayoutComponent } from "./app.layout.component";
import { MyTopBarComponent } from "./customization/topbar/my.topbar.component";
import { MyAppLayoutComponent } from "./customization/my-app-layout/my.layout.component";
import { MySidebarComponent } from "./customization/sidebar/my.sidebar.component";
import { MyMenuComponent } from "./customization/appmenu/my.menu.component";
import { ButtonModule } from "primeng/button";
import { SplitButtonModule } from "primeng/splitbutton";
import { ToggleButtonModule } from "primeng/togglebutton";

@NgModule({
  declarations: [
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppLayoutComponent,
    MyTopBarComponent,
    MyAppLayoutComponent,
    MySidebarComponent,
    MyMenuComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    InputTextModule,
    SidebarModule,
    BadgeModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,
    RouterModule,
    AppConfigModule,

    // ButtonDemoRoutingModule,
    ButtonModule,
    RippleModule,
    SplitButtonModule,
    ToggleButtonModule,
  ],
  exports: [
    AppLayoutComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppLayoutComponent,
    MyTopBarComponent,
    MyAppLayoutComponent,
    MySidebarComponent,
    MyMenuComponent,
  ],
})
export class AppLayoutModule {}
