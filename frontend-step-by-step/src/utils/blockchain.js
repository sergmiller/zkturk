export async function getWeb3Accounts(web3, userAddress=null) {
    let addrs = await web3.eth.getAccounts();
    if (userAddress) {
        addrs = addrs.filter(obj => {
            return obj.toLowerCase() === userAddress.toLowerCase()
        })
    }
    return addrs
}
