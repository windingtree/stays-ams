import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useEffect } from 'react';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useAccount');

export type UseAccountHook = [
  account: string | undefined,
  isLoading: boolean,
  error: string | undefined
];

// useAccount react hook
export const useAccount = (
  provider: Web3ModalProvider | undefined
): UseAccountHook => {
  const [account, setAccount] = useState<string | undefined>();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!provider) {
      return setAccount(undefined);
    }

    const getAccount = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const accounts = await provider.listAccounts();
        logger.info(`listAccounts:`, accounts);
        setAccount(accounts[0]);
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

    getAccount();
  }, [provider]);

  return [account, isLoading, error];
};
