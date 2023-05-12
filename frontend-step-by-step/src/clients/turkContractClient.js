import {getWeb3Accounts} from "../utils/blockchain";

import { IDKitWidget, useIDKit, IDKit } from "@worldcoin/idkit";

//const { open, setOpen } = useIDKit({
//	signal: "my_signal",
//	handleVerify: result => console.log(result),
//	actionId: "get_this_from_the_dev_portal",
//	walletConnectProjectId: "get_this_from_walletconnect_portal",
//});

window.open = open
window.IDKitWidget = IDKitWidget
window.IDKit = IDKit

console.log("IDKit", IDKit)

const CONTRACT_ABI = []

export class TurkContractClient {
    constructor(web3, address) {
        this.address = address
        this.web3 = web3
        this.contractObj = new web3.eth.Contract(CONTRACT_ABI, this.address)
    }

    async _callMethod(config, method="send", userAddress=null) {
        console.log("calling method with config: " + JSON.stringify(config));
        if (method === "send") {
            return await this._sendMethodImpl(
                config["contractName"],
                config["method"],
                config["args"],
                config["value"],
                userAddress
            );
        }
        return await this._callMethodImpl(
            config["contractName"],
            config["method"],
            config["args"],
            config["value"],
            userAddress
        );
    }

    async _buildMethod(method, args) {
        let methodInstance = this.contractObj.methods[method];
        return methodInstance(...args);
    }

    async _sendMethodImpl(contractName, method, args, value, userAddress=null) {
        const [sender] = await getWeb3Accounts(this.web3, userAddress);
        console.log("sender is " + sender);
        console.log("contract address is " + this.address)
        console.log("contractName is " + contractName);
        console.log("method is " + method);
        console.log("value is " + value);
        let methodFunc = await this._buildMethod(method, args)
        const tx = await methodFunc.send({
            from: sender,
            value: value,
            gas: 1000000,  // TODO: but in metamask ypu could make it yourself
            gasPrice: this.web3.utils.toWei('2', 'gwei')  // TODO: but in metamask ypu could make it yourself
        })
        console.log("tx: ", tx)
        return tx
    }

    async _callMethodImpl(contractName, method, args, value, userAddress=null) {
        console.log('Calling contract instead of tx sending...');
        const [sender] = await getWeb3Accounts(this.web3, userAddress);
        console.log("sender is " + sender);
        console.log("contractName is " + contractName);
        console.log("method is " + method);
        let methodFunc = await this._buildMethod(method, args)
        const tx = await methodFunc.call()
        console.log("tx: ", tx)
        return tx
    }

    async _getEvents(eventName, filterDict) {
        console.log('Fetch events with eventName ', eventName)
        console.log('Fetch events with filterDict ', filterDict)
        const events = await this.contractObj.getPastEvents(
            eventName,
            {
                filter: filterDict,
                fromBlock: 0,  // coz under the hood getPastEvents remembers last fetch.
            },
        );
        console.log('Fetched events, got', events);
        return events
    }

    // TODO: example
    async payableMethod(valueToSend, userAddress=null) {
        let requestConfig = {
            "contractName": "PokerRoom",
            "method": "createGame",
            "args": [],
            "value": parseInt(valueToSend)
        }
        const transaction = await this._callMethod(requestConfig, 'send', userAddress);
        return transaction.events.payableMethod.returnValues.namedValue;
    }
}
