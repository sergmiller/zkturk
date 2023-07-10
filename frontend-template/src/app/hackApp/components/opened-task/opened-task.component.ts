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
  @Input() public set problem(value: Problem | undefined) {
    this.innerProblem = value;
  }

  public innerProblem: Problem | undefined;

  public taskCounter: number = 0;

  private resultAnswers: {
    taskId: number;
    answer: string;
  }[] = [];

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
    if (this.taskCounter < this.tasks.length) {
      return this.taskCounter + 1 + ' / ' + this.tasks.length;
    } else {
      return this.taskCounter + ' / ' + this.tasks.length;
    }
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

  public variants = ['dog', 'cat'];

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
      this.currentTask = this.tasks[this.taskCounter];
    }
  }

  public async selectVariant(task: ProblemTaskLite, variant: string) {
    if (!this.innerProblem?.id) {
      console.log('problem is undefined');
      return;
    }
    await this.provider.getTurkContraksClient?.solveTask(+this.innerProblem.id, task.taskId, variant);

    this.resultAnswers.push({
      taskId: task.taskId,
      answer: variant,
    });
    if (this.taskCounter < this.tasks.length) {
      this.taskCounter++;
      this.currentTask = this.tasks[this.taskCounter];
    } else {
      this.taskCounter = 0;
      this.currentTask = undefined;
    }
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
