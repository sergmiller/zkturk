import { Component, Input } from "@angular/core";
import { MyEventService } from "../../services/event.service";

interface SutTask {
  id: number;
  image: string;
  selectedVariand: string;
}

@Component({
  selector: "app-opened-task",
  templateUrl: "./opened-task.component.html",
  styleUrls: ["./opened-task.component.scss"],
})
export class OpenedTaskComponent {
  @Input() public task: any;

  constructor(private eventService: MyEventService) {}

  closeTask() {
    this.eventService.startTaskEvent.next(undefined);
  }

  public sutTasks = [
    {
      id: 1,
      image: "assets/test-images/cat.jpg",
      selectedVariand: "",
    },
    {
      id: 2,
      image: "assets/test-images/dog.jpg",
      selectedVariand: "",
    },
    {
      id: 3,
      image: "assets/test-images/cat.jpg",
      selectedVariand: "",
    },
  ];

  public variants = ["dog", "cat"];

  public completeTask() {
    this.eventService.startTaskEvent.next(undefined);
  }
}
