import type { StayToken } from 'stays-core';
import { useMemo, useState } from 'react';
import * as Icons from 'grommet-icons';
import { Grid, Button, Box, Text } from 'grommet';
import { MessageBox } from '../MessageBox';
import { CustomText, StayVoucherQr } from '../StayVoucherQr';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../store';
import { useContract } from '../../hooks/useContract';
import { centerEllipsis } from '../../utils/strings';
import { getNetwork } from '../../config';
import { ExternalLink } from '../ExternalLink';
// import { useGoToMessage } from '../hooks/useGoToMessage';
import { LodgingFacilityRecord } from '../../store/actions';
import styled from 'styled-components';
// import { CustomButton } from '../SearchResultCard';
import { useWindowsDimension } from '../../hooks/useWindowsDimension';

export const CustomBoldText = styled(Text)`
  color: #0D0E0F;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
`;

interface TokenViewProps extends StayToken {
  facilityOwner: string | undefined;
  facility: LodgingFacilityRecord | undefined;
  withCloseButton?: boolean;
  withRpcProvider?: boolean;
}

export const TokenView = ({
  tokenId,
  owner,
  facilityOwner,
  facility,
  status,
  data: {
    name,
    description,
    image,
    attributes
  },
  withCloseButton = true,
  withRpcProvider = false
}: TokenViewProps) => {
  const { winWidth } = useWindowsDimension();
  const { provider, rpcProvider, ipfsNode } = useAppState();
  const [, , contractError] = useContract(
    withRpcProvider ? rpcProvider : provider,
    ipfsNode
  );
  const navigate = useNavigate();
  // const showMessage = useGoToMessage();
  // const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [cancellationTxHash,] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const cancellationTxHashLink = useMemo(() => {
    const network = getNetwork()
    return cancellationTxHash ? `${network.blockExplorer}/tx/${cancellationTxHash}` : '#'
  }, [cancellationTxHash]);

  // const cancelTx = useCallback(
  //   async () => {
  //     setError(undefined);
  //     setCancellationTxHash(undefined);
  //     if (!contract) {
  //       return;
  //     }
  //     try {
  //       setCancelLoading(true);
  //       await contract.cancel(tokenId, undefined, setCancellationTxHash);
  //       setCancelLoading(false);
  //       // Show success message;
  //       showMessage(
  //         `Stay token #${tokenId} is successfully cancelled. All funds are fully refunded`,
  //         'info'
  //       );
  //     } catch (err) {
  //       setError((err as Error).message || 'Unknown cancellation error');
  //       setCancelLoading(false);
  //     }
  //   },
  //   [showMessage, contract, tokenId]
  // );

  if (!attributes || !facility) {
    return null;
  }

  return (
    <Box
      alignSelf='center'
      direction='column'
      pad={{ bottom: 'medium' }}
      style={{ position: 'relative' }}
    >
      <Box
        direction={winWidth > 768 ? 'row' : 'column'}
        justify='between'
        pad='large'
        round={false}
        width='65rem'
        style={{ borderBottom: '1px solid black' }}
      >
        <Box>
          <Grid
            fill='horizontal'
            pad='small'
            columns={['small', 'auto']}
            responsive
          >
            <Box>
              <CustomBoldText weight='bold'>Status</CustomBoldText>
            </Box>
            <Box>
              <CustomText>{status ?? 'unknown'}</CustomText>
            </Box>
          </Grid>
          <Grid
            fill='horizontal'
            pad='small'
            columns={['small', 'auto']}
            responsive
          >
            <Box>
              <CustomBoldText weight='bold'>Name</CustomBoldText>
            </Box>
            <Box>
              <CustomText>{name}</CustomText>
            </Box>
          </Grid>
          <Grid
            fill='horizontal'
            pad='small'
            columns={['small', 'auto']}
            responsive
          >
            <Box>
              <CustomBoldText weight='bold'>Description</CustomBoldText>
            </Box>
            <Box>
              <CustomText>{description}</CustomText>
            </Box>
          </Grid>
        </Box>

        <Box pad={{ vertical: 'small', horizontal: 'large' }} justify='between'>
          {!withRpcProvider &&
            <StayVoucherQr
              provider={provider}
              from={owner}
              to={facilityOwner}
              tokenId={tokenId}
              onError={err => setError(err)}
              name={name}
              description={description}
              attributes={attributes}
              facility={facility}
              pricePerNightWei={'0'}
            />
          }

          {status === 'booked' &&
            <Box>
              {/* <CustomButton
                label={
                  <Box direction='row'>
                    <Box>
                      <Text>Cancel and get refund</Text>
                    </Box>
                    {cancelLoading &&
                      <Box pad={{ left: 'small' }}>
                        <Spinner />
                      </Box>
                    }
                  </Box>
                }
                disabled={cancelLoading}
                onClick={cancelTx}
              /> */}
              {!!cancellationTxHash
                ? <ExternalLink
                  href={cancellationTxHashLink}
                  label={centerEllipsis(cancellationTxHash)}
                />
                : null
              }
            </Box>
          }
          {withCloseButton &&
            <Button
              style={{
                position: 'absolute',
                top: 10,
                right: 10
              }}

              icon={<Icons.Close color="plain" />}
              hoverIndicator
              onClick={() => navigate('/tokens', { replace: true })}
            />
          }
        </Box>
      </Box>

      <MessageBox type='error' show={!!error}>
        <Box>
          {error}
        </Box>
      </MessageBox>

      <MessageBox type='error' show={!!contractError}>
        <Box>
          {contractError}
        </Box>
      </MessageBox>
    </Box >
  );
};
