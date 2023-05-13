// To test you need to inject metamask coz it uses web3 instead of ethers.

describe("foo", function () {
    describe("foo", () => {
        it("foo", async function () {
            const accounts = await web3.eth.getAccounts()

            // const answer = "hello world"
            // const taskId = 1
            // const worker = accounts[0]
            // const contractAddress = worker // TODO
            // const workerSecretSeed = 300

            // var hash = web3.utils.soliditySha3(
            //     {type: 'address', value: worker},
            //     {type: 'uint256', value: workerSecretSeed},
            //     {type: 'string', value: answer},
            //     {type: 'uint256', value: taskId},
            //     {type: 'address', value: contractAddress},
            // ).toString("hex");
            // // console.log(hash == ethers.utils.id('hello world'))
            // const signedAnswer = await web3.eth.personal.sign(hash, accounts[0]);
            // console.log('ciphered message')
            // console.log(signedAnswer)

            // console.log('initial hash')
            // console.log(hash)

            // Submit this ciphere answer to contract.

            // Submit hash with workerSecretSeed, thus contract could recover the message,
            // check the workerSecretSeed.



            function constructPaymentMessage(contractAddress, seed) {
                return web3.utils.soliditySha3(
                    {type: 'address', value: contractAddress},
                    {type: 'string', value: seed},
                );
            }

            async function signMessage(message) {
                return await web3.eth.personal.sign(
                    message.toString("hex"),
                    accounts[0],
                );
            }

            const contractAddress = "0x3ca6876b7FED0c92AA0126E40bB9722B4CA2150B"  // TODO
            const seed = "1"
            const messageHash = constructPaymentMessage(contractAddress, seed)
            const signed = await signMessage(messageHash)
            console.log('signed')
            console.log(signed)

        })
    })
})
