import { DateTime } from 'luxon';
import { Box, TextInput, DateInput } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components';
import { WhiteButton } from '../buttons';
import { getDate } from '../../utils/dates';

export const Label = styled.div`
  @include g-font($g-fontsize-xs,$glider-color-text-labels,$g-fontweight-normal);
  margin-left: 4px;
`;

export const RoomsNumber = styled(TextInput)`
  height: 2.5rem;
  background: white;
  color: black;
  border: 1px solid black;
  border-radius: 2.5rem;
  &:hover,&:active {
    box-shadow: 0px 0px 0px 2px black;
  }
  -moz-appearance: textfield;
  -webkit-appearance: none;
`;

export const parseDateToDays = (dayZero: DateTime, firstDate: DateTime, secondDate: DateTime) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const startDay = Math.round(firstDate.diff(dayZero).toMillis() / oneDay)
  const numberOfDays = Math.round(secondDate.diff(firstDate).toMillis() / oneDay)
  return {
    startDay,
    numberOfDays
  }
};

const today = DateTime.now().set({ hour: 1 });
const tomorrow = today.plus({ days: 1 });

const defaultStartDay = DateTime.fromISO('2022-04-22');
const defaultEndDay = DateTime.fromISO('2022-04-28');

const defaultStartDate = today.toMillis() > defaultStartDay.toMillis() ? today.toISO() : defaultStartDay.toISO()
const defaultEndDate = tomorrow.toMillis() > defaultEndDay.toMillis() ? tomorrow.toISO() : defaultEndDay.toISO()

export const SearchForm: React.FC<{
  startDay?: number | undefined,
  numberOfDays?: number | undefined,
  initRoomsNumber?: number | undefined,
}> = ({ startDay, numberOfDays, initRoomsNumber }) => {
  const navigate = useNavigate();
  const [departureDate, setDepartureDate] = useState<string>(defaultStartDate);
  const [returnDate, setReturnDate] = useState<string>(defaultEndDate);
  const [roomsNumber, setRoomsNumber] = useState<number>(initRoomsNumber ?? 1);

  useEffect(() => {
    if (!!startDay && !!numberOfDays) {
      const departureDay = getDate(startDay);
      const returnDay = getDate(startDay + numberOfDays);

      setDepartureDate(departureDay.toISO());
      setReturnDate(returnDay.toISO());
    }
  }, [startDay, numberOfDays]);

  const handleDateChange = ({ value }: { value: string[] }) => {
    if (today.toMillis() > DateTime.fromISO(value[0]).toMillis()) {
      setDepartureDate(today.toISO())
    } else {
      setDepartureDate(value[0])
    }

    if (tomorrow.toMillis() > DateTime.fromISO(value[1]).toMillis()) {
      setReturnDate(tomorrow.toISO())
    } else {
      setReturnDate(value[1])
    }
  }

  const handleSearch = useCallback(
    () => {
      const { startDay, numberOfDays } = parseDateToDays(
        getDate(0),
        DateTime.fromISO(departureDate),
        DateTime.fromISO(returnDate)
      );
      const query = new URLSearchParams([
        ['startDay', String(startDay)],
        ['numberOfDays', String(numberOfDays)],
        ['roomsNumber', String(roomsNumber)],
      ]);
      navigate(`/search?${query}`, { replace: true });
    },
    [navigate, departureDate, returnDate, roomsNumber]
  );

  return (
    <Box
      direction='row'
      align='end'
      justify='center'
      margin={{ top: 'large', bottom: 'small' }}
    >
      <Box
        direction='column'
        margin={{ right: 'small' }}
      >
        <Label>When</Label>
        <DateInput
          buttonProps={{
            label: `${DateTime.fromISO(departureDate).toFormat('dd.MM.yy')}-${DateTime.fromISO(returnDate).toFormat('dd.MM.yy')}`,
            size: 'large',
            icon: undefined,
            style: {
              height: '2.5rem',
              background: 'white',
              color: 'black',
              border: '1px solid black',
              borderRadius: '2.5rem',
            }
          }}
          calendarProps={{
            // bounds: [defaultStartDay.toISO(), defaultEndDay.toISO()],
            fill: false,
            alignSelf: 'center',
            margin: 'small',
            size: 'medium'
          }}
          value={[departureDate, returnDate]}
          onChange={({ value }) => handleDateChange({ value } as { value: string[] })}
        />
      </Box>
      <Box
        width='80px'
        direction='column'
        margin={{ right: 'small' }}
      >
        <Label>Rooms</Label>
        <Box>
          <RoomsNumber
            size='medium'
            focusIndicator={false}
            suggestions={['1', '2', '3', '4', '5', '6', '7']}
            placeholder='Rooms number'
            value={roomsNumber}
            type='number'
            min={1}
            onSelect={({ suggestion }) => setRoomsNumber(Number(suggestion))}
            onChange={(event) => {
              const value = Number(event.target.value);
              setRoomsNumber(value !== 0 ? value : 1);
            }}
          />
        </Box>
      </Box>
      <WhiteButton
        size='large'
        label='Search'
        onClick={() => handleSearch()}
      />
    </Box>
  );
};
