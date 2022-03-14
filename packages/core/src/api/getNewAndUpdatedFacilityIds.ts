import type { EthRioStays } from 'stays-smart-contracts';

export const getNewAndUpdatedFacilityIds = async (
  contract: EthRioStays,
  fromBlock: number
) => {
  const facilitiesIds = new Set<string>();
  const facilityCreatedFilter = contract.filters.LodgingFacilityCreated();
  const facilityUpdatedFilter = contract.filters.LodgingFacilityUpdated();
  const spaceCreatedFilter = contract.filters.SpaceAdded();
  const spaceUpdatedFilter = contract.filters.SpaceUpdated();

  const facilityCreated = await contract.queryFilter(
    facilityCreatedFilter,
    fromBlock,
    'latest'
  );
  const facilityUpdated = await contract.queryFilter(
    facilityUpdatedFilter,
    fromBlock,
    'latest'
  );
  const spaceCreated = await contract.queryFilter(
    spaceCreatedFilter,
    fromBlock,
    'latest'
  );
  const spaceUpdated = await contract.queryFilter(
    spaceUpdatedFilter,
    fromBlock,
    'latest'
  );
  [
    ...facilityCreated,
    ...facilityUpdated,
    ...spaceCreated,
    ...spaceUpdated
  ].forEach(
    event => facilitiesIds.add(event.args.facilityId)
  );

  // @todo Process removal of facilities and spaces

  return Array.from(facilitiesIds);
};
