// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  networkIdToContractAddress: {
    //   TODO: more networks.
    // 137: "0xD9245acA14c7E1985e8E16CB987Cd11C7b485c53",
    80001: '0xFa024FEcebE35A552C564E6eA2c38ecF52Be7a9f', //mumbai
    // 10200: "0x5a1b840CB796c697C1185dB9F43432C08Ba7B6AA",
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
