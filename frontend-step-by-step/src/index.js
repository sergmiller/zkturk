import * as idkit from '@worldcoin/idkit' // If you installed the JS package as a module

import { IDKitWidget, SignInWithWorldID, useIDKit } from '@worldcoin/idkit'

console.log("idkit", idkit)
console.log("IDKitWidget", IDKitWidget)

window.idkit = IDKitWidget

//idkit.IDKitWidget.type('idkit-container', {
//	enable_telemetry: true,
//	app_id: 'app_BPZsRJANxct2cZxVRyh80SFG', // obtain this from developer.worldcoin.org
//	action: 'your_signal'
// 	onSuccess: result => console.log(result),
//})
//
//document.getElementById('trigger-button').addEventListener('click', () => {
//	idkit.open()
//})
