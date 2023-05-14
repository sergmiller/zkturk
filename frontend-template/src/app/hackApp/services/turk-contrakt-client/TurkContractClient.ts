//@ts-nocheck
// Iteration with web3 Poker Room Contract.
import { getWeb3Accounts } from "./utils/blockchain";
import { CryptoContractClient } from "./CryptoContractClient";

const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_problemFee", type: "uint256" },
      { internalType: "uint256", name: "_problemStake", type: "uint256" },
      { internalType: "bool", name: "_useVerification", type: "bool" },
      { internalType: "contract IWorldID", name: "_worldId", type: "address" },
      { internalType: "string", name: "_appId", type: "string" },
      { internalType: "string", name: "_actionId", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "InvalidNullifier", type: "error" },
  { anonymous: false, inputs: [{ indexed: false, internalType: "address", name: "a", type: "address" }], name: "Console", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string[]", name: "urlToImgs", type: "string[]" },
      { internalType: "string[]", name: "asnwers", type: "string[]" },
      { internalType: "uint256", name: "workersMax", type: "uint256" },
      { internalType: "uint256", name: "taskPriceWei", type: "uint256" },
      { internalType: "uint256", name: "answersMax", type: "uint256" },
    ],
    name: "addProblem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "problemId", type: "uint256" }],
    name: "getProblem",
    outputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string[]", name: "urlToTask", type: "string[]" },
          { internalType: "string[]", name: "asnwers", type: "string[]" },
          { internalType: "uint256", name: "workersMax", type: "uint256" },
          { internalType: "uint256", name: "taskPriceWei", type: "uint256" },
          { internalType: "uint256", name: "answersMax", type: "uint256" },
        ],
        internalType: "struct ZkTurkContract.Problem",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProblems",
    outputs: [
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string[]", name: "urlToTask", type: "string[]" },
          { internalType: "string[]", name: "asnwers", type: "string[]" },
          { internalType: "uint256", name: "workersMax", type: "uint256" },
          { internalType: "uint256", name: "taskPriceWei", type: "uint256" },
          { internalType: "uint256", name: "answersMax", type: "uint256" },
        ],
        internalType: "struct ZkTurkContract.Problem[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "answer", type: "string" },
      { internalType: "uint256", name: "problemId", type: "uint256" },
    ],
    name: "isAnswerAllowed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "signer", type: "address" },
      { internalType: "string", name: "seedPhrase", type: "string" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "isValidSignature",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "problemId", type: "uint256" },
      { internalType: "address", name: "signal", type: "address" },
      { internalType: "uint256", name: "root", type: "uint256" },
      { internalType: "uint256", name: "nullifierHash", type: "uint256" },
      { internalType: "uint256[8]", name: "proof", type: "uint256[8]" },
    ],
    name: "joinProblem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "problemFee", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "problemStake", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  {
    inputs: [
      { internalType: "uint256", name: "problemId", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "problemToAnswers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "problems",
    outputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "workersMax", type: "uint256" },
      { internalType: "uint256", name: "taskPriceWei", type: "uint256" },
      { internalType: "uint256", name: "answersMax", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [], name: "renounceOwnership", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ internalType: "bool", name: "_state", type: "bool" }],
    name: "setUseVerification",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "problemId", type: "uint256" },
      { internalType: "uint256", name: "taskId", type: "uint256" },
      { internalType: "bytes", name: "cipheredAnswer", type: "bytes" },
    ],
    name: "solveTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "taskAnswers",
    outputs: [
      { internalType: "uint256", name: "problemId", type: "uint256" },
      { internalType: "uint256", name: "taskId", type: "uint256" },
      { internalType: "address", name: "worker", type: "address" },
      { internalType: "bytes", name: "cipheredAnswer", type: "bytes" },
      { internalType: "string", name: "answer", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "signer", type: "address" },
      { internalType: "string", name: "seed", type: "string" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "test",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "useVerification", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "worker", type: "address" },
      { internalType: "uint256", name: "problemId", type: "uint256" },
      { internalType: "uint256[]", name: "taskIds", type: "uint256[]" },
      { internalType: "string[]", name: "answers", type: "string[]" },
      { internalType: "string", name: "seedPhrase", type: "string" },
    ],
    name: "withdrawAndDecipher",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [], name: "withdrawAndForget", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "workerToProblemAnswers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

class ContractABC {
  constructor(web3, address = "0xD9245acA14c7E1985e8E16CB987Cd11C7b485c53") {
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

export class ProblemModel {
  constructor(id, owner, title, description, urlToTask, asnwers, workersMax, taskPriceWei, answersMax) {
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

const DEFAULT_SEED = "defaultSeed";

export class TurkContractClient extends ContractABC {
  _parseArrayToProblemModel(arrayToParse) {

    const data = [];
    for (let i = 1; i < arrayToParse.length; i++) {
      data.push(new ProblemModel(i,...arrayToParse[i]));
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
  async startProblem(problemId, signal, root, nullifierHash, proof) {
    const fee = await this._getStakeValue();
    let requestConfig = {
      method: "joinProblem",
      args: [problemId, signal, root, nullifierHash, proof],
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

  // Get next task to solve in the problem.
  async getNextTask(problemId) {
    const tasks = await this.getProblem(problemId);
    if (!this.kostil) {
      this.kostil = 0;
    }
    this.kostil += 1;
    if (this.kostil === tasks.length) {
      return null;
    }
    return tasks[this.kostil];
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
