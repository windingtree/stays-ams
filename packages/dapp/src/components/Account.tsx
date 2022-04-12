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
  margin: 0 8px;
  cursor: pointer;
`;

const AccountWrap = styled(Box)`
  /* background: rgba(13, 14, 15, 0.2); */
  backdrop-filter: blur(36px);
  height: 2.5rem;
  min-width:2.5rem;
  color: black;
  /* border: 1px solid rgba(255, 255, 255, 0.3); */
  border-radius: 2rem;

  border: 1px solid black;
`;


export const Account = ({ account }: AccountProps) => {
  const size = useContext(ResponsiveContext);
  const [notification, setNotification] = useState<boolean>(false);
  const shortAccount = useMemo(() => centerEllipsis(account || ''), [account]);

  if (!account) {
    return null;
  }

  return (
    <AccountWrap
      direction='row'
      align='center'
      justify='center'
      pad='xsmall'
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
    </AccountWrap>
  );
};
