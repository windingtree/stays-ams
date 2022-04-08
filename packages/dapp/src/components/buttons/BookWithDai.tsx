import { Text, Spinner, Box } from 'grommet';
import styled from 'styled-components';
import { CustomButton } from '../SearchResultCard';

const InnerSpinner = styled(Spinner)`
  margin-left: 8px;
`;

export const BookWithDai: React.FC<{
  loading: boolean; disabled: boolean; onClick: () => void
}> = ({ loading, disabled, onClick }) => {

  return (
    <CustomButton
      onClick={() => onClick()}
      disabled={disabled}
    >
      {() => (
        <Box justify='center' direction='row' align='center' pad='small'>
          <Text>
            Book with DAI
          </Text>
          {loading && <InnerSpinner />}
        </Box>
      )}
    </CustomButton>
  )
};
