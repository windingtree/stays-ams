import type { MessageBoxTypes } from '../components/MessageBox';
import type { MessageState } from '../hooks/useGoToMessage';
import { useEffect, useState } from 'react';
import { Box, Text } from 'grommet';
import { PageWrapper } from './PageWrapper';
import { useLocation } from 'react-router-dom';
import { MessageBox, allowedMessageBoxTypes } from '../components/MessageBox';

export const Message = () => {
  const { state } = useLocation();
  const [messageType, setMessageType] = useState<MessageBoxTypes>('warn');
  const [messageText, setMessageText] = useState<string | undefined>();

  useEffect(
    () => {
      const { type, text } = state as MessageState;
      setMessageType(allowedMessageBoxTypes.includes(type) ? type : 'warn');
      setMessageText(text || 'Hello, the message on this path is expired');
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
        <Box>
          <Text>{messageText}</Text>
        </Box>
      </MessageBox>

    </PageWrapper>
  );
};
