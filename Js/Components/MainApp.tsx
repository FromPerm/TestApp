import * as React from 'react';
import '../../Css/main.scss';
import { EmployeeList } from './EmployeeList';
import { EmployeeCard } from './EmployeeCard';
import {  StoreProps } from "../Stores/MainStore";
import { inject, observer } from "mobx-react";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Button, Modal, Paper, Stack, Typography } from '@mui/material';

@inject('mainStore')
@observer
export class MainApp extends React.Component<StoreProps> {
	constructor(props: StoreProps) {
		super(props);
		this.save = this.save.bind(this);
	}

	private save(): void {
		const store = this.props.mainStore;
		const emp = store.editingEmployee;
		if (!emp.fullName || !emp.position) {
			store.enableShowErrors();
			return;
		}

		store.saveEmployee();
	}

	render() {
		const store = this.props.mainStore;
		const modalState = store.modalState;

		return (
			<Container fixed>
				<Grid item xs={12}>
					<h1 className='center'>Управление персоналом</h1>
				</Grid>
				<Grid item xs={12}>
					<Stack direction="row" spacing={2} sx={{ marginBottom: '30px', justifyContent: 'center' }}>
						<Button variant="contained" onClick={this.save} disabled={!store.hasChages}>Сохранить</Button>
						<Button variant="contained" 
							disabled={!store.editingEmployee || store.isNew}
							onClick={() => {store.deleteEmployeeAction()}}>Удалить</Button> 
						<Button variant="contained" 
							disabled={!store.editingEmployee}
							onClick={() => {store.cancelEditingAction()}}>Отменить</Button> 
						<Button variant="contained" onClick={() => {store.addNewEmployeeAction()}}>Добавить</Button>
						<Button variant='contained' onClick={() => {store.loadEmployeeListAction()}}>Обновить</Button>
					</Stack>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<EmployeeList></EmployeeList>
					</Grid>
					<Grid item xs={8}>
						<EmployeeCard></EmployeeCard>
					</Grid>
				</Grid>
				<Modal
					open={modalState?.showModal || false}
					onClose={() => {this.props.mainStore.hideModal()}}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					>
					<Paper className='modal-box' sx={{ padding: '15px' }}>
						<Typography id="modal-modal-title" variant="h6" component="h2">
						{modalState?.title || ''}
						</Typography>
						<Button onClick={() => {this.props.mainStore.hideModal()}}>Отмена</Button>
						<Button onClick={() => {this.props.mainStore.onModalSubmit()}}>Продолжить</Button>
					</Paper>
				</Modal>
			</Container>
		);
	}
}