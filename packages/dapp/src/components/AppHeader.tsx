import { useContext, useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Image, Header, Box, ResponsiveContext } from 'grommet';
import { useAppState } from '../store';
// import { usePageTitle } from '../hooks/usePageTitle';
import { Account } from '../components/Account';
import { SignInButton, SignOutButton } from '../components/buttons/web3Modal';
import { GlobalMenu } from './Routes';
import { useWindowsDimension } from '../hooks/useWindowsDimension';

export const ResponsiveAlign = (winWidth: number) => {
  if (winWidth >= 1300) {
    return '48vw';
  } else if (winWidth >= 1000) {
    return '48vw';
  } else if (winWidth >= 768) {
    return '48vw';
  } else if (winWidth >= 600) {
    return '48vw';
  } else if (winWidth <= 500) {
    return '48vw';
  } else if (winWidth <= 400) {
    return '48vw';
  }
};

export const AppHeader = () => {
  const size = useContext(ResponsiveContext);
  const { winWidth } = useWindowsDimension();
  const { state, pathname } = useLocation();

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
    >
      {(returnLocation && account) &&
        <Navigate to={returnLocation} state={null} />
      }
      <Box direction='row' gap={size}>
        <GlobalMenu />
      </Box>

      <Image
        style={{
          position: 'absolute',
          left: ResponsiveAlign(winWidth),
        }}
        src='/logo-small.png'
        height='32px'
        onClick={() => navigate('/')}
      />

      {/* {pathname === '/' || pathname === '/search' || winWidth < 900 ?
        <Image
          style={{
            position: 'absolute',
            left: ResponsiveAlign(winWidth),
          }}
          src='logo-small.png'
          height='32px'
          onClick={() => navigate('/')}
        />
        : <Image
          style={{
            position: 'absolute',
            left: '35vw',
          }}
          src='/logo.png'
          height='32px'
          onClick={() => navigate('/')}
        />
      } */}
      {/* <Image
        fit="cover"
        src='/bg-img.svg'
        color='#611FF2'
        style={{
          width: '100vw',
          // height: '100vh',
          position: 'absolute',
          left: '0',
          bottom: '-1.5rem',
          zIndex: '-100'
        }}
      /> */}

      <Box direction='row' align='center' gap={size} margin={{ right: 'small' }}>
        <Account account={account} />
        <Box>
          {account
            ? <SignOutButton />
            : <SignInButton />
          }
        </Box>
        {/* <SwitchThemeMode /> */}
      </Box>
    </Header>
  );
};
