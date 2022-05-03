import { Stack, TextField } from '@mui/material';
import * as React from 'react';

interface TextInputProps {
	title: string;
	value: string;
	onChange: (value: string) => void;
	errorText?: string;
	onBlur?: () => void;
}

export class TextInputControl extends React.Component<TextInputProps> {
		
	render() {
		return (
			<Stack>
				<TextField
					error={Boolean(this.props.errorText)}
					label={this.props.title}
					value={this.props.value || ''}
					helperText={this.props.errorText}
					onChange={(e) => {this.props.onChange(e.target.value)}}
					onBlur={() => {this.props.onBlur ? this.props.onBlur() : null}}
					sx={{ m: 1, width: 400 }}
					/>
			</Stack>
		)
	}
}