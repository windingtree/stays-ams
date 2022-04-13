import type { StayToken, TokenData } from 'stays-core';
import { ReactChild, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import * as Icons from 'grommet-icons';
import { Grid, Spinner, Button, Box, Image, Text } from 'grommet';
import { PageWrapper } from './PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { CustomText, StayVoucherQr } from '../components/StayVoucherQr';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../store';
// import { useWindowsDimension } from "../hooks/useWindowsDimension";
import { useMyTokens, useGetToken } from '../hooks/useMyTokens';
import { useContract } from '../hooks/useContract';
import { centerEllipsis } from '../utils/strings';
import { getNetwork } from '../config';
import { ExternalLink } from '../components/ExternalLink';
// import { useGoToMessage } from '../hooks/useGoToMessage';
import { LodgingFacilityRecord } from '../store/actions';
import styled from 'styled-components';
import { utils, BigNumber as BN } from 'ethers';
// import { CustomButton } from '../components/SearchResultCard';

const HotelTitle = styled(Text)`
  color: #000;
  font-weight: 900;
  font-size: 22px;
  font-family: 'Inter';
  line-height: 28px;
  margin-bottom: .5rem;
`;


export const Header = styled(Text)`
  font-weight: 900;
  font-size: 48px;
  line-height: 56px;
  text-align: center;
  color: #0D0E0F;
  margin-bottom: 2rem;
  margin-top: 2rem;
`;

export const CustomBoldText = styled(Text)`
  color: #0D0E0F;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  // margin-bottom: 1.5rem;
`;

// const ResponsiveColumn = (winWidth: number): string[] => {
//   if (winWidth >= 1300) {
//     return ["21rem", "21rem", "21rem", "21rem"];
//   } else if (winWidth >= 1000) {
//     return ["21rem", "21rem", "21rem"];
//   } else if (winWidth >= 768) {
//     return ["23rem", "23rem"];
//   } else if (winWidth >= 600) {
//     return ["31rem"];
//   } else if (winWidth <= 500) {
//     return ["24rem"];
//   } else if (winWidth <= 400) {
//     return ["16rem"];
//   }
//   return [];
// };

export interface TokenCardProps extends TokenData {
  onClick?: () => void,
  children?: ReactChild | null,
  facility: LodgingFacilityRecord | undefined
  getDate?: (days: number) => DateTime;
}

export interface TokenViewProps extends StayToken {
  getDate?: (days: number) => DateTime;
  facilityOwner: string | undefined;
  facility: LodgingFacilityRecord | undefined;
}

export const TokenCard = ({
  image,
  name,
  description,
  attributes,
  onClick = () => { },
  facility,
  getDate,
  children
}: TokenCardProps) => {
  console.log('facility', facility)
  if (!facility || !getDate || !attributes) {
    return null
  }
  const parseTrait = (trait: string): any => {
    return (attributes || []).find(attr => attr.trait_type === trait)?.value ?? ''
  };
  const space = facility.spaces.find(space => space.contractData.spaceId === parseTrait('spaceId').toLowerCase())
  const quantity = Number(parseTrait('quantity'))
  const numberOfDays = Number(parseTrait('numberOfDays'))
  const total = BN.from(space?.contractData.pricePerNightWei || 0).mul(BN.from(numberOfDays)).mul(BN.from(quantity)).toString();
  const totalEther = utils.formatUnits(total, 'ether');

  return (
    <Box>
      <Box
        direction='row'
        justify='between'
        pad='small'
        style={{ borderBottom: '1px solid black' }}
        onClick={() => onClick()}
      >
        <Box margin={{ right: 'large' }}>
          <Image
            height='120'
            width='120'
            fit='cover'
            src={image}
          />
        </Box>
        <Box pad='small'>
          <HotelTitle>{facility.name}</HotelTitle>
          <CustomText>{facility.address.streetAddress}, {facility.address.postalCode} {facility.address.locality}, {facility.address.country}. </CustomText>
          <CustomText>{space?.name},{quantity} {quantity === 1 ? 'room' : 'rooms'} </CustomText>
        </Box>
        <Box align='center' justify='center' pad='small'>
          <CustomText>{getDate(parseTrait('startDay')).toFormat('MM.dd.yyyy')} - {getDate(Number(parseTrait('startDay')) + Number(parseTrait('numberOfDays'))).toFormat('MM.dd.yyyy')}</CustomText>
        </Box>
        <Box
          alignSelf='center'
          style={{ justifySelf: 'end' }}
          pad={{ horizontal: 'small' }}
        >
          <Box pad='small'>
            <Text size="xlarge" weight="bold">
              {totalEther}
            </Text>
          </Box>
        </Box>
      </Box>
      {children}
    </Box>
  );
};

export const TokenView = ({
  tokenId,
  owner,
  getDate,
  facilityOwner,
  facility,
  status,
  data: {
    name,
    description,
    image,
    attributes
  }
}: TokenViewProps) => {
  const { provider, ipfsNode } = useAppState();
  const [, , contractError] = useContract(provider, ipfsNode);
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

  if (!getDate || !attributes || !facility) {
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
        direction='row'
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
            getDate={getDate}
            pricePerNightWei={'0'}
          />

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

export const MyTokens = () => {
  const { provider, ipfsNode, account, lodgingFacilities, getDate } = useAppState();
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenId = useMemo(
    () => searchParams.get('tokenId') || undefined,
    [searchParams]
  );
  const [tokens, tokensLoading, tokensError] = useMyTokens(
    provider,
    ipfsNode,
    account
  );
  const [token, facilityOwner, tokenLoading, tokenError] = useGetToken(
    provider,
    ipfsNode,
    tokenId
  );
  // const { winWidth } = useWindowsDimension();
  const isLoading = useMemo(
    () => tokensLoading || tokenLoading || getDate === undefined,
    [tokensLoading, tokenLoading, getDate]
  );

  const findFacility = (data: TokenData) => {
    const facilityId = data.attributes?.find((attr) => attr.trait_type === 'facilityId')?.value
    console.log('lodgingFacilities', lodgingFacilities, lodgingFacilities.find((facility) => facility.id === facilityId?.toLowerCase()), facilityId)
    return lodgingFacilities.find((facility) => facility.id === facilityId?.toLowerCase())
  };

  // const tokensTest: StayToken[] = [
  //   {
  //     tokenId: '1',
  //     owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  //     tokenUri: '',
  //     data: {
  //       name: 'Stays #1',
  //       description: 'Stay at lodging facility',
  //       image: 'https://bafybeigg7mwwpnnm6mmk3twxc4arizoyc6ijnaye3pdciwcohheo7xi7hm.ipfs.dweb.link/token-image.png',
  //       external_url: 'https://localhost:3000/space/0xC742BE735817045D0344EFB3770EACD7FE22863EE6BF1B062351235ADEE2277F',
  //       attributes: [
  //         {
  //           trait_type: 'facilityId',
  //           value: '0x75663CE0EB08ACE9FD7FFB90BCC405E494180FA0E2734A50E78E81FA67CF316B'
  //         },
  //         {
  //           trait_type: 'spaceId',
  //           value: '0xC742BE735817045D0344EFB3770EACD7FE22863EE6BF1B062351235ADEE2277F'
  //         },
  //         {
  //           trait_type: 'startDay',
  //           value: '10000'
  //         },
  //         {
  //           trait_type: 'numberOfDays',
  //           value: '1'
  //         },
  //         {
  //           trait_type: 'quantity',
  //           value: '1'
  //         }
  //       ]
  //     }
  //   }
  // ];

  return (
    <PageWrapper>
      <Box>
        <Header>Stay tokens</Header>

        <MessageBox type='info' show={isLoading}>
          <Box direction='row'>
            <Box>
              Tokens data is loading. Please wait..&nbsp;
            </Box>
            <Spinner />
          </Box>
        </MessageBox>

        <MessageBox type='info' show={!isLoading && (!tokens || tokens.length === 0)}>
          <Box>
            Tokens list is empty. It is a time to book a stay!
          </Box>
        </MessageBox>

        <MessageBox type='error' show={!!tokensError}>
          <Box>
            {tokensError}
          </Box>
        </MessageBox>

        <MessageBox type='error' show={!!tokenError}>
          <Box>
            {tokenError}
          </Box>
        </MessageBox>

        <Box
          direction='column'
          alignSelf="center"
        >
          {tokens?.map(({ tokenId, data }, index) => (
            <TokenCard
              facility={findFacility(data)}
              key={index}
              onClick={() => setSearchParams({ tokenId })}
              {...data}
              getDate={getDate}
            >
              {(token && token.tokenId === tokenId) ?
                <TokenView
                  getDate={getDate}
                  facilityOwner={facilityOwner}
                  facility={findFacility(data)}
                  {...token}
                />
                : null}
            </TokenCard>
          ))}
        </Box>
      </Box>
    </PageWrapper>
  );
};
