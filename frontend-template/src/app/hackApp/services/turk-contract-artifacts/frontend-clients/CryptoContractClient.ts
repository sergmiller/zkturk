// TODO: mb this class should be merely extended.
import {ethers} from "ethers";
import {Crypto} from "../typechain-types"
import {assertBytes32} from "./utils";


export class CryptoContractClient {
    private contractAddress: string;
    public contract: Crypto;

    private signer: ethers.providers.JsonRpcSigner;

    constructor(signer: ethers.providers.JsonRpcSigner, abi: any, address: string) {
        // To prevent cross contract interaction.
        this.contractAddress = address
        this.signer = signer
        this.contract = new ethers.Contract(this.contractAddress, abi, signer) as Crypto;
    }

    // Concatenated message and seed into 1 payload.
    // Message is an actual info.
    // Seed - kinda password or salt: bytes 32
    // (e.g. "0x0123456789012345678901234567890123456789012345678901234567890123").
    // Under the hood it works only with seed of actual seed and message.
    _constructPayload(seed: string, message: string) {
        assertBytes32(seed)

        let payload = ethers.utils.defaultAbiCoder.encode([ "bytes32", "string" ], [ seed, message]);
        return ethers.utils.keccak256(payload);
    }

    async _signPayload(payloadHash: string) {
        // This adds the message prefix.
        return await this.signer.signMessage(ethers.utils.arrayify(payloadHash));
    }

    async getSignedMessage(seed: string, message: string) {
        assertBytes32(seed)

        const payloadHash = this._constructPayload(seed, message)
        // Off-chain sign.
        return await this._signPayload(payloadHash)
    }

    async isValidSignatureOffChain(signature: string, seed: string, message: string): Promise<boolean> {
        assertBytes32(seed)

        const payloadHash = this._constructPayload(seed, message)
        let sig = ethers.utils.splitSignature(signature);
        const addressFromSignature = ethers.utils.verifyMessage(ethers.utils.arrayify(payloadHash), sig)
        const signerAddress = await this.signer.getAddress()
        return addressFromSignature === signerAddress
    }

    async isValidSignatureOnChain(signature: string, seed: string, message: string): Promise<boolean> {
        assertBytes32(seed)
        const signerAddress = await this.signer.getAddress()
        return await this.contract.isSeedValid(seed, message, signerAddress, signature);
    }
}
