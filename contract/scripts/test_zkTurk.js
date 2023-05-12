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

    beforeEach(async () => {
        const Storage = await ethers.getContractFactory("ZkTurkContract");
        contract = await Storage.deploy(DEF_FEE, DEF_FEE);
        contract.deployed();
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

    describe("#addProblem", () => {
        it("it adds problem successfully", async function () {
            // const provider = ethers.getDefaultProvider();
            const [owner, addr1] = await ethers.getSigners();
            // console.log('here');
            // console.log(owner.address);
            // const balance = await provider.getBalance(owner.address);
            // console.log(balance.toNumber())

            await addDefaultProblem()
            const problem = await contract.problems(1)
            expect(problem[0]).to.equal(owner.address);
        })
    })

    describe("#joinProblem", () => {
        it("it joins successfully", async function () {
            await addDefaultProblem()
            const [, account1] = await ethers.getSigners();
            const options = {value: DEF_FEE}
            await contract.connect(account1).joinProblem(1, 'worldIdhash', options)
            // expect(problem[0]).to.equal(owner.address);
        })

        it("it do not joined second time", async function () {
            await addDefaultProblem()
            const [, account1] = await ethers.getSigners();
            const options = {value: DEF_FEE}
            await contract.connect(account1).joinProblem(1, 'worldIdhash', options)
            await shouldThrow(contract.connect(account1).joinProblem(1, 'worldIdhash', options))
        })
    })
});
