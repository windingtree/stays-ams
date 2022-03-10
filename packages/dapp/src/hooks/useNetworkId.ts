import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useNetworkId');

export type NetworkIdHook = [
  networkId: number | undefined,
  isNetworkIdLoading: boolean,
  isRightNetwork: boolean,
  error: string | null
];

// useNetworkId react hook
export const useNetworkId = (
  provider: Web3ModalProvider | undefined,
  allowedNetworks: number[]
): NetworkIdHook => {
  const [networkId, setNetworkId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRightNetwork, setIsRightNetwork] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

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

          if (allowedNetworks.includes(network.chainId)) {
            setNetworkId(network.chainId);
            setIsRightNetwork(true);
          } else {
            throw new Error(
              `Invalid network ${network.chainId} though expected one of ${JSON.stringify(allowedNetworks)}`
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
  }, [provider, allowedNetworks]);

  return [
    networkId,
    isLoading,
    isRightNetwork,
    error
  ];
};
