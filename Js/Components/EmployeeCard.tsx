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
	fullNameError: string;
	positionError: string;
}

@inject('mainStore')
@observer
export class EmployeeCard extends React.Component<StoreProps, EmployeeCardState> {
	
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
		this.save = this.save.bind(this);
		this.state = {
			positions: [],
			sexValues: [
				{ value: 'male', name: 'Муж' },
				{ value: 'female', name: 'Жен' }
			],
			fullNameError: '',
			positionError: ''
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
			this.setState({ fullNameError: 'Поле не может быть пустым' });
		} else {
			if (this.state.fullNameError) {
				this.setState({ fullNameError: '' });
			}
		}
	}

	private onFullNameBlur(): void {
		if (!this.validateFullName()) {
			this.setState({ fullNameError: 'Поле не может быть пустым' });
		} else if (this.state.fullNameError) {
			this.setState({ fullNameError: '' });
		}
	}

	private onPositionBlur(): void {
		if (!this.validatePosition()) {
			this.setState({ positionError: 'Поле не может быть пустым' });
		} else if (this.state.positionError) {
			this.setState({ positionError: '' });
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
		this.setState({ positionError: '' });
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

	private save(): void {
		let hasErorrs = false;
		if (!this.validateFullName()) {
			this.onFullNameBlur();
			hasErorrs = true;
		}

		if (!this.validatePosition()) {
			this.onPositionBlur();
			hasErorrs = true;
		}

		if (hasErorrs) {
			return;
		}

		this.props.mainStore.saveEmployee();
	}

	render() {
		const store = this.props.mainStore;
		const editingEmployee = store.editingEmployee;
		
		if (!editingEmployee) {
			return (<Stack className='bold-font'>Выберите сотрудника</Stack>);
		}

		const collegues = this.props.mainStore.employeeList
			.filter(e => e.id !==  this.props.mainStore.editingEmployee?.id)
			.map((emp) => {
				return {
					value: String(emp.id),
					name: emp.fullName
				}
		});

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
						errorText={this.state.fullNameError}
						></TextInputControl>
					<SelectControl 
						title='Должность*' 
						selected={editingEmployee.position} 
						values={this.state.positions} 
						onChange={this.onPositionChanged}
						onBlur={this.onPositionBlur}
						errorText={this.state.positionError}
						></SelectControl>
					<DatePickerControl 
						title='Дата рождения'
						value={editingEmployee.birthDate}
						onChange={this.onBirthDateChanged}
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
					<Stack className='bold-font' sx={{m:1, marginBottom: '10px'}}>
						Дополнительные аттрибуты:
					</Stack>
					<Stack sx={{ marginBottom: '15px' }}>
						<AttributeEditor></AttributeEditor>
					</Stack>
					<Button onClick={this.save} disabled={!this.props.mainStore.hasChages}>Сохранить</Button>
					{!store.isNew ? <Button onClick={() => {this.props.mainStore.deleteEmployeeAction()}}>Удалить</Button> : null}
					<Button onClick={() => {this.props.mainStore.cancelEditingAction()}}>Отмена</Button>
				</Paper>
			</Box>
		);
	}
}