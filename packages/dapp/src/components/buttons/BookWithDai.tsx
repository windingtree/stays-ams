import { Button, Text, Spinner, Box } from 'grommet';
import styled from 'styled-components';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const BookWithDai: React.FC<{
  loading: boolean; disabled: boolean; onClick: () => void
}> = ({ loading, disabled, onClick }) => {

  return (
    <Button
      onClick={() => onClick()}
      disabled={disabled}
    >
      {() => (
        <Box direction='row' align='center' pad='small'>
          <Text>
            Book with DAI
          </Text>
          {loading && <InnerSpinner />}
        </Box>)}
    </Button>
  )
};
