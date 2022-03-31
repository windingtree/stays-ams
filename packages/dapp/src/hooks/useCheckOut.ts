import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { Contract, StayTokenState } from 'stays-core';
import { useState, useEffect, useCallback } from 'react';
import { Dispatch } from '../store';
import { useContract } from './useContract';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useCheckOut');

export type UseCheckOut = [
  error: string | undefined,
  // loading: boolean
];

const loadTokens = async (contract: Contract, spaceId: string, state: StayTokenState): Promise<any> => {
  const tokens = await contract.getTokensBySpaceId(spaceId, state);
  const space = await contract.getSpace(spaceId);

  logger.debug('Loaded space:', spaceId, tokens);
  if (space === null) {
    throw new Error(`Space with Id: ${spaceId} not found`);
  }

  return {
    ...space,
    tokens
  };
}

const loadOwnersLodgingFacilities = async (
  contract: Contract,
  accout: string
): Promise<any[]> => {
  const facilityIds = await contract.getLodgingFacilityIdsByOwner(accout);
  logger.debug('Facilities Ids:', facilityIds);

  return Promise.all(
    facilityIds.map(
      async facilityId => {
        const facility = await contract.getLodgingFacility(facilityId);
        logger.debug('Loaded facility:', facilityId, facility);
        if (facility === null) {
          throw new Error(`Lodging facility with Id: ${facilityId} not found`);
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
};

// useCheckOut react hook
export const useCheckOut = (
  account: string | undefined,
  dispatch: Dispatch,
  provider: providers.JsonRpcProvider | undefined,
  ipfsNode: IPFS | undefined,
  ownerBootstrapped: number | undefined
): UseCheckOut => {
  const [contract, , contractError] = useContract(provider, ipfsNode);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (contractError) {
      console.log('kkk-error', account, contract)
      setError(contractError);
    }
  }, [contractError]);

  const loadAndDispatchFacilities = useCallback(
    async (contract: Contract, account: string) => {
      const lodgingFacilities = await loadOwnersLodgingFacilities(contract, account);

      const blockNumber = await contract.provider.getBlockNumber();

      // Add all obtained records to state
      for (const record of lodgingFacilities) {
        dispatch({
          type: 'SET_RECORD',
          payload: {
            name: 'ownerLodgingFacilities',
            record: {
              ...record,
              id: record.contractData.lodgingFacilityId
            }
          }
        });
      }

      // Set bootstrap procedure succeeded
      dispatch({
        type: 'SET_OWNER_BOOTSTRAPPED',
        payload: blockNumber
      });
    },
    [dispatch, account]
  );

  useEffect(() => {
    if (!!ownerBootstrapped || !contract || !account) {
      console.log('kkk-empty', account)
      return;
    }

    setError(undefined);

    // Remove all lodgingFacilities
    dispatch({
      type: 'RESET_RECORD',
      payload: {
        name: 'ownerLodgingFacilities'
      }
    });

    dispatch({
      type: 'SET_OWNER_BOOTSTRAP_LOADING',
      payload: true
    });

    loadAndDispatchFacilities(contract, account)
      .catch(error => {
        logger.error(error);
        const message = (error as Error).message ||
          'Unknown lodging facility loader error'
        setError(message);

        // Set bootstrap procedure failed
        dispatch({
          type: 'SET_OWNER_BOOTSTRAPPED',
          payload: 0
        });
      })
      .finally(() => {
        dispatch({
          type: 'SET_OWNER_BOOTSTRAP_LOADING',
          payload: false
        });
      });
  }, [dispatch, loadAndDispatchFacilities, ownerBootstrapped, contract, account]);

  // const getFacilitiesUpdates = useCallback(
  //   async () => {
  //     if (!bootstrapped || !contract) {
  //       return;
  //     }

  //     setError(undefined);

  //     try {
  //       await loadAndDispatchFacilities(contract);
  //     } catch (error) {
  //       logger.error(error);
  //       const message = (error as Error).message ||
  //         'Unknown lodging facility updates loader error'
  //       setError(message);
  //     }
  //   },
  //   [loadAndDispatchFacilities, bootstrapped, contract]
  // );

  // Check every <interval_time> for facilities and spaces updates
  // usePoller(
  //   getFacilitiesUpdates,
  //   !!contract,
  //   300000, // 5min @todo Move interval configuration to the Dapp config
  //   'getFacilitiesUpdates'
  // );

  return [error];
};
