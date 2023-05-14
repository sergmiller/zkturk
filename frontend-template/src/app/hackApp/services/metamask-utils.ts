import { v4 as uuidv4 } from "uuid";

export class MetamaskUtils {
  public static formatBalance(rawBalance: string) {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
    return balance;
  }

  public static formatChainAsNum(chainIdHex: string) {
    const chainIdNum = parseInt(chainIdHex);
    return chainIdNum;
  }

  // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  public static newGuid() {
    return uuidv4();
  }
}
