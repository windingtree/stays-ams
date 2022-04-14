import type { ReactNode } from 'react';
import type { Breadcrumb } from '../components/Breadcrumbs';
import { useContext } from 'react';
import { Box, ResponsiveContext } from 'grommet';
import { useAppState } from '../store';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MessageBox } from '../components/MessageBox';
import { getNetwork } from '../config';

const { name: allowedNetworkName } = getNetwork();

export interface PageWrapperProps {
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export const PageWrapper = ({ children, breadcrumbs }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);
  const { isRightNetwork } = useAppState();

  return (
    <Box>
      <Box
        margin={{ left: 'auto', right: 'auto', bottom: 'xlarge' }}
        pad={{ horizontal: 'small'}}
        width={{ width: '100%', max: '900px' }}
      >
        <Breadcrumbs
          breadcrumbs={breadcrumbs}
          size={size}
        />
        <MessageBox type='warn' show={!isRightNetwork}>
          You are connected to a wrong network. Please switch to: {allowedNetworkName}
        </MessageBox>
        {children}
      </Box>
    </Box>
  );
};
