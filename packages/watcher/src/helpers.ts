import {Contract} from "stays-core";
import {utils, Web3StorageApi} from '@windingtree/ipfs-apis';
import {logger} from "ethers";

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

export const Poller = (
  fn,
  enabled = true,
  interval = 5000,
  pollerName?: string
) => {
  if (typeof fn !== 'function') {
    throw new TypeError('Can\'t poll without a callback function');
  }

  let disabled = false;
  let failures = 0;

  const poll = async () => {
    if (disabled) {
      return;
    }

    try {
      await fn();
    } catch (error) {
      failures++;
      //logger.error(error);
    }

    if (failures < 100) {
      setTimeout(poll, interval);
    } else {
      logger.debug(`Too much errors in poller ${pollerName}. Disabled`);
    }
  }

  poll();
  logger.debug(`Poller ${pollerName} started`);

  return () => {
    disabled = true;
    failures = 0;
    logger.debug(`Poller ${pollerName} stopped`);
  };
};
