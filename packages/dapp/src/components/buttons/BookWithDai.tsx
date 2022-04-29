import { Text, Spinner, Box } from 'grommet';
import styled from 'styled-components';
import { CustomButton } from '../search/SearchResultCard';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const BookWithDai: React.FC<{
  loading: boolean; disabled: boolean; text: string; onClick: () => void
}> = ({ loading, disabled, onClick, text }) => {

  return (
    <CustomButton
      onClick={() => onClick()}
      disabled={disabled}
    >
      {() => (
        <Box justify='center' direction='row' align='center' pad='small'>
          <Text size='large'>
            {text}
          </Text>
          {loading && <InnerSpinner />}
        </Box>
      )}
    </CustomButton>
  )
};
