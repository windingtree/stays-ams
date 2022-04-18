import {Contract} from "stays-core";
import {utils, Web3StorageApi} from '@windingtree/ipfs-apis';

export async function makeContract() {
  const key = process.env.APP_FILE_WEB3STORAGE_KEY || '';
  const contractAddress = process.env.APP_CONTRACT_ADDRESS || '';
  const provider = process.env.APP_NETWORK_PROVIDER || '';

  try {
    const ipfs = await utils.startIpfsGateway();
    const web3Storage = new Web3StorageApi(key, ipfs)
    return new Contract(
      contractAddress,
      provider,
      web3Storage
    );
  } catch (e) {
    //todo errors logger
  }
}
