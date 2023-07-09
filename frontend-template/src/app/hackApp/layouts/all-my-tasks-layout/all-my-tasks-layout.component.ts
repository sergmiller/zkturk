import { Component } from '@angular/core';
import { MyEventService } from '../../services/event.service';
import { Problem } from '../../models/models';
import { MetamaskStateService } from '../../services/metamask-state.service';
import { MetamaskUtils } from '../../services/metamask-utils';
import { reaction } from 'mobx';

@Component({
  selector: 'app-all-my-tasks-layout',
  templateUrl: './all-my-tasks-layout.component.html',
  styleUrls: ['./all-my-tasks-layout.component.scss'],
})
export class AllMyTasksLayoutComponent {
  public problems: Problem[] = [];

  constructor(
    private eventService: MyEventService,
    private stateService: MetamaskStateService,
  ) {
    if (this.stateService.myProblems?.length) {
      this.problems = MetamaskUtils.toClientProblems(this.stateService.myProblems);
    }

    reaction(
      () => this.stateService.myProblems,
      (myProblems) => {
        console.log('%cavalibleProblems reaction: ', 'color: red', myProblems);
        this.problems = MetamaskUtils.toClientProblems(myProblems);
      },
    );
  }

  // public openedTask: any;

  // constructor(private eventService: MyEventService) {
  //   this.eventService.startTaskEvent.subscribe((data) => {
  //     this.openTask(data);
  //   });
  // }

  // private openTask(task: any) {
  //   console.log("openTask: ", task);
  //   this.openedTask = task;
  // }
}
