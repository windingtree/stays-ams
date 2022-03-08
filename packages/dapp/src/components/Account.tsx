import { useContext } from 'react';
import { useState, useMemo } from 'react';
import Blockies from 'react-blockies';
import styled from 'styled-components';
import { Box, Text, Notification, ResponsiveContext } from 'grommet';
import { centerEllipsis, copyToClipboard } from '../utils/strings';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('Account');

export interface AccountProps {
  account?: string;
}

const AccountIcon = styled(Blockies)`
  border-radius: 50%;
`;

const AccountHash = styled(Text)`
  margin-left: 8px;
  cursor: pointer;
`;

export const Account = ({ account }: AccountProps) => {
  const size = useContext(ResponsiveContext);
  const [notification, setNotification] = useState<boolean>(false);
  const shortAccount = useMemo(() => centerEllipsis(account || ''), [account]);

  if (!account) {
    return null;
  }

  return (
    <Box
      direction='row'
      align='center'
      pad='small'
      onClick={() => {
        copyToClipboard(account);
        logger.debug('Copied to clipboard', account);
        setNotification(true);
        setTimeout(() => setNotification(false), 1000);
      }}
    >
      <AccountIcon
        seed={account}
        size={7}
        scale={4}
      />
      {size !== 'small' &&
        <AccountHash>
          {shortAccount}
        </AccountHash>
      }
      {notification &&
        <Notification
          toast
          title='Copied to clipboard'
          status='normal'
        />
      }
    </Box>
  );
};
