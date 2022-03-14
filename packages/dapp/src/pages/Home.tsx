import { Box, Spinner } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { SearchForm } from '../components/search/SearchForm';

export const Home = () => {
  const {
    isIpfsNodeConnecting,
    isBootstrapLoading,
    bootstrapped
  } = useAppState();

  return (
    <PageWrapper>
      <MessageBox type='info' show={isIpfsNodeConnecting || isBootstrapLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      {!!bootstrapped &&
        <SearchForm />
      }
    </PageWrapper>
  );
};
