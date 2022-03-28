import { Box, Spinner } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { SearchForm } from '../components/search/SearchForm';
import { useDayZero } from '../hooks/useDayZero';

export const Home = () => {
  const {
    isIpfsNodeConnecting,
    isBootstrapLoading,
    bootstrapped,
    provider,
    ipfsNode
  } = useAppState();

  const [getDate, isGetDateReady] = useDayZero(provider, ipfsNode);

  return (
    <PageWrapper>
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
