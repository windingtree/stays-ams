import { LodgingFacility, Space } from 'stays-data-models';
import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useCallback, useEffect } from 'react';
import Logger from '../utils/logger';
// import { ethers } from 'ethers';
import { EthRioContract } from 'stays-core';

// Initialize logger
const logger = Logger('useSmartContractData');

export type UseSmartContractData = [
  lodgingFacilities: LodgingFacility[],
  bootstraped: boolean,
  error: string | undefined,
  loading: boolean,
]

// useSmartContractData react hook
export const useSmartContractData = (
  provider: Web3ModalProvider | undefined
): UseSmartContractData => {
  const [lodgingFacilities, setLodgingFacilities] = useState<LodgingFacility[]>([]);
  const [bootstraped, setBootstraped] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (bootstraped) {
      return
    }

    const loadFacilities = async () => {
      try {
        setLoading(true);
        setError(undefined);
        if (!provider) {
          throw new Error('Provider is undefined')
        }
        // contract
        const contract = new EthRioContract()
        const facilityIds = await contract.getLodgingFacilityIds(true)
        // const promise = facilityIds.map((id) => {contract.getLodgingFacility(id)})
        const promise = facilityIds.map(async (id) => {
          try {
            let facility = await contract.getLodgingFacility(id)
            if (facility === null) {
              throw new Error(`invalid lodgingFacility id`)
            }
            const spaceIds = await contract.getSpaceIds(id, true)
            const spaces = await Promise
              .all(spaceIds.map((id) => contract.getSpace(id)))
              .then((res) => {
                const f = res.filter((element): element is Space => {
                  return element !== null;
                });
                return f
              })
            facility = { ...facility, spaces }
            return facility
          } catch (e) {
            throw new Error((e as Error).message)
          }
        })

        const facilities = await Promise.all(promise)
        // const facilities = await Promise.all(facilityIds.map((id) => contract.getLodgingFacility(id)))

        // const spaceIds = await Promise.all(facilityIds.map((id) => contract.getSpaceIds(id, true)))
        // .then(response => {

        //   return response
        // })

        setLodgingFacilities(facilities)
        setLoading(false);
      } catch (error) {
        setLoading(false);

        if (error) {
          logger.error(error);
          setError((error as Error).message);
        } else {
          logger.error('Unknown error');
        }
      }
    };

    loadFacilities();
    setBootstraped(true)
  }, [bootstraped]);

  return [lodgingFacilities, bootstraped, error, loading];
};
