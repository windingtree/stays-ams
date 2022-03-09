import type { Space, LodgingFacility } from '../../../data-models';
import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useCallback, useEffect } from 'react';
import Logger from '../utils/logger';
import { ethers } from 'ethers';

// Initialize logger
const logger = Logger('useSmartContractData');

export type UseSmartContractData = [
  lodgingFacilities: LodgingFacility[],
]

// useSmartContractData react hook
export const useSmartContractData = (
  provider: Web3ModalProvider | undefined
): UseSmartContractData => {
  const [lodgingFacilities, setNode] = useState<LodgingFacility[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (loaded) {
      return
    }

    const setFacilities = async () => {
      try {
        setLoading(true);
        setError(undefined);
        if (!provider) {
          throw new Error('Provider is undefined')
        }
        // contract
        const contract = new ethers.Contract('','',provider);
        
        // logger.info(`listAccounts:`, accounts);
        // setAccount(accounts[0]);
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

    setFacilities();
    setLoaded(true)
  }, [loaded]);

  return [lodgingFacilities];
};
