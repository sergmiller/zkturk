import { Component } from '@angular/core';
import { MyEventService } from '../../services/event.service';
import { MetamaskStateService } from '../../services/metamask-state.service';
import { reaction } from 'mobx';
import { MetamaskUtils } from '../../services/metamask-utils';
import { Problem } from '../../models/models';

@Component({
  selector: 'app-available-tasks-layout',
  templateUrl: './available-tasks-layout.component.html',
  styleUrls: ['./available-tasks-layout.component.scss'],
})
export class AvailableTasksLayoutComponent {
  public problems: Problem[] = [];

  public openedTask: Problem | undefined;

  constructor(
    private eventService: MyEventService,
    private stateService: MetamaskStateService,
  ) {
    this.eventService.startTaskEvent.subscribe((data: Problem) => {
      this.openTask(data);
    });

    if (this.stateService.avalibleProblems?.length) {
      this.problems = MetamaskUtils.toClientProblems(this.stateService.avalibleProblems);
    }

    reaction(
      () => this.stateService.avalibleProblems,
      (avalibleProblems) => {
        console.log('%cavalibleProblems reaction: ', 'color: red', avalibleProblems);
        this.problems = MetamaskUtils.toClientProblems(avalibleProblems);
      },
    );

    if (this.stateService.joinedProblemId) {
      this.updateOpenedTask(this.stateService.joinedProblemId);
    }
    reaction(
      () => this.stateService.joinedProblemId,
      (joinedProblemId) => {
        console.log('%cjoinedProblemId reaction: ', 'color: red', joinedProblemId);
        this.updateOpenedTask(joinedProblemId);
      },
    );
  }

  private openTask(task: Problem) {
    console.log('%copenTask: ', 'color: red', task);
    this.openedTask = task;
  }

  private updateOpenedTask(joinedProblemId: number | undefined) {
    if (joinedProblemId) {
      console.log('joinedProblemId: ', joinedProblemId);
      console.log('this.stateService.avalibleProblems: ', this.stateService.avalibleProblems);
      const joinedProblem = this.stateService.avalibleProblems.find((problem) => (problem as any).id === joinedProblemId);
      console.log('joinedProblem: ', joinedProblem);
      this.openedTask = joinedProblem ? MetamaskUtils.toClientProblem(joinedProblem) : undefined;
    }
  }
}
