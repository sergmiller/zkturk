import {CryptoContractClient} from "./utils/CryptoContractClient";
const { ethers } = require("hardhat");

async function shouldThrow(promise) {
    try {
        await promise;
    }
    catch (err) {
        return;
    }
    throw Error("The contract did not throw.");

}

describe("foo", function () {
    describe("foo", () => {
        it("foo", async function () {
            // Use ehters to deploy.
            const Contract = await ethers.getContractFactory("Crypto");
            contract = await Contract.deploy();
            contract.deployed();
            console.log('Contract deployed at', contract.address)

            const accounts = await web3.eth.getAccounts()
            const signer = accounts[0]

            const cryptoContractClient = new CryptoContractClient(web3, signer, contract.address)

            const seed = "1"
            const message = "foo"
            const signed = await cryptoContractClient.getSignedMessage(message, seed)//await signMessage(messageHash)
            console.log('signed')
            console.log(signed)

            const composedSeed = message + seed
            await contract.test(signer, composedSeed, signed)
            await shouldThrow(contract.test(signer, 'foo', signed))
        })
    })
})
