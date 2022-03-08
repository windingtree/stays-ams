import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppState } from '../store';

export interface ProtectedProps {
  component: ReactNode;
  path?: string;
}

export const Protected = ({
    component,
    path = '/'
  }: ProtectedProps) => {
  const location = useLocation();
  const { account } = useAppState();

  return (
    <>
      {
        account !== undefined
          ? component
          : <Navigate to={path} state={{ location }} />
      }
    </>
  );
}
