import { Box, Spinner, Text } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { SearchForm } from '../components/search/SearchForm';
import { useDayZero } from '../hooks/useDayZero';
import styled from 'styled-components';

export const StyledText = styled(Text)`
  text-align: center;
  color: #000;
  font-family: Inter;
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
`;

export const Amsterdam = styled(Text)`
  font-family: Inter;
  font-size: 72px;
  font-weight: 900;
  line-height: 144px;
  letter-spacing: 0px;
  text-align: center;

  background: #000;
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
      <Box>
        <StyledText>April 18-25 2022</StyledText>
        <StyledText>Devconnect APRIL 18-25, 2022 Amsterdam, The Netherlands</StyledText>
        <Amsterdam>Amsterdam</Amsterdam>
        <StyledText>A collaborative Ethereum week, built by and for everyone</StyledText>

        {(!!bootstrapped && isGetDateReady) &&
          <SearchForm getDate={getDate} />
        }

        <MessageBox type='info' show={isIpfsNodeConnecting || isBootstrapLoading || !isGetDateReady}>
          <Box direction='row'>
            <Box>
              The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
            </Box>
            <Spinner />
          </Box>
        </MessageBox>

      </Box>
    </PageWrapper>
  );
};
