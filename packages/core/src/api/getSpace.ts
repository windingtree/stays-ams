import type { Stays } from 'stays-smart-contracts';
import type { SpaceRaw, Space } from 'stays-data-models';
import type { Web3StorageApi } from '@windingtree/ipfs-apis';
import { DateTime } from 'luxon';
import { fetchDataUri } from '../utils/dataUri';

// Get space by Id
export const getSpace = async (
  contract: Stays,
  web3Storage: Web3StorageApi,
  spaceId: string
): Promise<Space | null> => {
  try {
    const [
      exists,
      lodgingFacilityId,
      capacity,
      pricePerNightWei,
      active,
      dataURI
    ] = await contract.getSpaceById(spaceId);

    if (!exists) {
      return null;
    }

    const data = await fetchDataUri<SpaceRaw>(web3Storage, dataURI);

    return {
      ...data,
      contractData: {
        spaceId,
        active,
        lodgingFacilityId,
        capacity: capacity.toNumber(),
        pricePerNightWei: pricePerNightWei.toString(),
        dataURI,
      },
      updated: DateTime.now().toISO()
    };
  } catch(_) {
    return null;
  }
};
