import { useContext } from 'react';
import { Box, Spinner, Text, ResponsiveContext } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import styled from 'styled-components';
import { useAppState } from '../../store';
import { StyledButton } from './index';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const SignInButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signIn } = useAppState();

  return (
    <StyledButton
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
    </StyledButton>
  )
};

export const SignOutButton = () => {
  const size = useContext(ResponsiveContext);
  const { isConnecting, signOut } = useAppState();

  return (
    <StyledButton
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
    </StyledButton>
  )
};
