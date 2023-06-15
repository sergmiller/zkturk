const { ethers } = require("hardhat");
import { TurkContractClient } from "./utils/TurkContractClient";

const DEF_URLS = ['https://assets.raribleuserdata.com/prod/v1/image/t_image_big/aHR0cHM6Ly9pcGZzLmlvL2lwZnMvUW1hUFM2R0xNbTJabkhFYTJZUkhCYmVQeFF0V1Y3ZlI1RzVmVUNVeDhiNE5CTA==', 'https://assets.raribleuserdata.com/prod/v1/image/t_image_big/aHR0cHM6Ly9pcGZzLmlvL2lwZnMvUW1YcUxUUkVuZThkUGZpb0o4SjdQRGJKTG13a3Q5bWNZWkQ0cDl2S2tHRExmTQ==']
const DEF_ASNWERS = ['dogu', 'Phd']
const DEF_WORKERS_MAX = 2
const DEF_TASK_PRICE = ethers.utils.parseEther("0.00000000000000001")
const DEF_ANS_MAX= 2
const DEF_SEED = 'fooseed'


async function addDefaultProblem(contract) {
    const options = {value: ethers.utils.parseEther("0.00002")}
    const addProblem = await contract.addProblem(
        'Dogs or Cats?',
        'foo',
        DEF_URLS,
        DEF_ASNWERS,
        DEF_WORKERS_MAX,
        DEF_TASK_PRICE,
        DEF_ANS_MAX,
        options
    )
    await addProblem.wait()
}

describe("FULL GAME ON CONTRACT CLIENT", function () {
    it("foo", async function () {
        console.log('Start')
        const Storage = await ethers.getContractFactory("ZkTurkContract");
        const WorldID = await ethers.getContractFactory("DummyWorldID");
        const worldIdContract = await WorldID.deploy()
        worldIdContract.deployed();
        const contract = await Storage.deploy(1, 1, false, "0xD81dE4BCEf43840a2883e5730d014630eA6b7c4A", "dummy_app_id", "dummy_action");
        contract.deployed();

        const accounts = await web3.eth.getAccounts()
        const signer = accounts[0]
        await addDefaultProblem(contract)
        await addDefaultProblem(contract)

        const client = new TurkContractClient(web3, contract.address)

        // console.log('getAllMyProblems', await client.getAllMyProblems())
        // async startProblem(problemId, signal="", root = 123, nullifierHash = 456, proof = [1,2,3,4,5,6,7,8]) {
        await client.startProblem(1)
        // console.log('getAllTasks', await client.getAllTasks(1))
        console.log('getJoinedProblem', await client.getJoinedProblem())
        console.log('Solve Task...')
        await client.solveTask(1, 0, DEF_ASNWERS[0])
        await client.solveTask(1, 1, DEF_ASNWERS[0])

        // async withdraw(problemId, taskIds, answers, seed = DEFAULT_SEED) {
        await client.withdraw(1, [0, 1], [DEF_ASNWERS[0], DEF_ASNWERS[0]])
    })
})
