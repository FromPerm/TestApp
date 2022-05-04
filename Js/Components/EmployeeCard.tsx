import * as React from 'react';
import { SexType } from '../../Models/model';
import { CheckboxControl as CheckboxControl } from '../UI/CheckboxControl';
import { SelectControl } from '../UI/SelectControl';
import { TextInputControl } from '../UI/TextInputControl';
import { inject, observer } from "mobx-react";
import { StoreProps } from "../Stores/MainStore";
import { Box, Paper, Stack, Button } from '@mui/material';
import { DataStorage } from '../DataStorage';
import { DatePickerControl } from '../UI/DatePickerControl';
import { RadioControl, RadioControlValues } from '../UI/RadioControl';
import { MultiSelectControl } from '../UI/MultiSelectControl';
import { AttributeEditor } from './AttributeEditor';

interface EmployeeCardState {
	positions: string[];
	sexValues: RadioControlValues[];
}

@inject('mainStore')
@observer
export class EmployeeCard extends React.Component<StoreProps, EmployeeCardState> {
	private readonly fieldErrorText = 'Поле не может быть пустым';
	
	constructor(props: any) {
		super(props);
		this.onFullNameChanged = this.onFullNameChanged.bind(this);
		this.onIsFiredChanged = this.onIsFiredChanged.bind(this);
		this.onColleguesChanged = this.onColleguesChanged.bind(this);
		this.onPositionChanged = this.onPositionChanged.bind(this);
		this.onSexChanged = this.onSexChanged.bind(this);
		this.onBirthDateChanged = this.onBirthDateChanged.bind(this);
		this.onFullNameBlur = this.onFullNameBlur.bind(this);
		this.onPositionBlur = this.onPositionBlur.bind(this);
		this.state = {
			positions: [],
			sexValues: [
				{ value: 'male', name: 'Муж' },
				{ value: 'female', name: 'Жен' }
			]
		}
	}

	componentDidMount(): void {
		const positions = DataStorage.getPositions();
		this.setState({ positions });
	}

	private onFullNameChanged(value: string) {
		const store = this.props.mainStore; 
		store.setEditingEmployeeAttribute({...store.editingEmployee, fullName: value });

		if (!value) {
			store.enableShowFullNameError();
		}
	}

	private onFullNameBlur(): void {
		if (!this.validateFullName()) {
			this.props.mainStore.enableShowFullNameError();
		}
	}

	private onPositionBlur(): void {
		if (!this.validatePosition()) {
			this.props.mainStore.enableShowPositionError();
		}
	}

	private validateFullName(): boolean {
		const store = this.props.mainStore; 
		return Boolean(store.editingEmployee.fullName);
	}

	private validatePosition(): boolean {
		const store = this.props.mainStore; 
		return Boolean(store.editingEmployee.position);
	}

	private onPositionChanged(pos: string) {
		const store = this.props.mainStore; 
		store.setEditingEmployeeAttribute({...store.editingEmployee, position: pos });
	}

	private onIsFiredChanged(value: boolean) {
		const store = this.props.mainStore; 
		store.setEditingEmployeeAttribute({...store.editingEmployee, isFired: value });
	}

	private onBirthDateChanged(value: Date) {
		const store = this.props.mainStore; 
		store.setEditingEmployeeAttribute({...store.editingEmployee, birthDate: value });
	}

	private onSexChanged(value: string) {
		const store = this.props.mainStore; 
		store.setEditingEmployeeAttribute({...store.editingEmployee, sex: value as SexType });
	}

	private onColleguesChanged(values: string[]) {
		const store = this.props.mainStore; 
		store.setEditingEmployeeAttribute({...store.editingEmployee, collegues: values.map(v => Number(v)) });
	}

	render() {
		const store = this.props.mainStore;
		const editingEmployee = store.editingEmployee;
		
		if (!editingEmployee) {
			return null;
		}

		const collegues = this.props.mainStore.employeeList
			.filter(e => e.id !==  this.props.mainStore.editingEmployee?.id)
			.map((emp) => {
				return {
					value: String(emp.id),
					name: emp.fullName
				}
		});

		const fullNameError = store.showNameError && !editingEmployee.fullName ? this.fieldErrorText : '';
		const positionError = store.showPositionError && !editingEmployee.position ? this.fieldErrorText : ''; 

		return (
			<Box
				component="form"
				autoComplete="off"
				sx={{ width: 600 }}
				>
				<Paper elevation={3} className='emp-paper'>
					<Stack className='bold-font title'>
						Карточка сотрудника
					</Stack>
					<TextInputControl 
						title='ФИО*' 
						value={editingEmployee.fullName} 
						onChange={this.onFullNameChanged}
						onBlur={this.onFullNameBlur}
						errorText={fullNameError}
						isFocused={true}
						></TextInputControl>
					<SelectControl 
						title='Должность*' 
						selected={editingEmployee.position} 
						values={this.state.positions} 
						onChange={this.onPositionChanged}
						onBlur={this.onPositionBlur}
						errorText={positionError}
						></SelectControl>
					<DatePickerControl 
						title='Дата рождения'
						value={editingEmployee.birthDate}
						onChange={this.onBirthDateChanged}
						maxDate={new Date()}
						></DatePickerControl>
					<RadioControl
						title='Пол'
						value={editingEmployee.sex}
						values={this.state.sexValues}
						onChange={this.onSexChanged}
						></RadioControl>
					<CheckboxControl 
						title='Уволен' 
						checked={editingEmployee.isFired} 
						onChange={this.onIsFiredChanged}
						></CheckboxControl>
					{collegues.length ? 
					<MultiSelectControl
						title='Коллеги'
						value={store.editingEmployee.collegues?.map(c => String(c)) || []}
						values={collegues}
						onChange={this.onColleguesChanged}
						></MultiSelectControl>
					: null}
					<Stack sx={{ marginBottom: '15px' }}>
						<AttributeEditor></AttributeEditor>
					</Stack>
				</Paper>
			</Box>
		);
	}
}