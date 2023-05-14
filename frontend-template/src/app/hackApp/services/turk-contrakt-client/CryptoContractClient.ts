//@ts-nocheck
export class CryptoContractClient {

  constructor(web3, signer, contractAddress) {
      // To prevent cross contract iteraction.
      this.contractAddress = contractAddress
      this.web3 = web3
      this.signer = signer
  }

  // Under the hood it works only with seed of actual seed and message.
  constructMessage(message, seed) {
      const composedSeed = message + seed
      return this.web3.utils.soliditySha3(
          {type: 'address', value: this.contractAddress},
          {type: 'string', value: composedSeed},
      );
  }

  async signMessage(message) {
      return await this.web3.eth.sign( // TODO: user await web3.eth.personal.sign( in real world.
          message.toString("hex"),
          this.signer,
      );
  }

  async getSignedMessage(message, seed) {
      const messageHash = this.constructMessage(message, seed)
      const signed = await this.signMessage(messageHash)
      console.log('Signed message hash', signed)
      return signed
  }

}
﻿//@ts-nocheck
export class CryptoContractClient {

  constructor(web3, signer, contractAddress) {
      // To prevent cross contract iteraction.
      this.contractAddress = contractAddress
      this.web3 = web3
      this.signer = signer
  }

  // Under the hood it works only with seed of actual seed and message.
  constructMessage(message, seed) {
      const composedSeed = message + seed
      return this.web3.utils.soliditySha3(
          {type: 'address', value: this.contractAddress},
          {type: 'string', value: composedSeed},
      );
  }

  async signMessage(message) {
      return await this.web3.eth.sign( // TODO: user await web3.eth.personal.sign( in real world.
          message.toString("hex"),
          this.signer,
      );
  }

  async getSignedMessage(message, seed) {
      const messageHash = this.constructMessage(message, seed)
      const signed = await this.signMessage(messageHash)
      console.log('Signed message hash', signed)
      return signed
  }

}
