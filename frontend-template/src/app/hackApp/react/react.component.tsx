// import * as React from 'react';
// import ReactDOM from 'react-dom';
// import { FunctionComponent, useEffect, useRef, useState } from 'react';
// import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

// // export interface IMyComponentProps {
// // }

// // export const CustomReactComponent: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {


// //   return (
// //     <IDKitWidget
// //       app_id="app_BPZsRJANxct2cZxVRyh80SFG" // obtain this from developer.worldcoin.org
// //       action="my_action"
// //       enableTelemetry
// //       onSuccess={result => console.log(result)} // pass the proof to the API or your smart contract
// //     />
// //   )


// // };

// export function RApp() {
//   React.useEffect(() => {
//     console.log('rendered');
//   });

// 	const handleProof = (result: any) => {
// 		return new Promise((resolve: (value?: any) => void) => {
// 			setTimeout(() => resolve(), 3000);
// 			// NOTE: Example of how to decline the verification request and show an error message to the user
// 		});
// 	};

// 	const onSuccess = (result: any) => {
// 		console.log("IS_RESULT", result);
// 	};

//   //	const urlParams = new URLSearchParams(window.location.search);
//   //	const credential_types = (urlParams.get("credential_types")?.split(",") as CredentialType[]) ?? [
//   //		CredentialType.Orb,
//   //		CredentialType.Phone,
//   //	];

// 	const action = "my_action"
// 	const app_id = "app_3e9eeaff7bed8b8b6c50031ae88bda50"

// 	return (
// 		<div
// 			className="App"
// 			style={{
// 				minHeight: "100vh",
// 				display: "flex",
// 				justifyContent: "center",
// 				alignItems: "center",
// 			}}
// 		>
// 			<IDKitWidget
// 				action={action}
// 				signal="my_signal"
// 				onSuccess={onSuccess}
// 				handleVerify={handleProof}
// 				app_id={app_id}
//         //				credential_types={credential_types}
// 				// walletConnectProjectId="get_this_from_walletconnect_portal"
// 			>
// 				{({ open }: any) => <button onClick={open}>Click me</button>}
// 			</IDKitWidget>
// 		</div>
// 	);
// }
