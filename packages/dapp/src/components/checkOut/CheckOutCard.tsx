import type { TokenData } from 'stays-core';
import { Box, Card, CardBody, CardFooter, Image, Text } from 'grommet';

export interface CheckOutCardProps extends TokenData {
  onClick?: () => void
}

export const CheckOutCard = ({
  image,
  name,
  onClick = () => { }
}: CheckOutCardProps) => {
  return (
    <Box margin='medium'>
      <Card
        background='light-1'
        elevation='small'
        onClick={() => onClick()}
      >
        <CardBody pad='small'>
          <Image
            fit='cover'
            src={image}
          />
        </CardBody>
        <CardFooter
          pad={{ horizontal: 'small' }}
          background='light-2'
        >
          <Box pad='small'>
            <Text size="xlarge" weight="bold">
              {name}
            </Text>
          </Box>
        </CardFooter>
      </Card>
    </Box>
  );
};
