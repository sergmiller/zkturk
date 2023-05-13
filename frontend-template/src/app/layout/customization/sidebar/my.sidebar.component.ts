import { Component, ElementRef } from "@angular/core";
import { LayoutService } from "../../service/app.layout.service";

@Component({
  selector: "my-sidebar",
  templateUrl: "./my.sidebar.component.html",
})
export class MySidebarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
