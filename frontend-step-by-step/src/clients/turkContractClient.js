// Iteration with web3 Poker Room Contract.
import {getWeb3Accounts} from "../utils/blockchain";

const CONTRACT_ABI = [ { "inputs": [ { "internalType": "uint256", "name": "_problemFee", "type": "uint256" }, { "internalType": "uint256", "name": "_problemStake", "type": "uint256" }, { "internalType": "bool", "name": "_useVerification", "type": "bool" }, { "internalType": "contract IWorldID", "name": "_worldId", "type": "address" }, { "internalType": "string", "name": "_appId", "type": "string" }, { "internalType": "string", "name": "_actionId", "type": "string" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "InvalidNullifier", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "a", "type": "address" } ], "name": "Console", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [ { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string[]", "name": "urlToImgs", "type": "string[]" }, { "internalType": "string[]", "name": "asnwers", "type": "string[]" }, { "internalType": "uint256", "name": "workersMax", "type": "uint256" }, { "internalType": "uint256", "name": "taskPriceWei", "type": "uint256" }, { "internalType": "uint256", "name": "answersMax", "type": "uint256" } ], "name": "addProblem", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getProblems", "outputs": [ { "components": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string[]", "name": "urlToTask", "type": "string[]" }, { "internalType": "string[]", "name": "asnwers", "type": "string[]" }, { "internalType": "uint256", "name": "workersMax", "type": "uint256" }, { "internalType": "uint256", "name": "taskPriceWei", "type": "uint256" }, { "internalType": "uint256", "name": "answersMax", "type": "uint256" } ], "internalType": "struct ZkTurkContract.Problem[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "answer", "type": "string" }, { "internalType": "uint256", "name": "problemId", "type": "uint256" } ], "name": "isAnswerAllowed", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "string", "name": "seedPhrase", "type": "string" }, { "internalType": "bytes", "name": "signature", "type": "bytes" } ], "name": "isValidSignature", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "problemId", "type": "uint256" }, { "internalType": "address", "name": "signal", "type": "address" }, { "internalType": "uint256", "name": "root", "type": "uint256" }, { "internalType": "uint256", "name": "nullifierHash", "type": "uint256" }, { "internalType": "uint256[8]", "name": "proof", "type": "uint256[8]" } ], "name": "joinProblem", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "problemId", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "problemToAnswers", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "problems", "outputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "uint256", "name": "workersMax", "type": "uint256" }, { "internalType": "uint256", "name": "taskPriceWei", "type": "uint256" }, { "internalType": "uint256", "name": "answersMax", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "problemId", "type": "uint256" }, { "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "internalType": "bytes", "name": "cipheredAnswer", "type": "bytes" } ], "name": "solveTask", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "taskAnswers", "outputs": [ { "internalType": "uint256", "name": "problemId", "type": "uint256" }, { "internalType": "uint256", "name": "taskId", "type": "uint256" }, { "internalType": "address", "name": "worker", "type": "address" }, { "internalType": "bytes", "name": "cipheredAnswer", "type": "bytes" }, { "internalType": "string", "name": "answer", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "string", "name": "seed", "type": "string" }, { "internalType": "bytes", "name": "signature", "type": "bytes" } ], "name": "test", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "worker", "type": "address" }, { "internalType": "uint256", "name": "problemId", "type": "uint256" }, { "internalType": "string", "name": "answer", "type": "string" }, { "internalType": "string", "name": "seedPhrase", "type": "string" } ], "name": "withdrawAndDecipher", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "workerToProblemAnswers", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]


class ContractABC {
    constructor(web3, address) {
        this.address = address
        this.web3 = web3
        this.contractObj = new web3.eth.Contract(CONTRACT_ABI, this.address)
    }

    async _callMethod(config, method="send", userAddress=null) {
        console.log("calling method with config: " + JSON.stringify(config));
        if (method === "send") {
            return await this._sendMethodImpl(
                config["method"],
                config["args"],
                config["value"],
                userAddress
            );
        }
        return await this._callMethodImpl(
            config["method"],
            config["args"],
            config["value"],
            userAddress
        );
    }

    async _buildMethod(method, args) {
        let methodInstance = this.contractObj.methods[method];
        return methodInstance(...args);
    }

    async _sendMethodImpl(method, args, value, userAddress=null) {
        const [sender] = await getWeb3Accounts(this.web3, userAddress);
        console.log("sender is " + sender);
        console.log("contract address is " + this.address)
        console.log("method is " + method);
        console.log("value is " + value);
        let methodFunc = await this._buildMethod(method, args)
        const tx = await methodFunc.send({
            from: sender,
            value: value,
            gas: 1000000,  // TODO: but in metamask ypu could make it yourself
            gasPrice: this.web3.utils.toWei('2', 'gwei')  // TODO: but in metamask ypu could make it yourself
        })
        console.log("tx: ", tx)
        return tx
    }

    async _callMethodImpl(method, args, value, userAddress=null) {
        console.log('Calling contract instead of tx sending...');
        const [sender] = await getWeb3Accounts(this.web3, userAddress);
        console.log("sender is " + sender);
        console.log("method is " + method);
        let methodFunc = await this._buildMethod(method, args)
        const tx = await methodFunc.call()
        console.log("tx: ", tx)
        return tx
    }

    async _getEvents(eventName, filterDict) {
        console.log('Fetch events with eventName ', eventName)
        console.log('Fetch events with filterDict ', filterDict)
        const events = await this.contractObj.getPastEvents(
            eventName,
            {
                filter: filterDict,
                fromBlock: 0,  // coz under the hood getPastEvents remembers last fetch.
            },
        );
        console.log('Fetched events, got', events);
        return events
    }
}


class ProblemModel {
    constructor(
        problemId,
        taskId,
        worker,
        cipheredAnswer,
        answer,
        ) {
        this.problemId=problemId  // uint
        this.taskId=taskId  // uint
        this.worker=worker  // address
        this.cipheredAnswer=cipheredAnswer  // bytes
        this.answer=answer  // string
    }
}


export class TurkContractClient extends ContractABC {

    async getAvailableProblems() {
        let requestConfig = {
            "method": "getProblems",
            "args": [],
            "value": 0
        }
        const res = await this._callMethod(requestConfig, 'call');
        const data = []
        for (let i=0; i+=1; i < res.length) {
            data.push(new ProblemModel(res[i]))
        }
        return data
    }

}

window.TurkContractClient = TurkContractClient
