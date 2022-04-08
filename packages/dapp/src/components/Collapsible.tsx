import type { ReactNode } from 'react';
import { Box } from 'grommet';

export interface CollapsibleProps {
  open: boolean;
  children: ReactNode;
}

export const Collapsible = ({ open, children }: CollapsibleProps) => (
  <Box
    responsive
    animation={open ? 'fadeIn' : 'fadeOut'}
    height={open ? 'auto' : '0px'}
    overflow='hidden'
  >
    {children}
  </Box>
);
