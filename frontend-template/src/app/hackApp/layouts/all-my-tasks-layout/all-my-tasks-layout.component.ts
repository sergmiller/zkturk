import { Component } from "@angular/core";
import { MyEventService } from "../../services/event.service";

@Component({
  selector: "app-all-my-tasks-layout",
  templateUrl: "./all-my-tasks-layout.component.html",
  styleUrls: ["./all-my-tasks-layout.component.scss"],
})
export class AllMyTasksLayoutComponent {
  public tasks = [1, 2, 3];

  public openedTask: any;

  constructor(private eventService: MyEventService) {
    this.eventService.startTaskEvent.subscribe((data) => {
      this.openTask(data);
    });
  }

  private openTask(task: any) {
    this.openedTask = task;
  }
}
