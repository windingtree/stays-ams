import { useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Image, Header, Box } from 'grommet';
import { useAppState } from '../store';
// import { usePageTitle } from '../hooks/usePageTitle';
import { Account } from '../components/Account';
import { SignInButton, SignOutButton } from '../components/buttons/web3Modal';
import { GlobalMenu } from './Routes';

export const AppHeader = () => {
  const { state } = useLocation();

  const navigate = useNavigate();
  const { account } = useAppState();

  const returnLocation = useMemo(
    () => (state as any)?.location as Location,
    [state]
  );

  return (
    <Header
      pad='medium'
      responsive={true}
      direction='row'
    >
      {(returnLocation && account) &&
        <Navigate to={returnLocation} state={null} />
      }

      <Image
        src='/logo.svg'
        onClick={() => navigate('/')}
        style={{ height: '32px', cursor: 'pointer' }}
      />

      <Box direction='row' align='right' gap='small'>
        <Account account={account} />
        <Box>
          {account
            ? <SignOutButton />
            : <SignInButton />
          }
        </Box>
        <GlobalMenu />
      </Box>
    </Header>
  );
};
