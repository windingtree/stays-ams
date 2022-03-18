import { useContext } from 'react';
import { Button, Box, Spinner, Text, ResponsiveContext } from 'grommet';
import { Login, Logout } from 'grommet-icons';
import styled from 'styled-components';
import { useAppState } from '../../store';
import { useBookSpace } from '../../hooks/useBookSpace';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const BookWithDai: React.FC<{ spaceId: string }> = ({ spaceId }) => {
  const size = useContext(ResponsiveContext);
  const { searchParams, signIn } = useAppState();
  const [cb] = useBookSpace()

  return (
    searchParams !== undefined ?
      <Button
        onClick={() => cb(
          spaceId,
          searchParams.startDay,
          searchParams.numberOfDays,
          searchParams.guestsAmount
        )}
        label='Book with DAI'
      /> :
      <Button
        disabled={true}
        label='Book with DAI'
      />
  )
};
