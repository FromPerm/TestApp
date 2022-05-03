import { Stack, TextField } from '@mui/material';
import * as React from 'react';

interface NumberInputControlProps {
	title: string;
	value: number;
	onChange: (value: number) => void;
}

export class NumberInputControl extends React.Component<NumberInputControlProps> {
		
	render() {
		return (
			<Stack>
				<TextField
					type="number"
					label={this.props.title}
					value={this.props.value || ''}
					onChange={(e) => {this.props.onChange(Number(e.target.value))}}
					sx={{ m: 1, width: 100 }}
					/>
			</Stack>
		)
	}
}