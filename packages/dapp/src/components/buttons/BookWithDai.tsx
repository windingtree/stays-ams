import {Button} from 'grommet';
import {useAppState} from '../../store';
import {useBookSpace} from '../../hooks/useBookSpace';

export const BookWithDai: React.FC<{ spaceId: string }> = ({spaceId}) => {
  const {searchParams} = useAppState();
  const [cb] = useBookSpace();

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
