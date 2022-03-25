import type { providers } from 'ethers';
import { useState, useCallback } from 'react';
import { Box, Button } from 'grommet';
import { Modal } from '../components/Modal';
import QRCode from 'react-qr-code';
import { useSignVoucher } from '../hooks/useSignVoucher';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('StayVoucherQr');

export interface StayVoucherQrProps {
  provider: providers.JsonRpcProvider | undefined,
  from: string | undefined,
  to: string | undefined,
  tokenId: string,
  onError: (error: string) => void
}

export const StayVoucherQr = ({
  provider,
  from,
  to,
  tokenId,
  onError
}: StayVoucherQrProps) => {
  const [signCallback, isSignerReady] = useSignVoucher(provider);
  const [qrData, setQrData] = useState<string | undefined>();

  const downloadQr = (qrId: string): void => {
    const xml = (document as any).getElementById(qrId).outerHTML;
    const data = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
    const downloadElem = document.createElement('a');
    downloadElem.setAttribute('href', data);
    downloadElem.setAttribute('download', 'StaysVoucherQr.svg');
    downloadElem.click();
  }

  const handleGetQr = useCallback(
    async () => {
      try {
        if (!from) {
          throw new Error('Signer account is not connected yet');
        }

        if (!to) {
          throw new Error('Stay voucher recipient not defined');
        }

        const signature = await signCallback(
          from,
          to,
          tokenId
        );

        setQrData(signature);
      } catch (err) {
        logger.error(err);
        const message = (err as Error).message ||
          'Unknown QrTest error'
        onError(message);
      }
    },
    [signCallback, onError, from, to, tokenId]
  );

  if (!isSignerReady) {
    return null;
  }

  return (
    <Box>

      <Button
        label='Get QR'
        onClick={handleGetQr}
      />

      <Modal
        show={!!qrData && typeof qrData === 'string'}
        onClose={() => setQrData(undefined)}
      >
        {typeof qrData === 'string' &&
          <Box
            pad='medium'
            direction='column'
          >
            <Box
              pad='medium'
            >
              <QRCode
                id={qrData.substring(0, 10)}
                value={qrData}
              />
            </Box>
            <Box>
              <Button
                label='Download'
                onClick={() => downloadQr(qrData.substring(0, 10))}
              />
            </Box>
          </Box>
        }
      </Modal>
    </Box>
  );
};
