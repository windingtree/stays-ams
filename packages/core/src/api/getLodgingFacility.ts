import type { Stays } from 'stays-smart-contracts';
import type { LodgingFacilityRaw, LodgingFacility } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import { DateTime } from 'luxon';
import { fetchDataUri } from '../utils/dataUri';

// Get facility by Id
export const getLodgingFacility = async (
  contract: Stays,
  web3Storage: Web3StorageApi,
  lodgingFacilityId: string
): Promise<LodgingFacility | null> => {
  try {
    const [
      exists,
      owner,
      active,
      dataURI
    ] = await contract.getLodgingFacilityById(lodgingFacilityId);

    if (!exists) {
      return null;
    }

    const data = await fetchDataUri<LodgingFacilityRaw>(web3Storage, dataURI);

    return {
      ...data,
      contractData: {
        lodgingFacilityId,
        owner,
        active,
        dataURI,
      },
      spaces: [],
      updated: DateTime.now().toISO()
    };
  } catch(_) {
    return null;
  }
};
