export class MetamaskUtils {
  public static formatBalance(rawBalance: string) {
    const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
    return balance;
  }

  public static formatChainAsNum(chainIdHex: string) {
    const chainIdNum = parseInt(chainIdHex);
    return chainIdNum;
  }
}
