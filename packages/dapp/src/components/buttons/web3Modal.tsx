import { useContext } from 'react';
import { Button, Box, Spinner, Text, ResponsiveContext } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import styled from 'styled-components';
import { useAppState } from '../../store';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

const WhiteButton = styled(Button)`
  height: 2.5rem;
  background: white;
  border:none;
  border-radius: 2rem;
`;

export const SignInButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signIn } = useAppState();

  return (
    <WhiteButton
      onClick={() => signIn()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center' pad='small'>
          {size !== 'small' &&
            <Text>
              {isConnecting ? 'Connecting' : 'Connect'}
            </Text>
          }
          {size === 'small' &&
            <Login />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </WhiteButton>
  )
};

export const SignOutButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signOut } = useAppState();

  return (
    <WhiteButton
      onClick={() => signOut()}
      disabled={isConnecting}
    >
      {() => (
        <Box direction='row' align='center' pad='small'>
          {size !== 'small' &&
            <Text>
              {isConnecting ? 'Connecting' : 'Disconnect'}
            </Text>
          }
          {size === 'small' &&
            <Logout />
          }
          {isConnecting && <InnerSpinner />}
        </Box>
      )}
    </WhiteButton>
  )
};
