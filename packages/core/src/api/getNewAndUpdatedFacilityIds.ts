import type { Stays } from 'stays-smart-contracts';

export const getNewAndUpdatedFacilityIds = async (
  contract: Stays,
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
  const spaceIds = spaceUpdated.map(e => e.args.spaceId);
  const spaces = await Promise.all(
    spaceIds.map(
      spaceId => contract.getSpaceById(spaceId)
    )
  );
  const facilitiesFromSpaces = spaces.map(
    s => s.lodgingFacilityId
  );
  [
    ...facilityCreated,
    ...facilityUpdated,
    ...spaceCreated,
  ].forEach(
    event => facilitiesIds.add(event.args.facilityId)
  );
  facilitiesFromSpaces.forEach(
    facilityId => facilitiesIds.add(facilityId)
  );

  // @todo Process removal of facilities and spaces

  return Array.from(facilitiesIds);
};
