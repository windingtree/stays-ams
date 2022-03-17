import type { EthRioStays } from 'stays-smart-contracts';
import type { LodgingFacilityRaw, LodgingFacility } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
import { DateTime } from 'luxon';
import { fetchDataUri } from '../utils/dataUri';

// Get facility by Id
export const getLodgingFacility = async (
  contract: EthRioStays,
  ipfsNode: IPFS,
  lodgingFacilityId: string
): Promise<LodgingFacility | null> => {
  const [
    exists,
    owner,
    active,
    dataURI
  ] = await contract.getLodgingFacilityById(lodgingFacilityId);

  if (!exists) {
    return null;
  }

  const data = await fetchDataUri<LodgingFacilityRaw>(ipfsNode, dataURI);

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
};
