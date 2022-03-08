import { useContext } from 'react';
import { Header, Footer, Box, Button, Text, ResponsiveContext } from 'grommet';
import { Modal } from './Modal';

export interface ConfirmationProps {
  show: boolean;
  title: string;
  message: string,
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const Confirmation = ({
  show,
  title,
  message,
  onCancel = () => {},
  onConfirm = () => {}
}: ConfirmationProps) => {
  const size = useContext(ResponsiveContext);

  return (
    <Modal
      show={show}
      onClose={onCancel}
    >
      <Header pad={size} background='light-1'>
        <Text size='xlarge' weight='bold'>{title}</Text>
      </Header>
      <Box pad={size}>
        <Text size={size}>{message}</Text>
      </Box>
      <Footer
        direction='row'
        align='center'
        background='light-2'
        pad={size}
        gap={size}
      >
        <Button
          primary
          size='large'
          type='submit'
          label='Ok'
          onClick={onConfirm}
        />
        <Button
          size='large'
          type='reset'
          label='Cancel'
          onClick={onCancel}
        />
      </Footer>
    </Modal>
  );
};
