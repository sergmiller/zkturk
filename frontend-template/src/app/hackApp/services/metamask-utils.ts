import { v4 as uuidv4 } from 'uuid';
import { Problem, ProblemTask, ProblemTaskLite } from '../models/models';

export class MetamaskUtils {
  public static formatBalance(rawBalance: string) {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
    return balance;
  }

  public static formatChainAsNum(chainIdHex: string) {
    const chainIdNum = parseInt(chainIdHex);
    return chainIdNum;
  }

  /** Generate new uuid identifer
   * @remark example '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
   */
  public static newGuid() {
    return uuidv4();
  }

  public static toClientProblem(serverProblem: any): Problem {
    return {
      id: serverProblem.id,
      title: serverProblem.title,
      priceForOne: serverProblem.taskPriceWei,
      overlap: serverProblem.workersMax,
      description: serverProblem.description,
      images: serverProblem.urlToTask,
      variants: serverProblem.asnwers,
    };
  }

  public static toClientProblems(serverProblems: any): Problem[] {
    return serverProblems.map((problem: any) => this.toClientProblem(problem));
  }

  // public static toClientTask(serverTask: any): ProblemTask {
  //   return {
  //     problemId: serverTask.problemId,
  //     taskId: serverTask.taskId,
  //     worker: serverTask.worker,
  //     cipheredAnswer: serverTask.cipheredAnswer,
  //     answer: serverTask.answer,
  //   };
  // }

  public static toClientTask(serverTask: any): ProblemTaskLite {
    return {
      taskId: serverTask.id,
      image: serverTask.url,
    };
  }

  // public static toWeb3Problems(problems: Problem[]): any {
  //   return problems.map((problem) => {
  //     return {
  //       owner: "", // address
  //       title: problem.title, // string
  //       description: problem.description, // string
  //       urlToTask: problem.images, // string[]
  //       asnwers: problem.variants, // string[]
  //       workersMax: problem.overlap, // uint
  //       taskPriceWei: problem.priceForOne, // uint
  //       answersMax: problem.variants.length, // uint
  //     };
  //   });
  // }
}
