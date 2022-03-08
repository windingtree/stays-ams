import type { Web3ModalProvider } from './useWeb3Modal';
import { useState, useCallback } from 'react';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('useRequestPermissions');

export const allowedWalletPermissionsTypes: string[] =
	['eth_accounts'];

export type WalletPermissionType =
	typeof allowedWalletPermissionsTypes[number];

export type UseRequestPermissionsHook = [
  requestPermissions: (
    permissionType: WalletPermissionType,
    permissionParameters: unknown
  ) => Promise<void>,
  isLoading: boolean,
  error: string | undefined
];

// useRequestPermissions react hook
export const useRequestPermissions = (
  provider: Web3ModalProvider | undefined
): UseRequestPermissionsHook => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setLoading] = useState(false);

  const requestPermissions = useCallback(async (
    permissionType: WalletPermissionType = 'eth_accounts',
    permissionParameters: unknown = {}
  ) => {
    try {
      setError(undefined);
      if (provider) {
        setLoading(true);
        await provider.send(
          'wallet_requestPermissions',
          [
            {
              [permissionType]: permissionParameters
            }
          ]
        );
        setLoading(false);
      } else {
        throw new Error(
          'Wallet not connected yet. Cannot request permissions.'
        );
      }
    } catch (error) {
      logger.error(error);
      setError(
        (error as Error).message || 'Unknown useRequestPermissions error'
      );
      setLoading(false);
    }
  }, [provider]);

  return [
    requestPermissions,
    isLoading,
    error
  ];
};
