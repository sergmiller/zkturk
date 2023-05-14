import { Component, Input } from "@angular/core";
import { Interface } from "readline";
import { MyEventService } from "../../services/event.service";
import { Problem } from "../../models/models";
import { MetamaskProviderService } from "../../services/metamask-provider.service";

@Component({
  selector: "app-task-card",
  templateUrl: "./task-card.component.html",
  styleUrls: ["./task-card.component.scss"],
})
export class TaskCardComponent {
  @Input() public disableButton: boolean = false;

  @Input() public set task(task: Problem) {
    console.log("set task: ", task);
    this.innerTask = task;
  }

  public innerTask: Problem | undefined;

  constructor(private eventService: MyEventService, private provider:  MetamaskProviderService) {}

  public async startTask() {
    console.log("startTask in task: ", this.innerTask);
    await this.provider.getTurkContraksClient?.withdrawAndForget()
    await this.provider.getTurkContraksClient?.startProblem(this.innerTask?.id)

    this.eventService.startTaskEvent.next(this.innerTask);
  }
}
