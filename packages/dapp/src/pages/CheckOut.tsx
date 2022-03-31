import { Box, Spinner } from 'grommet';
import { useAppState } from '../store';
import { PageWrapper } from '../pages/PageWrapper';
import { MessageBox } from '../components/MessageBox';
import { useCheckOut } from '../hooks/useCheckOut';
import { useAppReducer } from '../store/reducer';

export const CheckOut = () => {
  const [, dispatch] = useAppReducer();
  const {
    account,
    isIpfsNodeConnecting,
    isOwnerBootstrapLoading,
    ownerBootstrapped,
    provider,
    ipfsNode,
  } = useAppState();

  const [error] = useCheckOut(account, dispatch, provider, ipfsNode, ownerBootstrapped)

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >
      <MessageBox type='info' show={isIpfsNodeConnecting || isOwnerBootstrapLoading}>
        <Box direction='row'>
          <Box>
            The Dapp is synchronizing with the smart contract. Please wait..&nbsp;
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      <MessageBox type='info' show={!!error}>
        <Box direction='row'>
          <Box>
            {error}
          </Box>
          <Spinner />
        </Box>
      </MessageBox>

      {!!ownerBootstrapped &&
        <>{ }</>
      }
    </PageWrapper>
  );
};
