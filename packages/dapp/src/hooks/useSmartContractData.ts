import type { LodgingFacility, Space } from 'stays-data-models';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { Web3ModalProvider } from '../hooks/useWeb3Modal';
import type {  } from '../hooks/useIpfsNode';
import { useState, useEffect } from 'react';
import { Dispatch } from '../store';
import { useContract } from './useContract';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useSmartContractData');

export type UseSmartContractData = [
  error: string | undefined
]

// useSmartContractData react hook
export const useSmartContractData = (
  dispatch: Dispatch,
  provider: Web3ModalProvider | undefined,
  ipfsNode: IPFS | undefined,
  networkId: number | undefined,
  bootstrapped: boolean
): UseSmartContractData => {
  const [contract, contractLoading, contractError] = useContract(provider, ipfsNode, networkId);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (contractError) {
      setError(contractError);
    }
  }, [contractError]);

  useEffect(() => {
    if (bootstrapped || !contract || contractLoading) {
      return;
    }

    const loadSpace = async (spaceId: string): Promise<Space> => {
      const space = await contract.getSpace(spaceId);
      logger.debug('Loaded space:', spaceId, space);
      if (space === null) {
        throw new Error(`Space with Id: ${spaceId} not found`);
      }
      return space;
    };

    const loadLodgingFacilities = async (): Promise<LodgingFacility[]> => {
      const facilityIds = await contract.getLodgingFacilityIds(true);
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
                spaceId => loadSpace(spaceId)
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

    loadLodgingFacilities()
      .then(
        lodgingFacilities => {

          // Add all obtained records
          lodgingFacilities.forEach(
            record => dispatch({
              type: 'SET_RECORD',
              payload: {
                name: 'lodgingFacilities',
                record: {
                  ...record,
                  id: record.lodgingFacilityId
                }
              }
            })
          );

          // Set bootstrap procedure succeeded
          dispatch({
            type: 'SET_BOOTSTRAPPED',
            payload: true
          });
        }
      )
      .catch(error => {
        logger.error(error);
        const message = (error as Error).message ||
          'Unknown lodging facility loader error'
        setError(message);

        // Set bootstrap procedure failed
        dispatch({
          type: 'SET_BOOTSTRAPPED',
          payload: false
        });
      })
      .finally(() => {
        dispatch({
          type: 'SET_BOOTSTRAP_LOADING',
          payload: false
        });
      });

    ;
  }, [dispatch, bootstrapped, contract, contractLoading]);

  return [error];
};
