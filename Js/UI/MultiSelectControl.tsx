import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack } from '@mui/material';
import * as React from 'react';

export interface SelectedValue {
	value: string;
	name?: string;
}

interface MultiSelectProps {
	values: SelectedValue[];
	value: string[];
	title: string;
	onChange: (selectedValues: string[]) => void;
}

export class MultiSelectControl extends React.Component<MultiSelectProps> {
	private onChanged(event: SelectChangeEvent<any[] | string[]>): void {
		const value = event.target.value;
		const values = typeof (value) === 'string' ? [value] : value;
		this.props.onChange(values);
	}

	render() {
		return (
			<Stack>
				<FormControl sx={{ m: 1, width: 400 }}>
					<InputLabel id="multiple-name-label">{this.props.title}</InputLabel>
					<Select
						labelId="multiple-name-label"
						id="multiple-name"
						multiple
						value={this.props.value || []}
						onChange={(e) => {this.onChanged(e)}}
						input={<OutlinedInput label="Коллеги" />}
					>
					{this.props.values.map((val) => (
						<MenuItem
						key={val.value}
						value={val.value}
						>
						{val.name}
						</MenuItem>
					))}
					</Select>
				</FormControl>
			</Stack>
		)
	}
}