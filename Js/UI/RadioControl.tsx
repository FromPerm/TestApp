import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material';
import * as React from 'react';

export interface RadioControlValues {
	name?: string;
	value: string;
}

interface RadioControlProps {
	title: string;
	value: string;
	values: RadioControlValues[];
	onChange: (value: string) => void;
}

export class RadioControl extends React.Component<RadioControlProps> {	
	render() {
		return (
			<Stack>
				<FormControl sx={{ flexDirection: 'row' }}>
						<FormLabel 
							id="radio-buttons-group-label"
							sx={{ m: 1, marginLeft: '8px' }}
						>
							{this.props.title}
						</FormLabel>
						<RadioGroup
							row
							aria-labelledby="radio-buttons-group-label"
							name="radio-buttons-group"
						>
							{
								this.props.values.map(val => {
									return <FormControlLabel 
										key={val.value} 
										value={val.value} 
										control={<Radio checked={val.value === this.props.value} onChange={(e) => {this.props.onChange(val.value)}} />} 
										label={val.name || val.value}
										sx={{ marginLeft: 0,  marginTop: 0  }}
									/>
								})
							}
						</RadioGroup>
					</FormControl>
			</Stack>
		)
	}
}