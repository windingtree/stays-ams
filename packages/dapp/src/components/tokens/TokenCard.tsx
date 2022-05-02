import type { TokenData } from 'stays-core';
import { ReactChild } from 'react';
import { Box, Image, Text } from 'grommet';
import { CustomText } from '../StayVoucherQr';
// import { useGoToMessage } from '../hooks/useGoToMessage';
import { LodgingFacilityRecord } from '../../store/actions';
import { utils, BigNumber as BN } from 'ethers';
// import { CustomButton } from '../components/SearchResultCard';
import { getDate } from '../../utils/dates';
import styled from 'styled-components';
import { useWindowsDimension } from '../../hooks/useWindowsDimension';

const HotelTitle = styled(Text)`
  color: #000;
  font-weight: 900;
  font-size: 22px;
  font-family: 'Inter';
  line-height: 28px;
  margin-bottom: .5rem;
`;

export interface TokenCardProps extends TokenData {
  onClick?: () => void,
  children?: ReactChild | null,
  facility?: LodgingFacilityRecord;
}

export const TokenCard = ({
  image,
  name,
  description,
  attributes,
  onClick = () => { },
  facility,
  children
}: TokenCardProps) => {
  const { winWidth } = useWindowsDimension();
  if (!facility || !attributes) {
    return null
  }
  const parseTrait = (trait: string): any => {
    return (attributes || []).find(attr => attr.trait_type === trait)?.value ?? ''
  };
  const space = facility.spaces.find(space => space.contractData.spaceId === parseTrait('spaceId').toLowerCase())
  const quantity = Number(parseTrait('quantity'))
  const numberOfDays = Number(parseTrait('numberOfDays'))
  const total = BN.from(space?.contractData.pricePerNightWei || 0).mul(BN.from(numberOfDays)).mul(BN.from(quantity)).toString();
  const totalEther = utils.formatUnits(total, 'ether');

  return (
    <Box>
      <Box
        direction={winWidth > 768 ? 'row' : 'column'}
        justify='between'
        pad='small'
        style={{
          borderBottom: '1px solid black',
          textAlign: winWidth > 768 ? 'start' : 'center',
        }}
        onClick={() => onClick()}
      >
        <Box align='center'>
          <Image
            height='120'
            width='120'
            fit='cover'
            src={image}
          />
        </Box>
        <Box pad='small'>
          <HotelTitle>{facility.name}</HotelTitle>
          <CustomText>{facility.address.streetAddress}, {facility.address.postalCode} {facility.address.locality}, {facility.address.country}. </CustomText>
          <CustomText>{space?.name},{quantity} {quantity === 1 ? 'room' : 'rooms'} </CustomText>
        </Box>
        <Box align='center' justify='center' pad='small'>
          <CustomText>{getDate(parseTrait('startDay')).toFormat('dd.MM.yyyy')}-{getDate(Number(parseTrait('startDay')) + Number(parseTrait('numberOfDays'))).toFormat('dd.MM.yyyy')}</CustomText>
        </Box>
        <Box
          alignSelf='center'
          style={{ justifySelf: 'end' }}
          pad={{ horizontal: 'small' }}
        >
          <Box pad='small'>
            <Text size="xlarge" weight="bold">
              {totalEther}
            </Text>
          </Box>
        </Box>
      </Box>
      {children}
    </Box>
  );
};
