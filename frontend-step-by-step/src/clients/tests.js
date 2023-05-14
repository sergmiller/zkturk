import {TurkContractClient} from "./turkContractClient";

const contractAddress = "0xf312DCD111571Fa4e8DaD3cfFaf412dE914C5677"//process.env.CONTRACT_ADDRESS


// It used to use web3 from
// <script src="https://cdn.jsdelivr.net/npm/web3@1.3.4/dist/web3.min.js"></script>.
// It uses several users fom Ganache chain.
async function test_contract() {
    console.log('----- CI TEST STARTED for ganachi -----')
    const _web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"))
    // Use web3 with account from ganache, and declare what account to use for each client.

    const turkContract = new TurkContractClient(_web3, contractAddress)
    console.log('getAvailableProblems', await turkContract.getAvailableProblems())

    globalDebug = turkContract

    console.log(await turkContract._getStakeValue())
    const DEF_URLS = ['url1', 'url2']
    const DEF_ASNWERS = ['a', 'b']
    const DEF_WORKERS_MAX = 2
    const DEF_TASK_PRICE = 0.001
    const DEF_ANS_MAX= 2
    await turkContract.createProblem(
        'foo',
        'foo',
        DEF_URLS,
        DEF_ASNWERS,
        DEF_WORKERS_MAX,
        DEF_TASK_PRICE,
        DEF_ANS_MAX,
    )
    await new Promise(r => setTimeout(r, 500))
    await turkContract.createProblem(
        'Real Dog Cat Problem',
        'Is a dog or a cat?',
        DEF_URLS,
        DEF_ASNWERS,
        DEF_WORKERS_MAX,
        DEF_TASK_PRICE,
        DEF_ANS_MAX,
    )
    await new Promise(r => setTimeout(r, 500))
    console.log('getProblem', await turkContract.getProblem(1))

    console.log(await turkContract.getAllMyProblems())

    let root = 123;
    let nullifierHash = 456;
    let proof = [1,2,3,4,5,6,7,8];
    const _problems = await turkContract.getAvailableProblems()
    await new Promise(r => setTimeout(r, 500))
    await turkContract.withdrawAndForget()
    await new Promise(r => setTimeout(r, 500))
    console.log('START', _problems.length - 1)
    await turkContract.startProblem(_problems.length - 1, contractAddress, root, nullifierHash, proof)
    await new Promise(r => setTimeout(r, 500))

    await turkContract.solveTask(_problems.length - 1, 0, DEF_ASNWERS[0])
    await new Promise(r => setTimeout(r, 500))
    await turkContract.withdraw(_problems.length - 1, [0], [DEF_ASNWERS[0]])
    //async withdraw(problemId, taskIds, answers, seed=DEFAULT_SEED)
    console.log('---- CI TEST ENDED -----')
}

// Export hack
window.test_contract = test_contract
