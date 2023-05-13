import React from 'react';
import { CredentialType, IDKitWidget, ISuccessResult, solidityEncode } from "@worldcoin/idkit";

const { keccak256 } = require('js-sha3');

const Buffer = require('buffer').Buffer;

const Web3 = require('web3');
const web3 = new Web3();

const signalAddress = "0x439569F5142e30c131E6704ff847B507F39BC5bC"

const root = "0x2a39c3a4969e8c277841a4980fb08ed32110ae3c5b36a40d39f4c86aebc47512"
const nullifier = "0x1e1666824867d71eafcf0cd8f048309cc8845f3ede8f999b2249deef5a062a12"
const proof = "0x0ccc2fd0f110b3c0c49e8fca87087410f254b98d777748b6c8dfc3e8e6a960501efcc247fcb24da12c0e097c86e18ee30488ab478238ecda54811b11e15b3c7129b739be3db7c9099253981b3a14434d174de78d4e9723fc247c20128c963a7d166677512ead2e4a047bbb78c04791d0d8de51268984dd0106cd880fd51fdcf3065189578413b643b76ad48e62805b01f8774c7c251c6e438b643491ab73b2a502287d8c3907ee06b7c9c972885866b2f766869ec85a6e16318835f4031e282d08ab8c1decf03f67daa425c5480db613507dce0998339560ae8b7cb2732abc6f12b97037f067ed8a8ca234a57241f91378130ee9aff4738c9d96fe4e34b95342"
const proofF = web3.eth.abi.decodeParameter('uint256[8]', proof);
const rootF = web3.eth.abi.decodeParameter("uint256", root);
const nullifierF = web3.eth.abi.decodeParameter("uint256", nullifier);
const signalEncoded = solidityEncode(['address'], [signalAddress])
console.log("PROOF FORMATTED", proofF, rootF, nullifierF, signalEncoded);


function hashString(input) {
	const bytesInput = Buffer.from(input)

	return hashEncodedBytes(bytesInput)
}


function hashEncodedBytes(input) {
	const hash = BigInt('0x' + keccak256(input)) >> BigInt(8)
	const rawDigest = hash.toString(16)

	return { hash, digest: `0x${rawDigest.padStart(64, '0')}` }
}

function hashToField(input)  {
//	if (isBytesLike(input)) return hashEncodedBytes(input)

	return hashString(input)
}

//['20322407907115716633851149969351933781630722086209768212868546747251053968823', '4909251337242916209150541502839855981836134727566927048517581534928462002639', '7380152004090989391051205642192107368083583970391782396901598842442402904983', '33986179049260951095843879653339646924950848208457766913806326262362921107', '7403565949871924089732316120520289144648931435923223174049259074189639222412', '7407380921997398546403176951234068508995656946413275744709600610010241323008', '2930114628629937727970806652659555284883185201077493247280222525733592506134', '18968754545194771493995000598886630737362695901126715616464742891569413105119']
//10861290387203271388155575406125073029542215397886140714296082525116180414022
//6225861930835293086631100876716001408092485775610563575066984942264812416494


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
        const proofF = web3.eth.abi.decodeParameter('uint256[8]', result.proof);
        const rootF = web3.eth.abi.decodeParameter("uint256", result.merkle_root);
        const nullifierF = web3.eth.abi.decodeParameter("uint256", result.nullifier_hash);
        console.log("PROOF FORMATTED", proofF, rootF, nullifierF);
	};

//	const urlParams = new URLSearchParams(window.location.search);
//	const credential_types = (urlParams.get("credential_types")?.split(",") as CredentialType[]) ?? [
//		CredentialType.Orb,
//		CredentialType.Phone,
//	];

//	const action = app_id
//	const app_id = "app_staging_a50d7cafca2dd77781ac6df8b9929179" // stage chain
//	const app_id = "app_3e9eeaff7bed8b8b6c50031ae88bda50" // prod chain
//	const app_id = "app_staging_97a2529f7a2349f7e8ef8ebb57e9e129" // stage cloud
    const app_id = "app_27e786e19bc6472e4d4cd8256eaa2fc4" // prod cloud
//	const signal = "0x439569F5142e30c131E6704ff847B507F39BC5bC"
//	const app_id_encoded = solidityEncode(['int256'], [app_id])
	const app_id_encoded = web3.eth.abi.encodeParameters(['uint256'],[hashString(app_id).hash])
	const empty_signal_encoded = web3.eth.abi.encodeParameters(["string"],[hashString("").hash])
	console.log("app_id_encoded", app_id_encoded, empty_signal_encoded)
//	const action = "my_action"
//	console.log("action", action, signalAddress)
//   const action = ""
//    const signal = solidityEncode(['address'], [signalAddress])

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
				action=""
				signal=""
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