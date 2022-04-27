import type { TokenData } from 'stays-core';
import { useCallback, useMemo } from 'react';
import { Spinner, Box, Text } from 'grommet';
import { PageWrapper } from './PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { useSearchParams } from 'react-router-dom';
import { useAppState } from '../store';
// import { useWindowsDimension } from "../hooks/useWindowsDimension";
import { useMyTokens, useGetToken } from '../hooks/useMyTokens';
// import { useGoToMessage } from '../hooks/useGoToMessage';
import styled from 'styled-components';
import { TokenCard } from '../components/tokens/TokenCard';
import { TokenView } from '../components/tokens/TokenView';
// import { CustomButton } from '../components/SearchResultCard';

export const Header = styled(Text)`
  font-weight: 900;
  font-size: 48px;
  line-height: 56px;
  text-align: center;
  color: #0D0E0F;
  margin-bottom: 2rem;
  margin-top: 2rem;
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

export const MyTokens = () => {
  const { provider, ipfsNode, account, lodgingFacilities } = useAppState();
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
    () => tokensLoading || tokenLoading,
    [tokensLoading, tokenLoading]
  );

  const findFacility = useCallback(
    (data: TokenData) => {
      const facilityId = data.attributes?.find((attr) => attr.trait_type === 'facilityId')?.value
      console.log('lodgingFacilities', lodgingFacilities, lodgingFacilities.find((facility) => facility.id === facilityId?.toLowerCase()), facilityId)
      return lodgingFacilities.find((facility) => facility.id === facilityId?.toLowerCase())
    },
    [lodgingFacilities]
  );

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
            <Box margin={{ right: 'small '}}>
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
            >
              {(token && token.tokenId === tokenId) ?
                <TokenView
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
