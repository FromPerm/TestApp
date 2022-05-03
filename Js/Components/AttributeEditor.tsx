import { Box, Button, IconButton, List, ListItem, ListItemText, Modal, Paper, Stack, Typography } from '@mui/material';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { AdditionalAttribute, AdditionalAttributeType, AdditionalAttributeValueType } from '../../Models/model';
import { StoreProps } from "../Stores/MainStore";
import { CheckboxControl } from '../UI/CheckboxControl';
import { DatePickerControl } from '../UI/DatePickerControl';
import { NumberInputControl } from '../UI/NumberInputControl';
import { SelectControl } from '../UI/SelectControl';
import { TextInputControl } from '../UI/TextInputControl';
import DeleteIcon from '@mui/icons-material/Delete';

interface AttributeEditorState {
	types: string[];
	newAttribute: AdditionalAttribute;
	nameError: string;
}

@inject('mainStore')
@observer
export class AttributeEditor extends React.Component<StoreProps, AttributeEditorState> {
	private readonly nameErrorText = 'Название не может быть пустым';

	constructor(props: StoreProps) {
		super(props);
		this.hideModal = this.hideModal.bind(this);
		this.showModal = this.showModal.bind(this);
		this.setAttributeName = this.setAttributeName.bind(this);
		this.setAttributeType = this.setAttributeType.bind(this);
		this.saveAttribute = this.saveAttribute.bind(this);
		this.state = {
			types: ['строка', 'число', 'дата', 'чекбокс'],
			newAttribute: null,
			nameError: ''
		};
	}

	private getAdditionalAtrributeId(): number {
		const emp = this.props.mainStore.editingEmployee; 
		return (emp.additionalAttributes?.length > 0 ? Math.max(...emp.additionalAttributes.map(e => e.id )) : 0) + 1;
	}

	private getNewAttribute(): AdditionalAttribute {
		return {
		  id: this.getAdditionalAtrributeId(),
		  name: '',
		  type: 'строка'
		}
	  }

	private showModal(): void {
		this.setState({ newAttribute: this.getNewAttribute() });
	}

	private hideModal(): void {
		this.setState({ newAttribute: null });
	}

	private setAttributeName(val: string): void {
		const nameError = val ? '' : this.nameErrorText;
		this.setState({ newAttribute: {...this.state.newAttribute, name: val}, nameError });
	}

	private setAttributeType(val: string): void {
		this.setState({ newAttribute: {...this.state.newAttribute, type: val as AdditionalAttributeType} });
	}

	private saveAttribute(): void {
		if (!this.state.newAttribute.name) {
			this.setState({ nameError: this.nameErrorText });
			return;
		}
		const store = this.props.mainStore;
		const newAttr = {...this.state.newAttribute};
		store.addNewAttribute(newAttr);
		this.setState({ newAttribute: null });
	}

	private deleteAttribute(id: number): void {
		const store = this.props.mainStore;
		store.deleteAttribute(id);
	}

	private onAttrValueChanged(val: AdditionalAttributeValueType, id: number): void {
		const store = this.props.mainStore;
		store.setAttributeValue(val, id);
	}

	private getAtrributeValueEditor(attr: AdditionalAttribute): JSX.Element {
		switch (attr.type) {
			case 'дата': 
				return <DatePickerControl title={attr.name} value={attr.value as Date}  onChange={(val)=>{this.onAttrValueChanged(val, attr.id)}} />
			case 'чекбокс':
				return <CheckboxControl title={attr.name} checked={attr.value as boolean} onChange={(val)=>{this.onAttrValueChanged(val, attr.id)}} />
			case 'число': 
				return <NumberInputControl title={attr.name} value={attr.value as number} onChange={(val)=>{this.onAttrValueChanged(val, attr.id)}} />
			case 'строка':
			default:
				return <TextInputControl title={attr.name} value={attr.value as string} onChange={(val)=>{this.onAttrValueChanged(val, attr.id)}} />
		}
	}

	render() {
		const store = this.props.mainStore;
		return (
			<Stack>
				<List component="nav">
					{store.editingEmployee.additionalAttributes?.map((attr) => {
						return <ListItem
								key={attr.id}
							>
								<Stack direction="row">
									{this.getAtrributeValueEditor(attr)}
									<IconButton aria-label="delete" color="primary" onClick={() => {this.deleteAttribute(attr.id)}}>
										<DeleteIcon />
									</IconButton>
								</Stack>
							</ListItem>
					})}
				</List>
				<Button variant="outlined" onClick={this.showModal}>Добавить</Button>

				<Modal
					open={Boolean(this.state.newAttribute)}
					onClose={this.hideModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					>
					<Paper className='modal-box' sx={{ padding: '15px' }}>
						<Typography variant="h6" component="h2">
							Настройки дополнительного аттрибута
						</Typography>
						<Box
							component="form"
							autoComplete="off"
						>
							<Stack>
								<TextInputControl
									title='Название'
									value={this.state.newAttribute?.name}
									onChange={this.setAttributeName}
									errorText={this.state.nameError}
									></TextInputControl>
								<SelectControl
									title='Тип'
									values={this.state.types}
									selected={this.state.newAttribute?.type}
									onChange={this.setAttributeType}
									></SelectControl>
							</Stack>
							<Button onClick={this.hideModal}>Отмена</Button>
							<Button onClick={this.saveAttribute}>Сохранить</Button>
						</Box>
					</Paper>
				</Modal>
			</Stack>
		)
	}
}