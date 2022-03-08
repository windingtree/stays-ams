import type { ReactNode } from 'react';
import type { Breadcrumb } from '../components/Breadcrumbs';
import { useContext } from 'react';
import { Box, ResponsiveContext } from 'grommet';
import { Breadcrumbs } from '../components/Breadcrumbs';

export interface PageWrapperProps {
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export const PageWrapper = ({ children, breadcrumbs }: PageWrapperProps) => {
  const size = useContext(ResponsiveContext);

  return (
    <Box fill pad={size}>
      <Breadcrumbs
        breadcrumbs={breadcrumbs}
        size={size}
      />
      {children}
    </Box>
  );
};
