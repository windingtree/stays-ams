import { Box, Spinner, Text } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { SearchForm } from '../components/search/SearchForm';
import { useDayZero } from '../hooks/useDayZero';
import styled from 'styled-components';

const WhiteText = styled(Text)`
  text-align: center;
  color: #fff;
  font-family: Inter;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
`;

const GradientText = styled(Text)`
  font-family: Inter;
  font-size: 136px;
  font-weight: 900;
  line-height: 144px;
  letter-spacing: 0px;
  text-align: center;

  background: linear-gradient(90.72deg, #E2C9C6 -3.09%, #81BDF0 23.35%, #E4F2FF 29.25%, #86C9F0 45.31%, #EDF5FF 81.44%, #A0AACF 101.22%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Home = () => {
  const {
    isIpfsNodeConnecting,
    isBootstrapLoading,
    bootstrapped,
    rpcProvider,
    ipfsNode
  } = useAppState();

  const [getDate, isGetDateReady] = useDayZero(rpcProvider, ipfsNode);

  return (
    <PageWrapper>
      <WhiteText>April 18-25 2022</WhiteText>
      <WhiteText>Devconnect APRIL 18-25, 2022 Amsterdam, The Netherlands</WhiteText>
      <GradientText>Amsterdam</GradientText>
      <WhiteText>A collaborative Ethereum week, built by and for everyone</WhiteText>

      <MessageBox type='info' show={isIpfsNodeConnecting || isBootstrapLoading || !isGetDateReady}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      {(!!bootstrapped && isGetDateReady) &&
        <SearchForm getDate={getDate} />
      }
    </PageWrapper>
  );
};
