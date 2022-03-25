import { useState, useCallback } from 'react';
import { Box, Button, Spinner } from 'grommet';
import { PageWrapper } from '../pages/PageWrapper';
import { Modal } from '../components/Modal';
import { MessageBox } from '../components/MessageBox';
import QRCode from 'react-qr-code';
import { useAppState } from '../store';
import { useSignVoucher } from '../hooks/useSignVoucher';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('QrTest');

export const QrTest = () => {
  const { provider, account } = useAppState();
  const [signCallback, isSignerReady] = useSignVoucher(provider);
  const [qrData, setQrData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);

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
      setError(undefined);

      try {
        if (!account) {
          throw new Error('Signer account is not connected yet');
        }

        const signature = await signCallback(
          account,
          '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          '1'
        );

        setQrData(signature);
      } catch (err) {
        logger.error(err);
        const message = (err as Error).message ||
          'Unknown QrTest error'
        setError(message);
      }
    },
    [signCallback, account]
  );

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home',
        },
      ]}
    >
      <Box>

        <MessageBox type='info' show={!isSignerReady}>
          <Box direction='row'>
            <Box>
              Data signer is not ready. Please wait..&nbsp;
            </Box>
            <Spinner />
          </Box>
        </MessageBox>

        <MessageBox type='error' show={!!error}>
          <Box>
            {error}
          </Box>
        </MessageBox>

        {isSignerReady &&
          <Button
            label='Get my QR'
            onClick={handleGetQr}
          />
        }

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
    </PageWrapper>
  );
};
