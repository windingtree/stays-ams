import { Button, Box } from 'grommet';
import React, { useState } from 'react';
import { QrReader as QrCodeReader } from 'react-qr-reader';
import { Modal } from './Modal';

export const QrReader: React.FC<{
  onScan(data: string): void;
  onError(data: string): void
}> = ({ onScan,onError }) => {
  const [show, setShow] = useState(false);

  return (
    <Box>
      <Button label='Scan QR' onClick={() => setShow(true)} />
      <Modal
        show={show}
        onClose={() => setShow(false)}
      >
        <Box
          pad='medium'
          direction='column'
          width='medium'
        >
          <QrCodeReader
            constraints={{ facingMode: 'user' }}
            onResult={(result, error) => {
              if (error) {
                onError(error.message);
              }
              if (!!result) {
                onScan(result.getText())
                setShow(false)
              }
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};
