import type { EthRioStays } from 'stays-smart-contracts';
import type { SpaceRaw, Space } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
import { DateTime } from 'luxon';
import { fetchDataUri } from '../utils/dataUri';

// Get space by Id
export const getSpace = async (
  contract: EthRioStays,
  ipfsNode: IPFS,
  spaceId: string
): Promise<Space | null> => {
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

  const data = await fetchDataUri<SpaceRaw>(ipfsNode, dataURI);

  return {
    ...data,
    contractData: {
      spaceId,
      active,
      lodgingFacilityId,
      capacity,
      pricePerNightWei,
      dataURI,
    },
    updated: DateTime.now().toISO()
  };
};
