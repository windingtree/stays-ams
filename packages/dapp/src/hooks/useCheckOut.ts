import type { providers } from 'ethers';
import type { IPFS } from '@windingtree/ipfs-apis';
import type { Contract, StayTokenState } from 'stays-core';
import { useState, useEffect, useCallback } from 'react';
import { Dispatch } from '../store';
import { useContract } from './useContract';
import Logger from '../utils/logger';
import { OwnerLodgingFacility, OwnerSpace } from '../store/actions';
import { MethodOverrides, TxHashCallbackFn } from 'stays-core/dist/src/utils/sendHelper';
// import { usePoller } from './usePoller';

// Initialize logger
const logger = Logger('useCheckOut');

export type UseCheckOut = [
  ownerLodgingFacilities: OwnerLodgingFacility[],
  checkOut: (
    tokenId: string,
    overrides?: MethodOverrides,
    transactionHashCb?: TxHashCallbackFn,
    confirmations?: number
  ) => void,
  error: string | undefined,
  // loading: boolean
];

const loadTokens = async (contract: Contract, spaceId: string, state: StayTokenState): Promise<OwnerSpace> => {
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

const loadOwnersLodgingFacilities = async (
  contract: Contract,
  accout: string
): Promise<OwnerLodgingFacility[]> => {
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
  const [ownerLodgingFacilities, setOwnerLodgingFacilities] = useState<OwnerLodgingFacility[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (contractError) {
      setError(contractError);
    }
  }, [contractError]);

  const loadAndDispatchFacilities = useCallback(
    async (contract: Contract, account: string) => {
      const lodgingFacilities = await loadOwnersLodgingFacilities(contract, account);

      // const blockNumber = await contract.provider.getBlockNumber();
      // const newFacilities = []
      // Add all obtained records to state
      // for (const record of lodgingFacilities) {
      //   newFacilities.push({
      //     ...record,
      //     id: record.contractData.lodgingFacilityId
      //   })
      // dispatch({
      //   type: 'SET_RECORD',
      //   payload: {
      //     name: 'ownerLodgingFacilities',
      //     record: {
      //       ...record,
      //       id: record.contractData.lodgingFacilityId
      //     }
      //   }
      // });
      // }
      setOwnerLodgingFacilities(lodgingFacilities)

      // Set bootstrap procedure succeeded
      // dispatch({
      //   type: 'SET_OWNER_BOOTSTRAPPED',
      //   payload: blockNumber
      // });
    },
    []
  );

  useEffect(() => {
    if (!contract || !account) {
      console.log('kkk-empty', account)
      return;
    }

    setError(undefined);

    // Remove all lodgingFacilities
    // dispatch({
    //   type: 'RESET_RECORD',
    //   payload: {
    //     name: 'ownerLodgingFacilities'
    //   }
    // });

    // dispatch({
    //   type: 'SET_OWNER_BOOTSTRAP_LOADING',
    //   payload: true
    // });

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

  const checkOut = useCallback(
    async (tokenId: string, overrides?: MethodOverrides, transactionHashCb?: TxHashCallbackFn, confirmations?: number) => {
      console.log(ownerBootstrapped,contract,account)
      if (!contract || !account || !tokenId) {
        return;
      }

      setError(undefined);
      console.log(tokenId, overrides, transactionHashCb, confirmations)
      try {
        await contract.checkOut(tokenId, overrides, transactionHashCb);
      } catch (error) {
        logger.error(error);
        const message = (error as Error).message ||
          'Unknown check out error'
        setError(message);
      }
    },
    [loadAndDispatchFacilities, contract, account]
  );

  // // Check every <interval_time> for facilities and spaces updates
  // usePoller(
  //   getFacilitiesUpdates,
  //   !!contract,
  //   300000, // 5min @todo Move interval configuration to the Dapp config
  //   'getFacilitiesUpdates'
  // );
  // const getFacilitiesUpdates = useCallback(
  //   async () => {
  //     if (!ownerBootstrapped || !contract || !account) {
  //       return;
  //     }

  //     setError(undefined);

  //     try {
  //       await loadAndDispatchFacilities(contract, account);
  //     } catch (error) {
  //       logger.error(error);
  //       const message = (error as Error).message ||
  //         'Unknown lodging facility updates loader error'
  //       setError(message);
  //     }
  //   },
  //   [loadAndDispatchFacilities, ownerBootstrapped, contract, account]
  // );

  // // Check every <interval_time> for facilities and spaces updates
  // usePoller(
  //   getFacilitiesUpdates,
  //   !!contract,
  //   300000, // 5min @todo Move interval configuration to the Dapp config
  //   'getFacilitiesUpdates'
  // );


  return [ownerLodgingFacilities, checkOut, error];
};
