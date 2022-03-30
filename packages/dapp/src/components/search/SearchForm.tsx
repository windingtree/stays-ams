import { DateTime } from 'luxon';
import { Grid, Box, TextInput, Button, Text, DateInput } from 'grommet';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react'
import { useAppState } from '../../store';
import { ThemeMode } from '../SwitchThemeMode';
import styled from 'styled-components';

export const Label = styled.div`
	@include g-font($g-fontsize-xs,$glider-color-text-labels,$g-fontweight-normal);
	margin-left: 4px;
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

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
});

const today = DateTime.now().set({ hour: 12 });
const tomorrow = today.plus({ days: 1 });


export const SearchForm: React.FC<{
  getDate: (days: number) => DateTime,
  startDay?: number | undefined,
  numberOfDays?: number | undefined,
  initGuestsAmount?: number | undefined,
}> = ({ getDate, startDay, numberOfDays, initGuestsAmount }) => {
  const { themeMode } = useAppState();

  const [departureDate, setDepartureDate] = useState<string>(today.toISO());
  const [returnDate, setReturnDate] = useState<string>(tomorrow.toISO());

  useEffect(() => {
    if (!!startDay && !!numberOfDays) {
      const departureDay = getDate(startDay)
      const returnDay = getDate(startDay + numberOfDays)

      setDepartureDate(departureDay.toISO())
      setReturnDate(returnDay.toISO())
    }

  }, [getDate, startDay, numberOfDays])

  const [guestsAmount, setGuestsAmount] = useState(initGuestsAmount ?? 1);

  const query = useMemo(() => {
    const { startDay, numberOfDays } = parseDateToDays(getDate(0), DateTime.fromISO(departureDate), DateTime.fromISO(returnDate))
    return new URLSearchParams([
      ['startDay', String(startDay)],
      ['numberOfDays', String(numberOfDays)],
      ['guestsAmount', String(guestsAmount)],
    ])
  }, [departureDate, returnDate, guestsAmount, getDate])

  const navigate = useNavigate()


  const handleDateChange = ({ value }: { value: string[] }) => {
    const now = DateTime.now().set({ hour: 12 })
    const tomorrow = now.plus({ days: 1 })

    if (now.toMillis() > DateTime.fromISO(value[0]).toMillis()) {
      setDepartureDate(now.toISO())
    } else {
      setDepartureDate(value[0])
    }

    if (tomorrow.toMillis() > DateTime.fromISO(value[1]).toMillis()) {
      setReturnDate(tomorrow.toISO())
    } else {
      setReturnDate(value[1])
    }
  }

  useEffect(() => {

    console.log('kkk', departureDate, returnDate)
  }, [departureDate, returnDate])

  return (
    <Box pad={{ bottom: 'medium' }}>
      <Grid
        fill='horizontal'
        responsive
        columns={['flex', '1/2', 'flex']}
        align='center'
      >
        <Box
          pad='small'
          height='100%'
          direction='column'
        >
          <Label>Destination</Label>
          <Box
            border={{ color: themeMode === ThemeMode.light ? 'brand' : 'accent-1', size: 'small' }}
            round='small'
            pad='small'
            justify='center'
            height='100%'
          >
            <Text size='xlarge'>
              Rio de Janeiro
            </Text>
          </Box>
        </Box>
        <Box pad='small'
          height='100%'
          direction='column'
        >
          <Label>When</Label>
          <DateInput
            buttonProps={{
              label: `${dateFormat.format(new Date(departureDate))} - ${dateFormat.format(new Date(returnDate))}`,
              size: 'large',
            }}
            calendarProps={{
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
          pad='small'
          height='100%'
          direction='column'
        >
          <Label>Guests</Label>
          <Box
            border={{ color: themeMode === ThemeMode.light ? 'brand' : 'accent-1', size: 'small' }}
            round='small'
            justify='center'
            height='100%'
          >
            <TextInput
              size='xlarge'
              focusIndicator={false}
              plain
              placeholder='Guests'
              value={guestsAmount}
              type='number'
              onChange={(event) => {
                const value = Number(event.target.value)
                setGuestsAmount(value !== 0 ? value : 1)
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Box pad='small'>
        <Button onClick={() => navigate(`/search?${query}`, { replace: true })}>
          {() => (
            <Box direction='row' justify='center' align='center' pad='small'>
              <Text>
                Search
              </Text>
            </Box>
          )}
        </Button>
      </Box>
    </Box>
  );
};
