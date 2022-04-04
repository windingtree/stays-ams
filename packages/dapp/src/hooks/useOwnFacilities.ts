import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { Contract, StayTokenState } from 'stays-core';
import type { OwnerSpace } from '../store/actions';
import { useState, useEffect, useCallback } from 'react';
import { useError } from './useError';
import { useContract } from './useContract';
import { useAppDispatch } from '../store';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useOwnFacilities');

export type UseOwnFacilitiesHook = [
  loading: boolean,
  refresh: () => void,
  error: string | undefined
];

const loadTokens = async (
  contract: Contract,
  spaceId: string,
  state: StayTokenState
): Promise<OwnerSpace> => {
  const tokenIds = await contract.getTokensBySpaceId(spaceId, state);
  const space = await contract.getSpace(spaceId);
  const tokens = await Promise.all(
    tokenIds.map((t) => contract.getToken(t))
  )

  logger.debug('Loaded space:', spaceId, tokenIds);
  if (space === null) {
    throw new Error(`Space with Id: ${spaceId} not found`);
  }

  return {
    ...space,
    tokens
  };
}

export  const useOwnFacilities = (
  account: string | undefined,
  provider: providers.JsonRpcProvider | undefined,
  ipfsNode: IPFS | undefined,
): UseOwnFacilitiesHook => {
  const dispatchError = useError();
  const dispatch = useAppDispatch();
  const [contract,, contractError] = useContract(provider, ipfsNode);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const loadFacilities = useCallback(
    async (account: string | undefined) => {
      if (!contract || !account) {
        return;
      }

      try {
        setLoading(true);
        const facilityIds = await contract.getLodgingFacilityIdsByOwner(account);
        logger.debug('Facilities Ids:', facilityIds);

        const ownFacilities = await Promise.all(
          facilityIds.map(
            async facilityId => {
              const facility = await contract.getLodgingFacility(facilityId);
              logger.debug('Loaded facility:', facilityId, facility);

              if (facility === null) {
                throw new Error(
                  `Lodging facility with Id: ${facilityId} not found`
                );
              }

              const spaceIds = await contract.getSpaceIds(facilityId, true);
              logger.debug('Spaces Ids:', facilityId, spaceIds);

              const spaces = await Promise.all(
                spaceIds.map(
                  spaceId => loadTokens(contract, spaceId, 1)
                )
              );

              return {
                ...facility,
                spaces
              };
            }
          )
        );

        // Set own facilities state
        dispatch({
          type: 'SET_OWN_FACILITIES',
          payload: ownFacilities
        });
        setLoading(false);
      } catch (err) {
        logger.debug('loadFacilities', err);
        setError(
          (err as Error).message || 'Unknown own facilities loader error'
        );
        setLoading(false);
      }
    },
    [dispatch, contract]
  );

  const refresh = useCallback(
    () => loadFacilities(account),
    [loadFacilities, account]
  );

  useEffect(
    () => {
      if (contractError !== undefined) {
        logger.debug('contractError', contractError);
        dispatchError(contractError);
      }
    },
    [dispatchError, contractError]
  );

  useEffect(
    () => {
      if (!account) {
        // reset own facilities state
        dispatch({
          type: 'SET_OWN_FACILITIES',
          payload: []
        });
        return;
      }

      // Fetching of own facilities
      loadFacilities(account);
    },
    [dispatch, loadFacilities, account]
  );

  return [loading, refresh, error];
};
