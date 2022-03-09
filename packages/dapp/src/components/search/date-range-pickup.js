import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { useState } from 'react';
import { DateRangePicker } from 'react-dates';

import { ThemeMode } from '../SwitchThemeMode';
import { useAppState } from '../../store';
import { Box } from 'grommet';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';



export const Label = styled.div`
	@include g-font($g-fontsize-xs,$glider-color-text-labels,$g-fontweight-normal);
	margin-left: 4px;
`;

const StyledWrapper = styled(Box)`
	.DateRangePickerInput {
		text-align: center;
	}

	> div > div > div {
		height: 40px;
		overflow: hidden;
		display: flex !important;
		align-items: center;
		justify-content: center;
		border-radius: 7px !important;
		border-color: transparent !important;
		input {
			font-weight: 500 !important;
			font-size: 18px !important;
			padding: 6px 8px 3px 8px !important;
			text-align: center;
		}
	}
`;

export function DateRangePickup({
	initialStart,
	initialEnd,
	onStartDateChanged,
	onEndDateChanged,
	startPlaceholder = 'Departure',
	endPlaceholder = 'Return',
	label,
	displayVenueBadge = false,
	minimumNights = 1,
}) {
	const { themeMode } = useAppState();

	const [startDate, setStartDate] = useState(initialStart);
	const [endDate, setEndDate] = useState(initialEnd);
	const [focusedInput, setFocusedInput] = useState(null);

	const onChange = dates => {
		let start = dates.startDate ? moment(dates.startDate) : moment();
		let end = dates.endDate ? moment(dates.endDate) : moment();
		setStartDate(start.toDate());
		onStartDateChanged(start.toDate());

		if (start && end && end.isBefore(start)) {
			end = start;
		}

		if (minimumNights === 0 && (!end || start.isSame(end, 'day'))) {
			end = null;
			setEndDate(null);
		} else if (minimumNights > 0 && (!end || start.isSame(end, 'day'))) {
			end = end.add(1, 'day');
			setEndDate(end.toDate());
		} else {
			setEndDate(end.toDate());
		}

		onEndDateChanged(!end ? end : end.toDate());
	};

	return (
		<>
			{label && <Label>{label}</Label>}
			<StyledWrapper
				border={{ color: themeMode === ThemeMode.light ? 'brand' : 'accent-1', size: 'small' }}
				round='small'
				background={themeMode === ThemeMode.light ? 'brand' : 'accent-1'}
			>
				<DateRangePicker
					startDatePlaceholderText={startPlaceholder}
					endDatePlaceholderText={endPlaceholder}
					startDateTitleText="Start"
					endDateTitleText="End"
					startDate={(moment(startDate).isValid()) ? moment(startDate) : undefined}
					startDateId={uuid()}
					endDate={(moment(endDate).isValid()) ? moment(endDate) : undefined}
					endDateId={uuid()}
					onDatesChange={onChange}
					minimumNights={minimumNights}
					displayFormat='MMM DD, ddd'
					focusedInput={focusedInput}
					onFocusChange={focusedInput => setFocusedInput(focusedInput)}
					customArrowIcon={<span>&#65372;</span>}
					block
					orientation={window.matchMedia("(max-width: 700px)").matches ? 'vertical' : 'horizontal'}
				/>
			</StyledWrapper>
		</>
	);
};
