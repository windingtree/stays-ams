import type { providers } from 'ethers';
import { useState, useCallback } from 'react';
import { Box, Button, Grid, Text } from 'grommet';
import { Modal } from '../components/Modal';
import QRCode from 'react-qr-code';
import { useSignVoucher } from '../hooks/useSignVoucher';
import Logger from '../utils/logger';
import styled from 'styled-components';
import { CustomButton } from './SearchResultCard';

// Initialize logger
const logger = Logger('StayVoucherQr');

export const Title = styled(Text)`
  color: #0D0E0F;
  font-weight: 900;
  font-size: 28px;
  line-height: 32px;
  margin-bottom: .5rem;
`;

const Price = styled(Text)`
  color: #0D0E0F;
  font-weight: 900;
  font-size: 28px;
  line-height: 32px;
  margin-top: .5rem;
`;

const HotelTitle = styled(Text)`
  color: #0D0E0F;
  font-weight: 900;
  font-size: 22px;
  line-height: 28px;
  margin-bottom: .5rem;
  margin-top: 1.5rem;
`;

export const CustomText = styled(Text)`
  color: #0D0E0F;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  // margin-bottom: 1.5rem;
`;

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

        const voucher = await signCallback(
          from,
          to,
          tokenId
        );

        setQrData(JSON.stringify(voucher));
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
        label='Get check-in QR'
        onClick={handleGetQr}
      />

      <Modal
        show={!!qrData && typeof qrData === 'string'}
        onClose={() => setQrData(undefined)}
      >
        {typeof qrData === 'string' &&
          <Grid
            height='33rem'
            pad='large'
            gap='1rem'
            columns={['17rem', '16rem']}
            rows={['16rem', '16em']}
            areas={[
              { name: 'label', start: [0, 0], end: [0, 1] },
              { name: 'qr', start: [1, 0], end: [1, 0] },
              { name: 'hotel-data', start: [0, 1], end: [1, 1] },
            ]}
          >
            <Box
              gridArea='label'
              direction='column'
              align='start'
            >
              <Title>You stay is booked and is now an NFT.</Title>
              <CustomText>Please take a picture or download the QR code as it will be used for you to check-in at the property.</CustomText>
              <CustomButton
                label='Download QR'
                margin={{ top: '1.5rem' }}
                onClick={() => downloadQr(qrData.substring(0, 10))}
              />
            </Box>
            <Box
              gridArea='qr'
            >
              <QRCode
                size={256}
                id={qrData.substring(0, 10)}
                value={qrData}
              />
            </Box>
            <Box
              gridArea='hotel-data'
              border='top'
            >
              <HotelTitle>Hotel Jakarta Amsterdam</HotelTitle>
              <CustomText>Nieuwezijds Voorburgwal 50, 1012 SC Amsterdam, The Netherlands.</CustomText>
              <CustomText>25.03.22 - 27.03.22</CustomText>
              <CustomText>Economy Double Room, 2 persons.</CustomText>
              <Price>xxx</Price>
            </Box>
          </Grid>
        }
      </Modal>
    </Box>
  );
};
