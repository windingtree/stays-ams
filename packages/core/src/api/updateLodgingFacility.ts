import type { Stays } from 'stays-smart-contracts';
import type { LodgingFacilityRaw } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
import { uid } from '@windingtree/org.id-utils';
import { utils as ipfsUtils } from '@windingtree/ipfs-apis';
import { sendHelper } from '../utils/sendHelper';

export const updateLodgingFacility = async (
  contract: Stays,
  web3Storage: Web3StorageApi,
  lodgingFacilityId: string,
  profileData: LodgingFacilityRaw,
  overrides?: MethodOverrides,
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<string> => {
  const profileDataFile = ipfsUtils.obj2File(
    profileData,
    `lodgingFacility_${lodgingFacilityId}_${uid.simpleUid(5)}.json`
  );

  const ipfsCid = await web3Storage.add(profileDataFile);
  const dataURI = `ipfs://${ipfsCid}`;

  overrides = overrides ? overrides : {};

  const receipt = await sendHelper(
    contract,
    'updateLodgingFacility',
    [
      lodgingFacilityId,
      dataURI
    ],
    undefined, // use already connected signer,
    overrides,
    transactionHashCb,
    confirmations
  );

  const event = receipt.events?.find(e => e.event == 'LodgingFacilityUpdated');
  const facilityId = event?.args?.facilityId;

  if (!facilityId) {
    throw new Error(`Unable to find "facilityId" in the transaction receipt`);
  }

  return facilityId;
};
