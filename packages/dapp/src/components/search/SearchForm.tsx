import { Grid, Box, TextInput, Button, Text, ResponsiveContext } from 'grommet';
import { DateRangePickup, Label } from './date-range-pickup';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useContext } from 'react'
import { useAppState } from '../../store';
import { ThemeMode } from '../SwitchThemeMode';

const defaultDepartureDate = new Date('03/11/2022').toISOString()
const defaultReturnDate = new Date('03/20/2022').toISOString()

export const SearchForm: React.FC<{
  initDepartureDate?: string | null,
  initReturnDate?: string | null,
  initGuestsAmount?: string | null,
}> = ({ initDepartureDate, initReturnDate, initGuestsAmount }) => {
  const { themeMode } = useAppState();
  const size = useContext(ResponsiveContext);

  const [departureDate, setDepartureDate] = useState(initDepartureDate ?? defaultDepartureDate);
  const [returnDate, setReturnDate] = useState(initReturnDate ?? defaultReturnDate);
  const [guestsAmount, setGuestsAmount] = useState(Number(initGuestsAmount ?? 1));

  const query = useMemo(() => new URLSearchParams([
    ['returnDate', String(returnDate)],
    ['departureDate', String(departureDate)],
    ['guestsAmount', String(guestsAmount)],
  ]), [returnDate, departureDate, guestsAmount])

  const navigate = useNavigate()

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
        <Button onClick={() => navigate(`/search?${query}`,{replace:true})}>
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
