const { expect } = require("chai");
const { ethers } = require("hardhat");

async function shouldThrow(promise, message) {
    try {
        await promise;
    }
    catch (err) {
        return;
    }
    throw Error("The contract did not throw.");

}


describe("ZkTurkContract", function () {
    DEF_FEE = ethers.utils.parseEther("0.0001")
    DEF_TITLE = 'foo'
    DEF_URLS = ['url1', 'url2']
    DEF_ASNWERS = ['a', 'b']
    DEF_WORKERS_MAX = 2
    DEF_TASK_PRICE = ethers.utils.parseEther("0.0001")
    DEF_ANS_MAX= 2

    let contract = null
    let defaultWorker = null

    beforeEach(async () => {
        const Storage = await ethers.getContractFactory("ZkTurkContract");
        contract = await Storage.deploy(DEF_FEE, DEF_FEE);
        contract.deployed();
        const [, worker1] = await ethers.getSigners();
        defaultWorker = worker1
        // TODO: to work with 0 in mapping of "workerToProblem";
        await addDefaultProblem()
    });

    async function addDefaultProblem() {
        const options = {value: ethers.utils.parseEther("0.05")}
        const addProblem = await contract.addProblem(
            'foo',
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

    xdescribe("#addProblem", () => {
        it("it adds problem successfully", async function () {
            // const provider = ethers.getDefaultProvider();
            const [owner, ] = await ethers.getSigners();
            // console.log('here');
            // console.log(owner.address);
            // const balance = await provider.getBalance(owner.address);
            // console.log(balance.toNumber())

            await addDefaultProblem()
            const problem = await contract.problems(1)
            expect(problem[0]).to.equal(owner.address);
        })
    })

    async function _joinDefaultProblem(worker=defaultWorker) {
        const options = {value: DEF_FEE}
        await contract.connect(worker).joinProblem(1, 'worldIdhash', options)
    }

    xdescribe("#joinProblem", () => {
        it("it joins successfully", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            // TODO: test.
            // expect(problem[0]).to.equal(owner.address);
        })

        it("it does not joined second time", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            await shouldThrow(_joinDefaultProblem())
        })

        it("it allows to join another worker", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            const [,,worker2] = await ethers.getSigners()
            await _joinDefaultProblem(worker2)
        })

        it("it does not allow to join more than max workers.", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            const [,,worker2,worker3] = await ethers.getSigners()
            await _joinDefaultProblem(worker2)
            await shouldThrow(_joinDefaultProblem(worker3))
        })
    })

    xdescribe("#solveTask", () => {
        it("it solves task successfully", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            await contract.connect(defaultWorker).solveTask(1, 0, "cipheredAnswer")
        })

        it("it does not allow to solve task twice", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            await contract.connect(defaultWorker).solveTask(1, 0, "cipheredAnswer")
            await shouldThrow(contract.connect(defaultWorker).solveTask(1, 0, "cipheredAnswer"))
        })

        it("it stores ciphered answer", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            await contract.connect(defaultWorker).solveTask(1, 0, "cipheredAnswer")

            const answer = await contract.taskAnswers(0)
            expect(answer.cipheredAnswer).to.equal("cipheredAnswer")
            expect(answer.decipherKey).to.equal("none")
        })
    })

    describe("#withdrawAndDecipher", () => {
        //  TODO: negative cases.

        it("it withdraws successfully", async function () {
            await addDefaultProblem()
            await _joinDefaultProblem()
            await contract.connect(defaultWorker).solveTask(1, 0, "cipheredAnswer")
            await contract.connect(defaultWorker).withdrawAndDecipher(defaultWorker.address, 1, "decipherKey")
        })
    })
});
