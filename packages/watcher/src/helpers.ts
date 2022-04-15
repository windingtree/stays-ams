import {Contract} from "stays-core";
import {utils, Web3StorageApi} from '@windingtree/ipfs-apis';

export async function makeContract() {
  const key = process.env.APP_FILE_WEB3STORAGE_KEY || '';

  try {
    const ipfs = await utils.startIpfsGateway();
    const web3Storage = new Web3StorageApi(key, ipfs)
    return new Contract(
      '0xAD4B90b5053F7382A1313812559E044219BAE523', //todo env
      'https://sokol.poa.network/',
      web3Storage
    );
  } catch (e) {
    //todo errors logger
  }
}
