import type { MessageBoxTypes } from '../components/MessageBox';
import type { MessageState } from '../hooks/useGoToMessage';
import { useEffect, useState } from 'react';
import { Box, Text } from 'grommet';
import { PageWrapper } from './PageWrapper';
import { useLocation, NavLink } from 'react-router-dom';
import { MessageBox, allowedMessageBoxTypes } from '../components/MessageBox';

export const Message = () => {
  const { state } = useLocation();
  const [messageType, setMessageType] = useState<MessageBoxTypes>('warn');
  const [messageText, setMessageText] = useState<string | undefined>();
  const [messagePath, setMessagePath] = useState<string | undefined>();
  const [messagePathLabel, setMessagePathLabel] = useState<string | undefined>();

  useEffect(
    () => {
      const { type, text, path, pathLabel } = state as MessageState;
      setMessageType(allowedMessageBoxTypes.includes(type) ? type : 'warn');
      setMessageText(text || 'Hello, the message on this path is expired');
      setMessagePath(path);
      setMessagePathLabel(pathLabel);
    },
    [state]
  );

  return (
    <PageWrapper
      breadcrumbs={[
        {
          path: '/',
          label: 'Home'
        }
      ]}
    >
      <MessageBox type={messageType} show={!!messageText}>
        <Box direction='column'>
          <Box margin={{ bottom: 'small' }}>
            <Text>{messageText}</Text>
          </Box>
          {messagePath &&
            <Box>
              <NavLink to={messagePath}>
                {messagePathLabel || 'Continue'}
              </NavLink>
            </Box>
          }
        </Box>
      </MessageBox>

    </PageWrapper>
  );
};
