import { inject, observer } from 'mobx-react';
import * as React from 'react';
import {  StoreProps } from '../Stores/MainStore';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { EmployeeInfo } from '../../Models/model';
import { Paper } from '@mui/material';

@inject('mainStore')
@observer
export class EmployeeList extends React.Component<StoreProps> {
	componentDidMount(): void {
		if (!this.props.mainStore.employeeList) {
			this.props.mainStore.loadEmployeeListAction();
		}
	}

	private onEmployeeClick(emp: EmployeeInfo) {
		const store = this.props.mainStore;
		if (store.editingEmployee?.id === emp.id) {
			return;
		}

		const callback = (): void => {
			store.setEditingEmployee(emp);
		}

		store.showModalIfNeeded(callback);
	}

	render() {
		const store = this.props.mainStore;
		if (!store.employeeList) {
			return null;
		}

		return (
			<Paper className='emp-paper'>
				<Stack sx={{ fontWeight: 'bold', fontSize: '18px' }}>
					Список сотрудников:
				</Stack>
				{ store.employeeList?.length || store.isNew ?
				<List component="nav">
					{store.employeeList.map((emp) => {
						return <ListItemButton
								key={emp.id}
							    selected={emp.id === store.editingEmployee?.id}
								onClick={() => this.onEmployeeClick(emp)}
							>
								<ListItemText primary={emp.fullName} />
							</ListItemButton>
					})}
					{
						store.isNew ? <ListItemButton
							key={store.editingEmployee.id}
							selected={true}
						>
							<ListItemText primary={'Новый сотрудник'} />
						</ListItemButton> : null
					}
				</List>
				:
				<Stack className='bold-font' mt={'15px'}>
					<Button onClick={() => {store.addNewEmployeeAction()}}>Добавить нового сотрудника</Button>
				</Stack>
				}
			</Paper>
		);
	}
}