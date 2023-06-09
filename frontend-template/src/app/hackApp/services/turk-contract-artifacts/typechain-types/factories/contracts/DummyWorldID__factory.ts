/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  DummyWorldID,
  DummyWorldIDInterface,
} from "../../contracts/DummyWorldID";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "root",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "groupId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "signalHash",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nullifierHash",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "externalNullifierHash",
        type: "uint256",
      },
      {
        internalType: "uint256[8]",
        name: "proof",
        type: "uint256[8]",
      },
    ],
    name: "verifyProof",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061017a806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80633bc778e314610030575b600080fd5b61004a600480360381019061004591906100b6565b61004c565b005b505050505050565b600080fd5b6000819050919050565b61006c81610059565b811461007757600080fd5b50565b60008135905061008981610063565b92915050565b600080fd5b6000819050826020600802820111156100b0576100af61008f565b5b92915050565b6000806000806000806101a087890312156100d4576100d3610054565b5b60006100e289828a0161007a565b96505060206100f389828a0161007a565b955050604061010489828a0161007a565b945050606061011589828a0161007a565b935050608061012689828a0161007a565b92505060a061013789828a01610094565b915050929550929550929556fea26469706673582212201733e8d087b76c9edc1e5b965c969f0fedf95526fe3f768e6559b93ee92e621a64736f6c63430008120033";

type DummyWorldIDConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DummyWorldIDConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DummyWorldID__factory extends ContractFactory {
  constructor(...args: DummyWorldIDConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DummyWorldID> {
    return super.deploy(overrides || {}) as Promise<DummyWorldID>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DummyWorldID {
    return super.attach(address) as DummyWorldID;
  }
  override connect(signer: Signer): DummyWorldID__factory {
    return super.connect(signer) as DummyWorldID__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DummyWorldIDInterface {
    return new utils.Interface(_abi) as DummyWorldIDInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DummyWorldID {
    return new Contract(address, _abi, signerOrProvider) as DummyWorldID;
  }
}
