// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";


contract ZkTurkContract is Ownable {
    //  TODO: reorder vars to save space.
    string NO_KEY_FLAG = "none";
    uint immutable problemFee;
    uint immutable problemStake;

    // To store problem that have tasks and set of answers.
    struct Problem {
        address owner;
        string title;
        string description;
        string[] urlToTask;
        string[] asnwers;
        uint workersMax;
        uint taskPriceWei;
        uint answersMax;
    }

    Problem[] public problems;
    // To store number of workers per problem.
    uint[] problemWorkersCounts;

    mapping(address => uint) workerToProblem; // TODO: to problems (MVP - 1 worker could solve simultaniously only 1 problem)
    mapping(address => uint) workerToStakeId;  // stake id is similar to the problem id.  (MVP - 1 worker could solve simultaniously only 1 problem)

    struct TaskAnswer {
        uint problemId;
        uint taskId;
        address worker;
        string cipheredAnswer;
        string decipherKey;
    }
    TaskAnswer[] taskAnswers;
    mapping(uint problemId => uint[]) public problemToAnswers;
    mapping(address => mapping(uint => uint[])) workerToProblemAnswers;
    // workerToProblemAnswers[workerAddress][problemId] -> answers ids.

    constructor(uint _problemFee, uint _problemStake)
    {
        problemFee = _problemFee;
        problemStake = _problemStake;
    }
    // TODO: change fee method.

    function addProblem(
        string memory title,
        string memory description,
        string[] memory urlToImgs,
        string[] memory asnwers,
        uint workersMax,
        uint taskPriceWei,
        uint answersMax
    ) payable external {
        require(msg.value >= problemFee + (answersMax * workersMax * taskPriceWei), "Not Enough Eth.");
        // TODO: add require non empty title etc.
        problems.push(
            Problem(
                msg.sender,
                title,
                description,
                urlToImgs,
                asnwers,
                workersMax,
                taskPriceWei,
                answersMax
            )
        );
        problemWorkersCounts.push(0);
    }

    // Stake is returnable if even 1 answer sumbitted.
    function joinProblem(uint problemId, string memory worldIdHash) payable external {
        require(msg.value == problemStake, "Not Enough Eth.");
        require(problemId < problems.length, "Problem does not exist.");
        Problem memory problem = problems[problemId];
        require(problemWorkersCounts[problemId] < problem.workersMax);
        require(workerToProblem[msg.sender] == 0, "Already in the problem.");

        // TODO: work with worldIdHash and proof and store?
        workerToProblem[msg.sender] = problemId;
        workerToStakeId[msg.sender] = problemId;
    }

    // function _hash(uint a, uint b) internal pure returns(bytes32) {
    //     string memory _string = Strings.toString(a);
    //     _string = string.concat(_string, Strings.toString(b));
    //     return keccak256(abi.encodePacked(""));
    // }

    function isTaskNotAnsweredByWorker(uint problemId, uint taskId) view private returns(bool){
        //  TODO: use hashing.
        uint[] memory answers = workerToProblemAnswers[msg.sender][problemId];
        bool notAnswered = true;
        for (uint i=0; i < answers.length; i++) {
            if (taskId == answers[i]) {
                notAnswered = false;
                break;
            }
        }
        return notAnswered;
    }

    // Solve the task you choosed, then
    function solveTask(uint problemId, uint taskId, string memory cipheredAnswer) external {
        require(workerToProblem[msg.sender] == problemId, "User is not joined to the problem.");
        require(isTaskNotAnsweredByWorker(problemId, taskId), "Solve the task that already solved by the same user is prohibetted.");
        require(problemToAnswers[problemId].length <= problems[problemId].answersMax, "Max answers submitted.");

        taskAnswers.push(
            TaskAnswer(
                problemId,
                taskId,
                msg.sender,
                cipheredAnswer,
                NO_KEY_FLAG
            )
        );
        uint answerId = taskAnswers.length - 1;
        problemToAnswers[problemId].push(answerId);
        workerToProblemAnswers[msg.sender][problemId].push(answerId);
    }

    function getDecipheredAnswer(string memory cipheredAnswer, string memory decipherKey) pure public returns(string memory) {
        // TODO: implement.
        return cipheredAnswer;
    }

    function compareStrings(string memory s1, string memory s2) private pure returns(bool) {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

    function isAnswerAllowed(string memory answer, uint problemId) public view returns(bool){
        require(problemId < problems.length, "Problem does not exist.");
        string[] memory problemAsnwers = problems[problemId].asnwers;

        bool doesListContainElement = false;
        for (uint i=0; i < problemAsnwers.length; i++) {
            if (compareStrings(answer, problemAsnwers[i])) {
                doesListContainElement = true;
                break;
            }
        }
        return doesListContainElement;

    }

    function withdrawAndDecipher(address worker, uint problemId, string memory decipherKey) external {
        // TODO: checks.

        // TODO: store decipher key
        // TODO: check that with deciphering it makes answer and pay.
        uint[] memory workerAnswers = workerToProblemAnswers[worker][problemId];

        uint decipheredTaskAnswersCounter = 0;
        for (uint i=0; i < workerAnswers.length; i++) {
            TaskAnswer storage taskAnswer = taskAnswers[workerAnswers[i]];
            if (compareStrings(taskAnswer.decipherKey, NO_KEY_FLAG)) {
                string memory decipheredAnswer = getDecipheredAnswer(taskAnswer.cipheredAnswer, decipherKey);
                require(isAnswerAllowed(decipheredAnswer, problemId), "Answer is not allowed.");

                taskAnswer.decipherKey = decipherKey;
                decipheredTaskAnswersCounter += 1;
            }
        }

        if (decipheredTaskAnswersCounter != 0) {
            uint stakeToReturn = workerToStakeId[msg.sender];
            delete workerToStakeId[msg.sender];
            Problem memory problem = problems[problemId];
            payable(msg.sender).transfer(stakeToReturn + decipheredTaskAnswersCounter * problem.taskPriceWei);
        }
    }
}
