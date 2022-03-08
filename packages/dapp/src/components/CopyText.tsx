import type { TextProps } from 'grommet';
import { useState } from 'react';
import { Box, Text, Notification } from 'grommet';
import { Layer } from 'grommet-icons';
import styled from 'styled-components';
import { centerEllipsis, copyToClipboard } from '../utils/strings';
import Logger from '../utils/logger';

// Initialize logger
const logger = Logger('CopyText');

export interface CopyTextProps {
  text: string;
  size?: TextProps['size'];
  width?: number;
  prefixWidth?: number;
}

export const LayerIcon = styled(Layer)`
  cursor: pointer;
`;

export const CopyText = ({
  text,
  size,
  width,
  prefixWidth = 0
}: CopyTextProps) => {
  width = width || text.length;
  const [notification, setNotification] = useState<boolean>(false);

  return (
    <Box responsive direction='row' align='center' gap='xsmall'>
      <Text size={size}>{centerEllipsis(text, width, prefixWidth)}</Text>
      <LayerIcon
        size='small'
        onClick={() => {
          copyToClipboard(text);
          logger.debug('Copied to clipboard', text);
          setNotification(true);
          setTimeout(() => setNotification(false), 1000);
        }}
      />
      {notification &&
        <Notification
          toast
          title='Copied to clipboard'
          status='normal'
        />
      }
    </Box>
  )
};
