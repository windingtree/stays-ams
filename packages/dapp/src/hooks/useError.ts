import { useMemo } from 'react';
import { useAppDispatch } from '../store';

export type UseErrorCallback = (error: string) => void;

export const useError = (): UseErrorCallback => {
  const dispatch = useAppDispatch();
  return useMemo(
    () => (error: string): void =>
      dispatch({
        type: 'ERROR_ADD',
        payload: error
      }),
    [dispatch]
  );
};
