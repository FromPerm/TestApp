import { Stack, TextField } from '@mui/material';
import * as React from 'react';
import ruLocale from 'date-fns/locale/ru';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from "date-fns";

interface DatePickerControlProps {
	title: string;
	value: Date;
	onChange: (value: Date) => void;
	maxDate?: Date;
}

interface DatePickerControlState {
	errorText: string;
}

export class DatePickerControl extends React.Component<DatePickerControlProps, DatePickerControlState> {	
	constructor(props: DatePickerControlProps) {
		super(props);
		this.state = {
			errorText: ''
		}
	}

	render() {
		return (
			<Stack sx={{ m: 1, width: 300 }}>
				<LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
					<DatePicker
						mask='__.__.____'
						label={this.props.title}
						value={this.props.value || null}
						onChange={(date) => { this.props.onChange(date)}}
						renderInput={(params) => <TextField {...params} helperText={this.state.errorText} error={Boolean(this.state.errorText)} />}
						maxDate={this.props.maxDate}
						onError={(reason, value) => {
							switch (reason) {
								case "maxDate":
									this.setState({ errorText: `Дата не может быть больше ${format(this.props.maxDate, "dd.MM.yyyy")}` });
									break;	
								case "invalidDate":		
									this.setState({ errorText: `Неверный фотрмат даты` });
									break;		
								default:
									this.setState({ errorText: '' });
							}
						}}
					/>
				</LocalizationProvider>
			</Stack>
		)
	}
}