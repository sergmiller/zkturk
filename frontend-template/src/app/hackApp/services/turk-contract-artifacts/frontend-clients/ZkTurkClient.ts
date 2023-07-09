import {ZkTurk} from "../typechain-types";
import {ethers} from "ethers";
import {CryptoContractClient} from "./CryptoContractClient";
import {stringToBytes32} from "./utils";


const DEFAULT_SEED = "defaultSeed";

export class ZkTurkClient {
    private contractAddress: string;
    public contract: ZkTurk;

    // TODO: uncomment to use strict annotation (but with library).
    // private signer: SignerWithAddress;
    private signer: ethers.providers.JsonRpcSigner | any;
    private cryptoContractClient: CryptoContractClient;

    constructor(signer: ethers.providers.JsonRpcSigner, abi: any, address: string) {
        // To prevent cross contract interaction.
        this.contractAddress = address
        this.signer = signer
        this.contract = new ethers.Contract(this.contractAddress, abi, signer) as ZkTurk;
        // TODO: debug if really connected.
        this.contract = this.contract.connect(signer)
        this.cryptoContractClient = new CryptoContractClient(signer, abi , this.contract.address)
    }

    // ethers.utils.parseEther("0.05")
    // convenience method to parse to eth.
    // parseToEth(v) {
    //   return this.web3.utils.fromWei(v);
    // }
    //
    // parseToWei(v) {
    //   return this.web3.utils.toWei(v, "ether");
    // }

    async getProblem(problemId: number) {
        return await this.contract.getProblem(problemId);
    }

    async getAvailableProblems() {
        // TODO: filter them if problems are joinable.
        return await this.contract.getProblems()
    }

  // Stake is a returnable fee for worker, in wei.
    async _getStakeValue() {
        return await this.contract.problemStake()
    }

    // Business paid for the problem a little fee described in contract.
    async _getProblemFee() {
        return await this.contract.problemFee()
    }

  // uint problemId,
  // address signal,
  // uint256 root,
  // uint256 nullifierHash,
  // uint256[8] calldata proof
  // TODO: rename to join.
  // TODO: signal not needed.
    async startProblem(
          problemId: number,
          signal="", root = 123, nullifierHash = 456, proof = [1,2,3,4,5,6,7,8]) {
        const fee = await this._getStakeValue();
        const options = {value: fee}
        const signerAddress = await this.signer.getAddress()
        return await this.contract.joinProblem(
            problemId,
            signerAddress,
            root,
            nullifierHash,
            proof,
            options,
        )
    }

    async getUserCreatedProblems() {
        return await this.getAllMyProblems()
    }

    // Get all created Problems.
    // TODO: deprecate
    async getAllMyProblems() {
        const problems = await this.getAvailableProblems();

        const data = [];
        for (let i = 0; i < problems.length; i++) {
        const problem = problems[i];
        const signerAddress = await this.signer.getAddress()
        if (problem.owner !== signerAddress) {
          continue;
        }
          data.push(problem);
        }
        return data;
    }

    async getJoinedProblem() {
        const signerAddress = await this.signer.getAddress()
        return await this.contract.workerToProblem(signerAddress)
    }

    async totalCostToCreateProblemEth(workersMax: number, taskPriceEth: number, answersMax: number) {
        const problemFee = await this._getProblemFee()
        const feeEth = Number(ethers.utils.formatEther((problemFee).toString()));
        return feeEth + taskPriceEth * answersMax * workersMax;
    }

  async createProblem(
      title: string, description: string, urlToTasks: Array<string>, answers: Array<string>,
      workersMax: number, taskPriceEth: number, answersMax: number,
  ) {
    const sumEth = await this.totalCostToCreateProblemEth(workersMax, taskPriceEth, answersMax);

    const taskPriceWei = ethers.utils.parseEther(taskPriceEth.toString());
    const weiToSend = ethers.utils.parseEther(sumEth.toString());
    const options = {value: weiToSend}
    return await this.contract.addProblem(
        title, description, urlToTasks, answers, workersMax, taskPriceWei, answersMax, options,
    )
  }

  // Get all tasks for the problem, those are not answered yet.
    async getAllTasks(problemId: number) {
        // TODO: make clever: e.g. batch of tasks.
        const problem = await this.getProblem(problemId)
        const taskUrls = problem.taskUrls
        // Filter them.
        let res = []
        for (let i = 0; i < taskUrls.length; i++) {
            const notAnswered = await this.contract.isTaskNotAnsweredByWorker(problemId, i)
            if (!notAnswered) {
                continue
            }
            res.push({
                id: i,
                taskUrl: taskUrls[i],
            })
        }
        return res
    }

  // // TODO: not implemented.
  // async getEarnedEth() {}

    // Solve task and get id of submitted taskAnswer.
    // PS. this id should be submitte in the withdraw.
    // TODO: implement return value of taskAnswerId from contract.
    async solveTask(problemId: number, taskId: number, answer: string, seed = DEFAULT_SEED) {
        // Convert seed.
        const seedBytes = stringToBytes32(seed)
        const cipheredAnswer = await this.cryptoContractClient.getSignedMessage(seedBytes, answer)
        const tx = await this.contract.solveTask(problemId, taskId, cipheredAnswer)
        const res = await tx.wait()  // TODO: add default confirmation number.
        const events = res.events
        if (events) {
            // @ts-ignore
            const taskAnswerId = events[0].args[3]
            console.log('Received taskAnswerId:', taskAnswerId)
            return taskAnswerId
        }
        throw Error('No task answer id received, no info if transaction submitte successfully.')
    }

    async withdraw(problemId: number, taskAnswerIds: Array<number>, answers: Array<string>, seed = DEFAULT_SEED) {
        // Convert seed.
        const seedBytes = stringToBytes32(seed)
        const signerAddress = await this.signer.getAddress()
        await this.contract.withdrawAndDecipher(
            signerAddress, problemId, taskAnswerIds, answers, seedBytes,
        )
    }

    async resetActiveProblem() {
        await this.contract.resetActiveProblem()
    }

    // TODO: deprecated - use resetProblem
    async withdrawAndForget() {
        return await this.resetActiveProblem()
    }
}
