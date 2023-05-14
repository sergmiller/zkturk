import { Component, Input } from "@angular/core";
import { Interface } from "readline";

enum TaskMode {
  "",
}

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent {
  @Input() public task: any;

  @Input() public disableButton: boolean = false;
}
