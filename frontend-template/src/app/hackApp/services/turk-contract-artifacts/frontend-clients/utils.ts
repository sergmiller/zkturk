// Javascript to check if bytes32.
import {ethers} from "ethers";

function isBytes32(s: string) {
    try {
        ethers.utils.parseBytes32String(s)
    } catch (e) {
        console.log(s + ' is not valid bytes32')
        return false
    }
    return true
}

export function assertBytes32(s: string) {
    assert(isBytes32(s), "Arg is not bytes32: " + s)
}

export function stringToBytes32(s: string) {
    return ethers.utils.formatBytes32String(s)
}

export function assert(condition: boolean, message?: string) {
  if (!condition) {
      throw message || "Assertion failed";
  }
}
