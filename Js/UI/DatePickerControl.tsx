import { Stack, TextField } from '@mui/material';
import * as React from 'react';
import ruLocale from 'date-fns/locale/ru';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DatePickerControlProps {
	title: string;
	value: Date;
	onChange: (value: Date) => void;
}

export class DatePickerControl extends React.Component<DatePickerControlProps> {	
	render() {
		return (
			<Stack sx={{ m: 1, width: 200 }}>
				<LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
					<DatePicker
						mask='__.__.____'
						label={this.props.title}
						value={this.props.value || null}
						onChange={(date) => { this.props.onChange(date)}}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
			</Stack>
		)
	}
}