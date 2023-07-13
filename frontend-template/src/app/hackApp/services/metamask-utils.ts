import { v4 as uuidv4 } from 'uuid';
import { Problem, ProblemTaskLite } from '../models/models';
import {TaskModel} from "./turk-contract-artifacts/frontend-clients/models";
import {ZkTurk} from "./turk-contract-artifacts/typechain-types";

export class MetamaskUtils {
  public static formatBalance(rawBalance: string, fixedDigits: number = 2) {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(fixedDigits);
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

  public static toClientProblem(serverProblem: ZkTurk.ProblemStructOutput): Problem {
    return {
      id: serverProblem.id.toNumber(),
      title: serverProblem.title,
      priceForOne: Number(this.formatBalance(serverProblem.taskPriceWei.toString(), 16)),
      overlap: serverProblem.workersMax.toNumber(),
      description: serverProblem.description,
      images: serverProblem.taskUrls,
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

  public static toClientTask(serverTask: TaskModel): ProblemTaskLite {
    return {
      taskId: serverTask.id,
      image: serverTask.taskUrl,
      answered: serverTask.alreadyAnswered,
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
