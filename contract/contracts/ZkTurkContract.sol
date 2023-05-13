// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Crypto.sol";

import "hardhat/console.sol";

import { ByteHasher } from "./ByteHasher.sol";
import { IWorldID } from "./IWorldID.sol";


contract ZkTurkContract is Ownable, Crypto {
    //  TODO: reorder vars to save space.
    string NO_KEY_FLAG = "none";
    uint immutable problemFee;
    uint immutable problemStake;
    bool immutable useVerification;

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
        bytes cipheredAnswer;
        string answer;
    }
    TaskAnswer[] public taskAnswers;
    mapping(uint problemId => uint[]) public problemToAnswers;
    mapping(address => mapping(uint => uint[])) public workerToProblemAnswers;
    // workerToProblemAnswers[workerAddress][problemId] -> answers ids.

    // WorldID stuff
    using ByteHasher for bytes;

    /// @notice Thrown when attempting to reuse a nullifier
	error InvalidNullifier();

	/// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal immutable worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal immutable externalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal immutable groupId = 1;

    // @dev Whether a nullifier hash has been used already. Used to guarantee any problem is only performed once by a single person
	mapping(uint256 => mapping(uint => bool)) internal nullifierHashesPerProblem;

    constructor(uint _problemFee, uint _problemStake, bool _useVerification, IWorldID _worldId, string memory _appId, string memory _actionId) {
        problemFee = _problemFee;
        problemStake = _problemStake;
        useVerification = _useVerification;

		worldId = _worldId;
		externalNullifier = abi.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId).hashToField();
    }
    // TODO: change fee method.

    function getProblems() public view returns (Problem[] memory) {
        return problems;
    }

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
    function joinProblem(
        uint problemId,
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) payable external {
        if (useVerification) {
            // WorldID verification (unique human is allowed to join only once per problem, also check if signal equals to caller)
            require(msg.sender == signal, "Someone is trying to use proof for another user");

            if (nullifierHashesPerProblem[nullifierHash][problemId]) revert InvalidNullifier();

            // We now verify the provided proof is valid and the user is verified by World ID
            worldId.verifyProof(
                root,
                groupId,
                abi.encodePacked(signal).hashToField(),
                nullifierHash,
                externalNullifier,
                proof
            );

            // We now record the user has done this, so they can't do it again (proof of uniqueness)
            nullifierHashesPerProblem[nullifierHash][problemId] = true;
        }

        require(msg.value == problemStake, "Not Enough Eth.");
        require(problemId < problems.length, "Problem does not exist.");
        Problem memory problem = problems[problemId];
        require(problemWorkersCounts[problemId] < problem.workersMax);
        require(workerToProblem[msg.sender] == 0, "Already in the problem.");

        workerToProblem[msg.sender] = problemId;
        workerToStakeId[msg.sender] = problemId;
        problemWorkersCounts[problemId] += 1;
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

    // Solve the task you choosed by submitting siphered by yout seed answer.
    function solveTask(uint problemId, uint taskId, bytes memory cipheredAnswer) external {
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

    function compareStrings(string memory s1, string memory s2) private pure returns(bool) {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }

    function isAnswerAllowed(string memory answer, uint problemId) public view returns(bool){
        require(problemId < problems.length, "Problem does not exist.");
        string[] memory problemAsnwers = problems[problemId].asnwers;

        bool answerAllowed = false;
        for (uint i=0; i < problemAsnwers.length; i++) {
            if (compareStrings(answer, problemAsnwers[i])) {
                answerAllowed = true;
                break;
            }
        }
        return answerAllowed;

    }

    /*
        It checks that with deciphering it makes allowed answer and pay and return stak.
    */
    function withdrawAndDecipher(
        address worker,
        uint problemId,
        string memory answer,
        string memory seedPhrase
    ) external {
        // TODO: checks.

        uint[] memory workerAnswers = workerToProblemAnswers[worker][problemId];

        uint decipheredTaskAnswersCounter = 0;
        string memory composedSeed = string.concat(answer, seedPhrase);
        // Iterate through worker addresses.
        for (uint i=0; i < workerAnswers.length; i++) {
            TaskAnswer storage taskAnswer = taskAnswers[workerAnswers[i]];
            if (compareStrings(taskAnswer.answer, NO_KEY_FLAG)) {
                // TODO: try/except.
                assertInvalidSignature(worker, composedSeed, taskAnswer.cipheredAnswer);
                require(isAnswerAllowed(answer, problemId), "Answer is not allowed.");

                taskAnswer.answer = answer;
                decipheredTaskAnswersCounter += 1;
            }
        }

        // Allow worker to start solve new problems.
        delete workerToProblem[worker];

        if (decipheredTaskAnswersCounter != 0) {
            uint stakeToReturn = workerToStakeId[msg.sender];
            delete workerToStakeId[msg.sender];
            Problem memory problem = problems[problemId];
            payable(msg.sender).transfer(stakeToReturn + decipheredTaskAnswersCounter * problem.taskPriceWei);
        }
    }
}
