import { Anchor } from 'grommet';
import { Share } from 'grommet-icons';
import styled from 'styled-components';

export interface ExternalLinkProps {
  href: string;
  label: string;
}

export const ShareIcon = styled(Share)`
  cursor: pointer;
`;

export const ExternalLink = ({
  href,
  label
}: ExternalLinkProps) => {

  return (
    <Anchor
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      gap='xsmall'
      reverse
      label={label}
      icon={<ShareIcon size='small' />}
    />
  )
};
