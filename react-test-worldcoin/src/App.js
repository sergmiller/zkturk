import React from 'react';
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";


const Web3 = require('web3');
const web3 = new Web3();

const root = "0x2a39c3a4969e8c277841a4980fb08ed32110ae3c5b36a40d39f4c86aebc47512"
const nullifier = "0x1e1666824867d71eafcf0cd8f048309cc8845f3ede8f999b2249deef5a062a12"
const proof = "0x0ccc2fd0f110b3c0c49e8fca87087410f254b98d777748b6c8dfc3e8e6a960501efcc247fcb24da12c0e097c86e18ee30488ab478238ecda54811b11e15b3c7129b739be3db7c9099253981b3a14434d174de78d4e9723fc247c20128c963a7d166677512ead2e4a047bbb78c04791d0d8de51268984dd0106cd880fd51fdcf3065189578413b643b76ad48e62805b01f8774c7c251c6e438b643491ab73b2a502287d8c3907ee06b7c9c972885866b2f766869ec85a6e16318835f4031e282d08ab8c1decf03f67daa425c5480db613507dce0998339560ae8b7cb2732abc6f12b97037f067ed8a8ca234a57241f91378130ee9aff4738c9d96fe4e34b95342"
const proofF = web3.eth.abi.decodeParameter('uint256[8]', proof);
const rootF = web3.eth.abi.decodeParameter("uint256", root);
const nullifierF = web3.eth.abi.decodeParameter("uint256", nullifier);
console.log("PROOF FORMATTED", proofF, rootF, nullifierF);

[1,
2,
3,
4,
5,
6,
7,
8]

5788520999348326149832084916835009927950274138389103305383613052913411776592,
14015971797381682438525116939810095129049529346268181516842365696186078936177,
18868558333199654756285640332602531034385073025431832385809162251781272910461,
10131924565925811734746423970400335404554976522476545165842666138128223296755,
2857939602420849344964807789573915668774211404786301083566427580851148796581,
976166078449613122999670911941031793179675025720480180343327959397347239981,
3921600688022771849862234207270903154199307549664306470176662934160107289711,
8469272485188406784931727273746999884066267409401517309962251415710357607234

[5788520999348326149832084916835009927950274138389103305383613052913411776592,
14015971797381682438525116939810095129049529346268181516842365696186078936177,
18868558333199654756285640332602531034385073025431832385809162251781272910461,
10131924565925811734746423970400335404554976522476545165842666138128223296755,
2857939602420849344964807789573915668774211404786301083566427580851148796581,
976166078449613122999670911941031793179675025720480180343327959397347239981,
3921600688022771849862234207270903154199307549664306470176662934160107289711,
8469272485188406784931727273746999884066267409401517309962251415710357607234]

function App() {

	const handleProof = (result) => {
		return new Promise((resolve) => {
			setTimeout(() => resolve(), 3000);
			// NOTE: Example of how to decline the verification request and show an error message to the user
		});
	};
//
//	const onSuccess = (result) => {
//		console.log("IS_RESULT", result);
//		const testABI = ['uint256[8]'];
//		abiDecoder.addABI(testABI);
//		const proof = abiDecoder.decodeMethod(proof)[0];
//		console.log("PROOF FORMATTED", proof);
//	};
//
	const onSuccess = (result) => {
		console.log("IS_RESULT", result);
//		const testABI = ['uint256[8]'];
//		abiDecoder.addABI(testABI);
        const proof = result.proof
		const proofF = web3.eth.abi.decodeParameter('uint256[8]', proof)[0];
		console.log("PROOF FORMATTED", proofF);
	};

//	const urlParams = new URLSearchParams(window.location.search);
//	const credential_types = (urlParams.get("credential_types")?.split(",") as CredentialType[]) ?? [
//		CredentialType.Orb,
//		CredentialType.Phone,
//	];

	const action = "test_action"
//	const app_id = "app_staging_a50d7cafca2dd77781ac6df8b9929179"
	const app_id = "app_3e9eeaff7bed8b8b6c50031ae88bda50"
	const signal = "0x439569F5142e30c131E6704ff847B507F39BC5bC"

	return (
		<div
			className="App"
			style={{
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<IDKitWidget
				action={action}
				signal={signal}
				onSuccess={onSuccess}
				handleVerify={handleProof}
				app_id={app_id}
//				credential_types={credential_types}
				// walletConnectProjectId="get_this_from_walletconnect_portal"
			>
				{({ open }) => <button onClick={open}>Click me</button>}
			</IDKitWidget>
		</div>
	);
}

export default App;