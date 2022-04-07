import type { Stays } from 'stays-smart-contracts';
import type { SpaceRaw } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
import { uid } from '@windingtree/org.id-utils';
import { utils as ipfsUtils } from '@windingtree/ipfs-apis';
import { sendHelper } from '../utils/sendHelper';

export const updateSpace = async (
  contract: Stays,
  web3Storage: Web3StorageApi,
  spaceId: string,
  profileData: SpaceRaw,
  overrides?: MethodOverrides,
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<string> => {
  const profileDataFile = ipfsUtils.obj2File(
    profileData,
    `space${spaceId}_${uid.simpleUid(5)}.json`
  );
  const capacity = profileData.capacity;
  const pricePerNightWei = profileData.price;

  const ipfsCid = await web3Storage.add(profileDataFile);
  const dataURI = `ipfs://${ipfsCid.cid}`;

  overrides = overrides ? overrides : {};

  const receipt = await sendHelper(
    contract,
    'updateSpace',
    [
      spaceId,
      capacity,
      pricePerNightWei,
      dataURI
    ],
    undefined, // use already connected signer,
    overrides,
    transactionHashCb,
    confirmations
  );

  const event = receipt.events?.find(e => e.event == 'SpaceUpdated');
  const updatedSpaceId = event?.args?.spaceId;

  if (!updatedSpaceId) {
    throw new Error(`Unable to find "updatedSpaceId" in the transaction receipt`);
  }

  return updatedSpaceId;
};
