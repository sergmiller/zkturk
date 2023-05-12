import * as idkit from '@worldcoin/idkit';

import { IDKitWidget, useIDKit, IDKit } from "@worldcoin/idkit";

export function getIdKit() {
    return idkit;
}

export function getIDKit() {
    return IDKit;
}

//const { open, setOpen } = useIDKit({
//	signal: "my_signal",
//	handleVerify: result => console.log(result),
//	actionId: "get_this_from_the_dev_portal",
//	walletConnectProjectId: "get_this_from_walletconnect_portal",
//});

window.open = open
window.IDKitWidget = IDKitWidget
window.IDKit = IDKit

console.log("IDKit:", getIDKit())

window.useIDKit = useIDKit
window.getIdKit = getIdKit

console.log("IDKIT:", getIdKit())
