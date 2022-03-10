import type { providers } from 'ethers';
import type { EthRioStays } from 'stays-smart-contracts';
import type { LodgingFacilityRaw } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { MethodOverrides, TxHashCallbackFn } from '../utils/sendHelper';
import { uid } from '@windingtree/org.id-utils';
import { utils as ipfsUtils } from '@windingtree/ipfs-apis';
import { sendHelper } from '../utils/sendHelper';

// Register facility
export const registerLodgingFacility = async (
  contract: EthRioStays,
  ipfsNode: IPFS,
  profileData: LodgingFacilityRaw,
  active = true,
  fren?: string,
  overrides?: MethodOverrides,
  transactionHashCb?: TxHashCallbackFn,
  confirmations = 1
): Promise<string> => {

  const profileDataFile = ipfsUtils.obj2File(
    profileData,
    `lodgingFacility_${uid.simpleUid()}.json`
  );

  const ipfsCid = await ipfsNode.add(profileDataFile);
  const dataURI = `ipfs://${ipfsCid}`;

  overrides = overrides ? overrides : {};
  const owner = (contract.provider as providers.Web3Provider).getSigner();

  const receipt = await sendHelper(
    contract,
    fren
      ? 'registerLodgingFacility(string,bool,address)'
      : 'registerLodgingFacility(string,bool)',
    [
      dataURI,
      active,
      ...(fren ? [fren] : [])
    ],
    owner,
    overrides,
    transactionHashCb,
    confirmations
  );

  const event = receipt.events?.find(e => e.event == 'LodgingFacilityCreated');
  const facilityId = event?.args?.facilityId;

  if (!facilityId) {
    throw new Error(`Unable to find "facilityId" in the transaction receipt`);
  }

  return facilityId;
};