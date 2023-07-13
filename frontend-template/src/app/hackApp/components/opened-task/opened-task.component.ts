import { Component, Input, OnInit } from '@angular/core';
import { MyEventService } from '../../services/event.service';
import { MetamaskProviderService } from '../../services/metamask-provider.service';
import { Problem, ProblemTaskLite } from '../../models/models';
import { MetamaskUtils } from '../../services/metamask-utils';

@Component({
  selector: 'app-opened-task',
  templateUrl: './opened-task.component.html',
  styleUrls: ['./opened-task.component.scss'],
})
export class OpenedTaskComponent implements OnInit {
  private resultAnswers: {
    taskId: number;
    answer: string;
  }[] = [];

  public variants: string[] | undefined;
  public innerProblem: Problem | undefined;

  @Input() public set problem(value: Problem | undefined) {
    this.innerProblem = value;
    this.variants = this.innerProblem!.variants;
  }

  constructor(
    private eventService: MyEventService,
    private provider: MetamaskProviderService,
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }

  // public get currentTaskIndex() {
  //   return this.tasks.findIndex((task) => task.taskId === this.currentTask?.taskId) + " / " + this.tasks.length;
  // }

  public get currentTaskIndex() {
    const currentTaskId = this._getCurrentTaskId();
    if (currentTaskId !== undefined) {
      return currentTaskId + 1 + ' / ' + this.tasks.length;
    }
      return ''
  }

  closeTask() {
    this.eventService.startTaskEvent.next(undefined);
  }

  public tasks: ProblemTaskLite[] = [];

  // public tasks: ProblemTaskLite[] = [
  //   {
  //     taskId: 1,
  //     image: "assets/test-images/cat.jpg",
  //   },
  //   {
  //     taskId: 2,
  //     image: "assets/test-images/dog.jpg",
  //   },
  //   {
  //     taskId: 3,
  //     image: "assets/test-images/cat.jpg",
  //   },
  // ];

  public currentTask: ProblemTaskLite | undefined;

  private _getCurrentTaskId () {
    for (let i=0; i < this.tasks.length; i++) {
      if (!this.tasks[i].answered) {
        return i
      }
    }
    return undefined
  }

  private _getCurrentTask () {
    const idx = this._getCurrentTaskId()
    if (idx) {
      return this.tasks[idx]
    }
    return undefined
  }

  private async getTasks() {
    if (!this.innerProblem?.id) {
      console.log('problem is undefined');
      return;
    }
    console.log('this.problem', this.innerProblem);

    const serverTasks = await this.provider.getTurkContraksClient?.getAllTasks(+this.innerProblem.id);
    console.log('serverTasks: ', serverTasks);
    if (serverTasks) {
      this.tasks = serverTasks.map((task) => MetamaskUtils.toClientTask(task));
      this.currentTask = this._getCurrentTask();
    }
  }

  public async selectVariant(task: ProblemTaskLite, variant: string) {
    if (!this.innerProblem?.id) {
      console.log('problem is undefined');
      return;
    }
    await this.provider.getTurkContraksClient?.solveTask(+this.innerProblem.id, task.taskId, variant);
    // Refresh tasks from chain.
    await this.getTasks()

    this.resultAnswers.push({
      taskId: task.taskId,
      answer: variant,
    });
    this.currentTask = this._getCurrentTask();
  }

  public async completeProblem() {
    if (!this.innerProblem?.id) {
      console.log('problem is undefined');
      return;
    }

    const taskIds = this.resultAnswers.map((answer) => answer.taskId);
    const taskAnswers = this.resultAnswers.map((answer) => answer.answer);
    console.log('this.problem?.id: ', this.innerProblem?.id, ' taskIds: ', taskIds, ' taskAnswers: ', taskAnswers);

    // await this.provider.getTurkContraksClient?.withdraw(+this.innerProblem.id, taskIds, taskAnswers);
    await this.provider.getTurkContraksClient?.withdrawAndForget();

    this.eventService.startTaskEvent.next(undefined);
  }
}
