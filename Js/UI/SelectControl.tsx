import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import * as React from 'react';

interface SelectProps {
	title: string;
	selected?: string;
	values: string[];
	onChange: (value: string) => void;
	onBlur?: () => void;
	errorText?: string;
}

export class SelectControl extends React.Component<SelectProps> {	
	render() {
		const hasError = Boolean(this.props.errorText);
		return (
			<Stack>
				<FormControl sx={{ m: 1, width: 300}} error={hasError}>
					<InputLabel id="simple-select-label">{this.props.title}</InputLabel>
					<Select
						error={hasError}
						// helperText={this.props.errorText}
						labelId="simple-select-label"
						id="simple-select"
						value={this.props.selected || ''}
						label={this.props.title}
						onChange={(e) => {this.props.onChange(e.target.value)}}
						onBlur={() => {this.props.onBlur ? this.props.onBlur() : null}}
					>
						{
							this.props.values.map((v) => {
								return <MenuItem key={v} value={v}>{v}</MenuItem>
							})
						}
					</Select>
					{hasError ? <FormHelperText>{this.props.errorText}</FormHelperText> : null}
				</FormControl>
			</Stack>
		)
	}
}