import { Component } from "@angular/core";
import { MyEventService } from "../../services/event.service";

@Component({
  selector: "app-available-tasks-layout",
  templateUrl: "./available-tasks-layout.component.html",
  styleUrls: ["./available-tasks-layout.component.scss"],
})
export class AvailableTasksLayoutComponent {
  public tasks = [1, 2, 3];

  public openedTask: any;

  constructor(private eventService: MyEventService) {
    this.eventService.startTaskEvent.subscribe((data) => {
      this.openTask(data);
    });
  }

  private openTask(task: any) {
    console.log("%copenTask: ", "color: red", task);
    this.openedTask = task;
  }
}
