import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "../../service/app.layout.service";

@Component({
  selector: "my-menu",
  templateUrl: "./my.menu.component.html",
})
export class MyMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
        // {
        //   label: "Home",
        //   items: [{ label: "Home", icon: "pi pi-fw pi-home", routerLink: ["/"] }],
        // },

      {
        label: "My work",
        items: [{ label: "Available problems ", icon: "pi pi-fw pi-home", routerLink: ["/available-tasks"] }],
      },
      {
        label: "My business ",
        items: [
          { label: "Create problem", icon: "pi pi-fw pi-home", routerLink: ["/new-task"] },
          { label: "All my problems", icon: "pi pi-fw pi-home", routerLink: ["/all-my-tasks"] },
        ],
      },
    ];
  }
}
