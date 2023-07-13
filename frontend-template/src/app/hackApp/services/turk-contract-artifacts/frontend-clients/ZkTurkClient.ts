import {ZkTurk} from "../typechain-types";
import {BigNumber, ethers} from "ethers";
import {CryptoContractClient} from "./CryptoContractClient";
import {stringToBytes32} from "./utils";
import {TaskModel} from "./models";
import {log} from "./logger";


const DEFAULT_SEED = "defaultSeed";


export class ZkTurkClient {
    private contractAddress: string;
    public contract: ZkTurk;

    // TODO: uncomment to use strict annotation (but with library).
    // private signer: SignerWithAddress;
    private signer: ethers.providers.JsonRpcSigner | any;
    private cryptoContractClient: CryptoContractClient;
    private confirmations_number: number | undefined;

    constructor(
        signer: ethers.providers.JsonRpcSigner,
        abi: any,
        address: string,
        confirmations_number?: number,
    ) {
        // To prevent cross contract interaction.
        this.contractAddress = address
        this.signer = signer
        this.contract = new ethers.Contract(this.contractAddress, abi, signer) as ZkTurk;
        // TODO: debug if really connected.
        this.contract = this.contract.connect(signer)
        this.cryptoContractClient = new CryptoContractClient(signer, abi , this.contract.address)
        this.confirmations_number = confirmations_number
    }

    // convenience method to parse eth to wei.
    parseEthToWei(v: number) {
        return ethers.utils.parseEther(String(v));
    }

    // It parses to max 4 decimal places.
    parseWeiToEth(v: number | string) {
        const bigNumberV = BigNumber.from(v)
        const remainder = bigNumberV.mod(1e14);
        return ethers.utils.formatEther(bigNumberV.sub(remainder));
    }

    async getProblem(problemId: number) {
        return await this.contract.getProblem(problemId);
    }

    // TODO: solve in the upgrades.
    //  Currently, hack to not allow to work with problem with index 0.
    _filterProblems(problems: ZkTurk.ProblemStructOutput[]) {
        let filtered = []
        for (let i=0; i < problems.length; i++) {
            if (Number(problems[i].id) === 0) {
                //  pass
            } else {
                filtered.push(problems[i])
            }
        }
        return filtered
    }

    async getAvailableProblems() {
        // TODO: filter them if problems are joinable.
        const problems = await this.contract.getProblems()
        return this._filterProblems(problems)
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
          signal="", root = 123, nullifierHash = 456, proof = [1,2,3,4,5,6,7,8]
    ) {
        const fee = await this._getStakeValue();
        const options = {value: fee}
        const signerAddress = await this.signer.getAddress()
        const tx = await this.contract.joinProblem(
            problemId,
            signerAddress,
            root,
            nullifierHash,
            proof,
            options,
        )
        log(tx)
        return tx
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
        log('Contract problem fee: ' + feeEth.toString())
        return feeEth + taskPriceEth * answersMax * workersMax;
    }

  async createProblem(
      title: string, description: string, urlToTasks: Array<string>, answers: Array<string>,
      workersMax: number, taskPriceEth: number, answersMax: number,
  ) {
        const sumEth = await this.totalCostToCreateProblemEth(workersMax, taskPriceEth, answersMax);

        const taskPriceWei = ethers.utils.parseEther(taskPriceEth.toString());
        log("Sum eth to pay for problem creation:" + sumEth.toString())
        const weiToSend = ethers.utils.parseEther(sumEth.toString());
        log("Convert to wei to pay:" + weiToSend.toString())
        const options = {value: weiToSend}
        const tx = await this.contract.addProblem(
        title, description, urlToTasks, answers, workersMax, taskPriceWei, answersMax, options,
        )
        log(tx)
        return tx
    }

    // Get all tasks for the problem, those are not answered yet.
    async getAllTasks(problemId: number): Promise<TaskModel[]> {
        // TODO: make clever: e.g. batch of tasks.
        const problem = await this.getProblem(problemId)
        const taskUrls = problem.taskUrls
        // Filter them.
        let res = [] as TaskModel[]
        for (let i = 0; i < taskUrls.length; i++) {
            const notAnswered = await this.contract.isTaskNotAnsweredByWorker(problemId, i)
            res.push(
                {
                    id: i,
                    taskUrl: taskUrls[i],
                    alreadyAnswered: !notAnswered
                }
            )
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
        const res = await tx.wait(this.confirmations_number)
        const events = res.events
        if (events) {
            // @ts-ignore
            const taskAnswerId = events[0].args[3]
            log('Received taskAnswerId:' + taskAnswerId.toString())
            return taskAnswerId
        }
        throw Error('No task answer id received, no info if transaction submitte successfully.')
    }

    async withdraw(problemId: number, taskAnswerIds: Array<number>, answers: Array<string>, seed = DEFAULT_SEED) {
        // Convert seed.
        const seedBytes = stringToBytes32(seed)
        const signerAddress = await this.signer.getAddress()
        const tx = this.contract.withdrawAndDecipher(
            signerAddress, problemId, taskAnswerIds, answers, seedBytes,
        )
        log(tx)
        return tx
    }

    async resetActiveProblem() {
        const tx = await this.contract.resetActiveProblem()
        log(tx)
        return tx
    }

    // TODO: deprecated - use resetProblem
    async withdrawAndForget() {
        const tx = await this.resetActiveProblem()
        log(tx)
        return tx
    }
}
