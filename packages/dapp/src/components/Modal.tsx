import type { ReactNode } from 'react';
import { Box, Layer } from 'grommet';

export interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({
  show = false,
  onClose,
  children
}: ModalProps) => {

  if (!show) {
    return null;
  }

  return (
    <Box>
      <Layer
        style={{
          borderRadius: '2rem',
          height:'auto'
        }}
        onEsc={() => onClose()}
        onClickOutside={() => onClose()}
      >
        <Box responsive>
          {children}
        </Box>
      </Layer>
    </Box>
  );
};
