import { Checkbox, FormControl, FormControlLabel, Stack } from '@mui/material';
import * as React from 'react';

interface CheckboxControlProps {
	title: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

export class CheckboxControl extends React.Component<CheckboxControlProps> {	
	render() {
		return (
			<Stack>
				<FormControl>
					<FormControlLabel 
						control={<Checkbox checked={this.props.checked || false} onChange={(e) => {this.props.onChange(e.target.checked)}} />} 
						label={this.props.title} 
						sx={{  m: 1, marginLeft: 0 }}
						/>
				</FormControl>
			</Stack>
		)
	}
}