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
import { CommonModule } from "@angular/common";
import { FormLayoutDemoRoutingModule } from "../demo/components/uikit/formlayout/formlayoutdemo-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { NewTaskLayoutComponent } from "../hackApp/layouts/new-task-layout/new-task-layout.component";
import { AllMyTasksLayoutComponent } from "../hackApp/layouts/all-my-tasks-layout/all-my-tasks-layout.component";
import { AvailableTasksLayoutComponent } from "../hackApp/layouts/available-tasks-layout/available-tasks-layout.component";
import { FileUploadModule } from "primeng/fileupload";
import { MyLandingComponent } from "../hackApp/layouts/my-landing/my-landing.component";
import { TaskCardComponent } from "../hackApp/components/task-card/task-card.component";
import { ReactWrapper } from "../hackApp/react/react-wrapper";
import { OpenedTaskComponent } from "../hackApp/components/opened-task/opened-task.component";

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
    NewTaskLayoutComponent,
    AllMyTasksLayoutComponent,
    AvailableTasksLayoutComponent,
    MyLandingComponent,
    TaskCardComponent,
    ReactWrapper,
    OpenedTaskComponent,
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

    CommonModule,
    FormLayoutDemoRoutingModule,
    AutoCompleteModule,
    CalendarModule,
    ChipsModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    CascadeSelectModule,
    MultiSelectModule,
    InputTextareaModule,
    FileUploadModule,
  ],
  exports: [
    // AppLayoutComponent,
    AppMenuitemComponent,
    // AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    MyTopBarComponent,
    MyAppLayoutComponent,
    MySidebarComponent,
    MyMenuComponent,
    MyLandingComponent,
    TaskCardComponent,
    OpenedTaskComponent,
  ],
})
export class AppLayoutModule {}
