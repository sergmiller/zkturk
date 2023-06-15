//@ts-nocheck
// Iteration with web3 Poker Room Contract.
import Web3 from "web3";
import { CryptoContractClient } from "./CryptoContractClient";
import {Contract, ContractOptions} from 'web3-eth-contract';
import {AbiItem} from 'web3-utils';
import { ProblemModelInterface } from "./models";
import { CONTRACT_ABI } from "./contract-abi";

export async function getWeb3Accounts(web3: Web3, userAddress: string | null = null) {
  let addrs = await web3.eth.getAccounts();
  if (userAddress) {
      addrs = addrs.filter(obj => {
          return obj.toLowerCase() === userAddress.toLowerCase()
      })
  }
  return addrs
}

class ContractABC {
  private web3: Web3;
  private address: string;
  private contractObj: Contract

  constructor(web3: Web3, address = "0xD9245acA14c7E1985e8E16CB987Cd11C7b485c53") {
    // def to polygon.
    this.address = address;
    this.web3 = web3;
    this.contractObj = new web3.eth.Contract(CONTRACT_ABI, this.address);
  }

  async _callMethod(config, method = "send", userAddress = null) {
    console.log("calling method with config: " + JSON.stringify(config));
    if (method === "send") {
      return await this._sendMethodImpl(config["method"], config["args"], config["value"], userAddress);
    }
    return await this._callMethodImpl(config["method"], config["args"], config["value"], userAddress);
  }

  async _buildMethod(method, args) {
    let methodInstance = this.contractObj.methods[method];
    return methodInstance(...args);
  }

  async _sendMethodImpl(method, args, value, userAddress = null) {
    const [sender] = await getWeb3Accounts(this.web3, userAddress);
    console.log("sender is " + sender);
    console.log("contract address is " + this.address);
    console.log("method is " + method);
    console.log("value is " + value);
    let methodFunc = await this._buildMethod(method, args);
    const tx = await methodFunc.send({
      from: sender,
      value: value,
      gas: 1000000, // TODO: but in metamask ypu could make it yourself
      gasPrice: this.web3.utils.toWei("2", "gwei"), // TODO: but in metamask ypu could make it yourself
    });
    console.log("tx: ", tx);
    return tx;
  }

  async _callMethodImpl(method, args, value, userAddress = null) {
    console.log("Calling contract instead of tx sending...");
    const [sender] = await getWeb3Accounts(this.web3, userAddress);
    console.log("sender is " + sender);
    console.log("method is " + method);
    let methodFunc = await this._buildMethod(method, args);
    const tx = await methodFunc.call();
    console.log("tx: ", tx);
    return tx;
  }

  async _getEvents(eventName, filterDict) {
    console.log("Fetch events with eventName ", eventName);
    console.log("Fetch events with filterDict ", filterDict);
    const events = await this.contractObj.getPastEvents(eventName, {
      filter: filterDict,
      fromBlock: 0, // coz under the hood getPastEvents remembers last fetch.
    });
    console.log("Fetched events, got", events);
    return events;
  }
}

export class ProblemModel implements ProblemModelInterface {
  id: number;
  owner: string;
  title: string;
  description: string;
  urlToTask: string[];
  asnwers: string[];
  workersMax: number;
  taskPriceWei: number;
  answersMax: number;

  constructor(id: any, owner: any, title: any, description: any, urlToTask: any, asnwers: any, workersMax: any, taskPriceWei: any, answersMax: any) {
    this.id = id
    this.owner = owner; // address
    this.title = title; // string
    this.description = description; // string
    this.urlToTask = urlToTask; // string[]
    this.asnwers = asnwers; // string[]
    this.workersMax = workersMax; // uint
    this.taskPriceWei = taskPriceWei; // uint
    this.answersMax = answersMax; // uint
  }
}

class TaskModel {
  constructor(problemId, taskId, worker, cipheredAnswer, answer) {
    this.problemId = problemId; // uint
    this.taskId = taskId; // uint
    this.worker = worker; // address
    this.cipheredAnswer = cipheredAnswer; // bytes
    this.answer = answer; // string
  }
}

class TaskOptionModel {
    constructor(id, url) {
        this.id = id; // uint
        this.url = url; // string
    }
}

const DEFAULT_SEED = "defaultSeed";

export class TurkContractClient extends ContractABC {
  _parseArrayToProblemModel(arrayToParse) {
    const data = [];
    for (let i = 1; i < arrayToParse.length; i++) {
      data.push(new ProblemModel(i,...arrayToParse[i]));
    }
    return data;
  }

  _parseArrayToModel(arrayToParse, model) {
    const data = [];
    for (let i = 0; i < arrayToParse.length; i++) {
      data.push(new model(i,arrayToParse[i]));
    }
    return data;
  }

  // convenience method to parse to eth.
  parseToEth(v) {
    return this.web3.utils.fromWei(v);
  }

  parseToWei(v) {
    return this.web3.utils.toWei(v, "ether");
  }

  async getProblem(problemId) {
    let requestConfig = {
      method: "getProblem",
      args: [problemId],
      value: 0,
    };
    let res = (await this._callMethod(requestConfig, "call")) || [];
    return new ProblemModel(problemId,...res);
  }

  async getAvailableProblems() {
    let requestConfig = {
      method: "getProblems",
      args: [],
      value: 0,
    };
    let res = (await this._callMethod(requestConfig, "call")) || [];
    return this._parseArrayToProblemModel(res);
  }

  // Stake is a returnable fee for worker, in wei.
  async _getStakeValue() {
    let requestConfig = {
      method: "problemStake",
      args: [],
      value: 0,
    };
    return await this._callMethod(requestConfig, "call");
  }

  // Business paid for the problem a little fee described in contract.
  async _getProblemFee() {
    let requestConfig = {
      method: "problemFee",
      args: [],
      value: 0,
    };
    return await this._callMethod(requestConfig, "call");
  }

  // uint problemId,
  // address signal,
  // uint256 root,
  // uint256 nullifierHash,
  // uint256[8] calldata proof
  async startProblem(problemId, signal="", root = 123, nullifierHash = 456, proof = [1,2,3,4,5,6,7,8]) {
    const fee = await this._getStakeValue();
    let requestConfig = {
      method: "joinProblem",
      args: [problemId, this.address, root, nullifierHash, proof], // TODO
      value: fee,
    };
    return await this._callMethod(requestConfig, "send");
  }

  async getAllMyProblems() {
    const problems = await this.getAvailableProblems();
    const [myAddress] = await getWeb3Accounts(this.web3);

    const data = [];
    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      if (problem.owner !== myAddress) {
        continue;
      }
      data.push(problem);
    }
    return data;
  }

  async totalCostToCreateProblemEth(workersMax, taskPriceEth, answersMax) {
    const feeEth = Number(this.parseToEth(await this._getProblemFee()));
    return feeEth + taskPriceEth * answersMax * workersMax;
  }

  async createProblem(title, description, urlToTask, asnwers, workersMax, taskPriceEth, answersMax) {
    const sumEth = await this.totalCostToCreateProblemEth(workersMax, taskPriceEth, answersMax);

    const taskPriceWei = this.parseToWei(taskPriceEth.toString());
    const weiToSend = this.parseToWei(sumEth.toString());
    let requestConfig = {
      method: "addProblem",
      args: [title, description, urlToTask, asnwers, workersMax, taskPriceWei, answersMax],
      value: weiToSend,
    };
    return await this._callMethod(requestConfig, "send");
  }

  // TODO: not implemented.
  // For the user tasks those have already solved.
  async getAlreadySolvedTasks(problemId) {
    // const [myAddress,] = await getWeb3Accounts(this.web3);
    // let requestConfig = {
    //     "method": "workerToProblemAnswers",
    //     "args": [myAddress, problemId],
    //     "value": 0
    // }
    // return await this._callMethod(requestConfig, 'call')
    // const workerToProblemAnswers = await contract.workerToProblemAnswers(defaultWorker.address, 1, 0)
    // console.log('workerToProblemAnswers', workerToProblemAnswers.toString())
  }

  // Get all tasks for the problem, those are not answered yet.
    // Returns string[]
  async getAllTasks(problemId) {
      const problem = await this.getProblem(problemId)
      // TODO: filter for solved.
      return this._parseArrayToModel(problem.urlToTask, TaskOptionModel)
  }

  // Get next task to solve in the problem.
  async getNextTask(problemId) {
    this.kostil = this.kostil || 0
    const allTasks = await this.getAllTasks(problemId)
    console.log('this.kostil', this.kostil)
    if (this.kostil == allTasks.length) {
      return
    }
    const res = allTasks[this.kostil]
    this.kostil += 1
    return res

  }

  async getJoinedProblem() {
    const [myAddress] = await getWeb3Accounts(this.web3);
    console.log('myAddress', myAddress)
    let requestConfig = {
      method: "workerToProblem",
      args: [myAddress],
      value: 0,
    };
    const res = await this._callMethod(requestConfig, "call")
    if (!res) {
      return
    }
    return Number(res)

  }

  // TODO: not implemented.
  async getEarnedEth() {}

  async solveTask(problemId, taskId, answer, seed = DEFAULT_SEED) {
    const [myAddress] = await getWeb3Accounts(this.web3);
    const cryptoContractClient = new CryptoContractClient(this.web3, myAddress, this.address);
    const cipheredAnswer = await cryptoContractClient.getSignedMessage(answer, seed);

    let requestConfig = {
      method: "solveTask",
      args: [problemId, taskId, cipheredAnswer],
      value: 0,
    };
    return await this._callMethod(requestConfig, "send");
  }

  async withdraw(problemId, taskIds, answers, seed = DEFAULT_SEED) {
    const [myAddress] = await getWeb3Accounts(this.web3);
    let requestConfig = {
      method: "withdrawAndDecipher",
      args: [myAddress, problemId, taskIds, answers, seed],
      value: 0,
    };
    // .withdrawAndDecipher(defaultWorker.address, 1, [0], [DEF_ASNWERS[0]], DEF_SEED)
    return await this._callMethod(requestConfig, "send");
  }

  async withdrawAndForget() {
    let requestConfig = {
      method: "withdrawAndForget",
      args: [],
      value: 0,
    };
    return await this._callMethod(requestConfig, "send");
  }
}

// window.TurkContractClient = TurkContractClient
