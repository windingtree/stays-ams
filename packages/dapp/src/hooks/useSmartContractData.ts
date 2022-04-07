import type { providers } from 'ethers';
import type { LodgingFacility, Space } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { Contract } from 'stays-core';
import { useState, useEffect, useCallback } from 'react';
import { Dispatch } from '../store';
import { useContract } from './useContract';
import { usePoller } from './usePoller';
import { getNetwork } from '../config';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useSmartContractData');

export type UseSmartContractDataHook = [
  error: string | undefined
];

const loadSpace = async (contract: Contract, spaceId: string): Promise<Space | null> => {
  const space = await contract.getSpace(spaceId);
  logger.debug('Loaded space:', spaceId, space);
  if (space === null) {
    logger.error(`Space with Id: ${spaceId} not found`);
    return null;
  }
  return space;
}

const loadLodgingFacilities = async (
  contract: Contract,
  fromBlock?: number
): Promise<LodgingFacility[]> => {
  const facilityIds = !!fromBlock
    ? await contract.getNewAndUpdatedFacilityIds(fromBlock)
    : await contract.getLodgingFacilityIds(true);
  logger.debug('Facilities Ids:', facilityIds);

  const facilities = await Promise.all(
    facilityIds.map(
      async facilityId => {
        const facility = await contract.getLodgingFacility(facilityId);
        logger.debug('Loaded facility:', facilityId, facility);

        if (facility === null) {
          logger.error(`Lodging facility with Id: ${facilityId} not found`);
          return null;
        }

        const spaceIds = await contract.getSpaceIds(facilityId, true);
        logger.debug('Spaces Ids:', facilityId, spaceIds);

        let spaces = await Promise.all(
          spaceIds.map(
            spaceId => loadSpace(contract, spaceId)
          )
        );
        spaces = spaces.filter(s => s !== null)

        return {
          ...facility,
          spaces: spaces as Space[]
        };
      }
    )
  );

  return facilities.filter(f => f !== null) as LodgingFacility[];
};

// useSmartContractData react hook
export const useSmartContractData = (
  dispatch: Dispatch,
  provider: providers.JsonRpcProvider | undefined,
  ipfsNode: IPFS | undefined,
  bootstrapped: number | undefined
): UseSmartContractDataHook => {
  const [contract,, contractError] = useContract(provider, ipfsNode);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (contractError) {
      setError(contractError);
    }
  }, [contractError]);

  const loadAndDispatchFacilities = useCallback(
    async (contract: Contract, fromBlock?: number) => {
      const lodgingFacilities = await loadLodgingFacilities(contract, fromBlock);
      logger.debug(`Facilities from block ${fromBlock ? fromBlock : 0}`, lodgingFacilities);

      if (fromBlock !== undefined && lodgingFacilities.length === 0) {
        return;
      }

      const blockNumber = await contract.provider.getBlockNumber();

      // Add all obtained records to state
      for (const record of lodgingFacilities) {
        dispatch({
          type: 'SET_RECORD',
          payload: {
            name: 'lodgingFacilities',
            record: {
              ...record,
              id: record.contractData.lodgingFacilityId
            }
          }
        });
      }

      // Set bootstrap procedure succeeded
      dispatch({
        type: 'SET_BOOTSTRAPPED',
        payload: blockNumber
      });
      dispatch({
        type: 'SET_BOOTSTRAPPED_CONTRACT',
        payload: getNetwork().address
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (!!bootstrapped || !contract) {
      return;
    }

    setError(undefined);

    // Remove all lodgingFacilities
    dispatch({
      type: 'RESET_RECORD',
      payload: {
        name: 'lodgingFacilities'
      }
    });

    dispatch({
      type: 'SET_BOOTSTRAP_LOADING',
      payload: true
    });

    loadAndDispatchFacilities(contract)
      .catch(error => {
        logger.error(error);
        const message = (error as Error).message ||
          'Unknown lodging facility loader error'
        setError(message);

        // Set bootstrap procedure failed
        dispatch({
          type: 'SET_BOOTSTRAPPED',
          payload: 0
        });
      })
      .finally(() => {
        dispatch({
          type: 'SET_BOOTSTRAP_LOADING',
          payload: false
        });
      });
  }, [dispatch, loadAndDispatchFacilities, bootstrapped, contract]);

  const getFacilitiesUpdates = useCallback(
    async () => {
      if (!bootstrapped || !contract) {
        return;
      }

      setError(undefined);

      try {
        await loadAndDispatchFacilities(contract, bootstrapped);
      } catch(error) {
        logger.error(error);
        const message = (error as Error).message ||
          'Unknown lodging facility updates loader error'
        setError(message);
      }
    },
    [loadAndDispatchFacilities, bootstrapped, contract]
  );

  // Check every <interval_time> for facilities and spaces updates
  usePoller(
    getFacilitiesUpdates,
    !!contract,
    300000, // 5min @todo Move interval configuration to the Dapp config
    'getFacilitiesUpdates'
  );

  return [error];
};
