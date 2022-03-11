import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useNetworkId');

export type NetworkIdHook = [
  networkId: number | undefined,
  isNetworkIdLoading: boolean,
  isRightNetwork: boolean,
  error: string | undefined
];

// useNetworkId react hook
export const useNetworkId = (
  provider: Web3ModalProvider | undefined,
  allowedNetwork: number
): NetworkIdHook => {
  const [networkId, setNetworkId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRightNetwork, setIsRightNetwork] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setError(undefined);

    if (!provider) {
      return setNetworkId(undefined);
    }

    const getNetworkId = async () => {
      try {
        setIsLoading(true);
        const network = await provider.getNetwork();
        setIsLoading(false);
        logger.debug('getNetwork:', network);

        if (network) {

          if (allowedNetwork === network.chainId) {
            setNetworkId(network.chainId);
            setIsRightNetwork(true);
          } else {
            throw new Error(
              `Invalid network ${network.chainId} though expected ${allowedNetwork}`
            );
          }
        } else {
          setNetworkId(undefined);
          setIsRightNetwork(false);
        }
      } catch (error) {
        setIsLoading(false);
        setNetworkId(undefined);
        setIsRightNetwork(false);

        if (error) {
          logger.error(error);
          setError((error as Error).message);
        } else {
          logger.error('Unknown error');
        }
      }
    };

    getNetworkId();
  }, [provider, allowedNetwork]);

  return [
    networkId,
    isLoading,
    isRightNetwork,
    error
  ];
};
