import { Component, Input } from "@angular/core";
import { Interface } from "readline";
import { MyEventService } from "../../services/event.service";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent {
  @Input() public disableButton: boolean = false;

  @Input() public set task(task: any) {
    this.innerTask = task;
  }

  public innerTask: any;

  constructor(private eventService: MyEventService) {}

  public startTask() {
    console.log("startTask in task: ", this.innerTask);
    this.eventService.startTaskEvent.next(this.innerTask);
  }
}
