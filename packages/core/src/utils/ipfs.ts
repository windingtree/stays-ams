import type { Web3StorageApi } from '@windingtree/ipfs-apis';

export const ipfsCidResolver = (web3Storage: Web3StorageApi) => async (cid: string) => {
  try {
    const rawResource = await Promise.race([
      web3Storage.get(cid),
      new Promise(
        (_, reject) => setTimeout(
          () => reject(new Error(`Timeout occurred during getting cid: ${cid}`)),
          70000 // @todo Move timeout value to the Dapp configuration
        )
      )
    ]) as string;

    try {
      return JSON.parse(rawResource);
    } catch (error) {
      throw new Error(`Unable to parse ORGiD VC from the CID: ${cid}`);
    }
  } catch (error) {
    throw error;
  }
};
