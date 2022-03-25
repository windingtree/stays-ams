import { Grid, Box, TextInput, Button, Text } from 'grommet';
import { DateRangePickup, Label } from './date-range-pickup';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react'
import { useAppState } from '../../store';
import { ThemeMode } from '../SwitchThemeMode';

export const parseDateToDays = (dayZero?: Date, firstDate?: Date, secondDate?: Date) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  const startDay = Math.round((new Date(firstDate ?? '').getTime() - new Date(dayZero ?? '').getTime()) / oneDay)
  const numberOfDays = Math.round((new Date(secondDate ?? '').getTime() - new Date(firstDate ?? '').getTime()) / oneDay)
  return {
    startDay,
    numberOfDays
  }
};

export const SearchForm: React.FC<{
  getDate: Function,
  startDay?: number | undefined,
  numberOfDays?: number | undefined,
  initGuestsAmount?: number | undefined,
}> = ({ getDate, startDay, numberOfDays, initGuestsAmount }) => {
  const { themeMode } = useAppState();

  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  useEffect(() => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const departureDay: Date = getDate(startDay ?? 1).toJSDate()
    const returnDay: Date = getDate((startDay ?? 1) + (numberOfDays ?? 7)).toJSDate()

    setReturnDate(returnDay.getTime() > now.getTime() ? returnDay : tomorrow)
    setDepartureDate(departureDay.getTime() > now.getTime() ? departureDay : now)
  }, [getDate, setDepartureDate, setReturnDate, startDay, numberOfDays])

  const [guestsAmount, setGuestsAmount] = useState(initGuestsAmount ?? 1);

  const query = useMemo(() => {
    const { startDay, numberOfDays } = parseDateToDays(getDate(0).toJSDate(), departureDate, returnDate)
    return new URLSearchParams([
      ['startDay', String(startDay)],
      ['numberOfDays', String(numberOfDays)],
      ['guestsAmount', String(guestsAmount)],
    ])
  }, [departureDate, returnDate, guestsAmount, getDate])

  const navigate = useNavigate()

  if (departureDate === undefined || returnDate === undefined) {
    return null
  }

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
        <Box pad='small'>
          <DateRangePickup
            onStartDateChanged={setDepartureDate}
            onEndDateChanged={setReturnDate}
            initialStart={departureDate}
            initialEnd={returnDate}
            label='When'
            displayVenueBadge={true}
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
