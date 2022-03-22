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
    <Box fill pad={size}>
      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        size={size}
      />
      <Box align='center'>
        <Box width='xxlarge'>
          <MessageBox type='warn' show={!isRightNetwork}>
            You are connected to a wrong network. Please switch to: {allowedNetworkName}
          </MessageBox>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
