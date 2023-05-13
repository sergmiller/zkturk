import React from 'react';
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";

function App() {

	const handleProof = (result) => {
		return new Promise((resolve) => {
			setTimeout(() => resolve(), 3000);
			// NOTE: Example of how to decline the verification request and show an error message to the user
		});
	};

	const onSuccess = (result) => {
		console.log("IS_RESULT", result);
	};

//	const urlParams = new URLSearchParams(window.location.search);
//	const credential_types = (urlParams.get("credential_types")?.split(",") as CredentialType[]) ?? [
//		CredentialType.Orb,
//		CredentialType.Phone,
//	];

	const action = "my_action"
	const app_id = "app_staging_a50d7cafca2dd77781ac6df8b9929179"

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
				signal="my_signal"
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