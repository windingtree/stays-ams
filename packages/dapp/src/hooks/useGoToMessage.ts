import type { MessageBoxTypes } from '../components/MessageBox';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export type UseGoToMessageHook = (
  text: string,
  type?: MessageBoxTypes,
  path?: string,
  pathLabel?: string
) => void;

export interface MessageState {
  text: string;
  type: MessageBoxTypes;
  path?: string;
  pathLabel?: string;
}

export const useGoToMessage = (): UseGoToMessageHook => {
  const navigate = useNavigate();
  return useCallback(
    (text: string, type = 'info', path?: string, pathLabel?: string) =>
      navigate(
        '/message',
        {
          replace: true,
          state: {
            text,
            type,
            path,
            pathLabel,
          }
        }
      ),
    [navigate]
  );
};
