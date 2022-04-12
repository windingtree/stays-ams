import { useMemo } from 'react';
import { Box, Spinner, Text } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { SearchForm } from '../components/search/SearchForm';
import styled from 'styled-components';

// export const WhiteText = styled(Text)`
//   text-align: center;
//   color: black;
//   font-family: Inter;
//   font-size: 18px;
//   font-weight: 400;
//   line-height: 24px;
//   letter-spacing: 0px;
//   text-align: center;
// `;

export const GradientText = styled(Text)`
  font-family: Inter;
  font-size: 90px;
  font-weight: 900;
  line-height: 144px;
  letter-spacing: 0px;
  text-align: center;
  background: linear-gradient(to right, orange , yellow, green, cyan, blue, violet);

  /* background: linear-gradient(90.72deg, #E2C9C6 -3.09%, #81BDF0 23.35%, #E4F2FF 29.25%, #86C9F0 45.31%, #EDF5FF 81.44%, #A0AACF 101.22%); */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Home = () => {
  const {
    isIpfsNodeConnecting,
    isBootstrapLoading,
    bootstrapped,
    getDate
  } = useAppState();

  const isReady = useMemo(
    () => !isIpfsNodeConnecting && !isBootstrapLoading && getDate !== undefined,
    [isIpfsNodeConnecting, isBootstrapLoading, getDate]
  );

  return (
    <PageWrapper>
      <Box align='center' margin={{ bottom: 'large' }}>
        <Text size='xxlarge'>
          April 18-25 2022
        </Text>
        <Text size='large'>
          Devconnect APRIL 18-25, 2022 Amsterdam, The Netherlands
        </Text>
        <GradientText>Amsterdam</GradientText>
        <Text size='large' margin={{ bottom: 'large' }}>
          A collaborative Ethereum week, built by and for everyone
        </Text>
        <Text size='xlarge' margin={{ bottom: 'large' }} textAlign='center'>
          Devconnect Amsterdam brings together hundreds of people from all over the world. Within one week there will be held various independent Ethereum events as well as in-person gatherings with the focus on communication, learning and making progress on specific subjects.
        </Text>
        <Text size='xlarge' textAlign='center'>
          With Win.so you can on-chain your stay in Amsterdam during Devconnect. Book with us. Pay in DAI. Check-in with NFT. Get Rewards for the next ETH event.
        </Text>
      </Box>

      <MessageBox type='info' show={isIpfsNodeConnecting || isBootstrapLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='error' show={isReady && !!!bootstrapped}>
        <Text>
          Something goes wrong. It was not possible to sync up the application with the smart contract. Try to reboot.
        </Text>
      </MessageBox>

      {isReady && !!bootstrapped &&
        <SearchForm />
      }
    </PageWrapper>
  );
};
