import { makeAutoObservable } from "mobx";
import { AdditionalAttribute, AdditionalAttributeValueType, EmployeeInfo } from "../../Models/model";
import { DataStorage } from "../DataStorage";

export interface ModalState {
  showModal?: boolean;
  title?: string;
  onSubmit?: () => void;
}

export type StoreProps = {
	mainStore?: MainStore;
};

export class MainStore {
  editingEmployee: EmployeeInfo;
  hasChages: boolean;
  isNew: boolean;
  employeeList: EmployeeInfo[];
  oldCollegues: number[];
  modalState: ModalState;
  showErrors: boolean;

  private readonly unsavedChangesWillLost = 'Все внесенные изменения будут потеряны';
  private readonly deleteEmployeeText = 'Сотрудник будет удалён';

  constructor() {
    makeAutoObservable(this);
    this.modalState = {
      title: this.unsavedChangesWillLost,
      showModal: false
    };
  }

  private getNewEmployeeId(): number {
		const emloyeeList = this.employeeList; 
		return (emloyeeList.length > 0 ? Math.max(...emloyeeList.map(e => e.id )) : 0) + 1;
	}

  hideModal(): void {
    this.modalState.showModal = false;
  }

  onModalSubmit(): void {
    this.modalState.onSubmit();
    this.hideModal();
  }

  showModalIfNeeded(callback: () => void, title: string = null, show: boolean = false): void {
    if (this.hasChages || show) {
      this.modalState.onSubmit = callback;
      this.modalState.showModal = true;
      this.modalState.title = title || this.unsavedChangesWillLost;
    } else {
      callback();
    }
  }

  setEditingEmployee(emp: EmployeeInfo): void {
    this.showErrors = false;
    this.hasChages = false;
    this.isNew = false;
    this.editingEmployee = {...emp};
    this.oldCollegues = emp.collegues;
  }

  setEditingEmployeeAttribute(emp: EmployeeInfo): void {
    this.hasChages = true;
    this.editingEmployee = emp;
  }

  private addNewEmployee(): void {
    const editingEmployee: EmployeeInfo = {
      id: this.getNewEmployeeId(),
      fullName: '',
      collegues: [],
      isFired: false
    };

    this.showErrors = false;
    this.hasChages = false;
    this.isNew = true;
    this.editingEmployee = editingEmployee;
  }

  enableShowErrors(): void {
    this.showErrors = true;
  }

  addNewEmployeeAction(): void {
    if (this.isNew) {
      return;
    }

    this.showModalIfNeeded(this.addNewEmployee.bind(this));
  }

  private loadEmployeeList(): void {
    const employeeList = DataStorage.getEmployeeList();
    employeeList.forEach((e, i) => {
      if (e.birthDate) 
        employeeList[i].birthDate = new Date(e.birthDate);
      if (e.additionalAttributes) { 
        e.additionalAttributes.filter(a => a.type === "дата")
        .forEach(a => a.value ? new Date(a.value as string) : null)
      }
    });
    this.employeeList = employeeList;
    this.cancelEditing();
  }

  loadEmployeeListAction(): void {
    this.showModalIfNeeded(this.loadEmployeeList.bind(this));
  }

  private addColluguesDeps(): void {
    const editingEmployee = this.editingEmployee;
    if (editingEmployee.collegues?.length) {
      editingEmployee.collegues.forEach((colId) => {
        const foundIndex = this.employeeList.findIndex(p => p.id === colId);
        if (foundIndex !== -1) {
          const collegues = this.employeeList[foundIndex].collegues;
          if (collegues) {
            if (!collegues.find(id => id === this.editingEmployee.id)) {
              this.employeeList[foundIndex].collegues.push(this.editingEmployee.id);
            }
          } else {
            this.employeeList[foundIndex].collegues = [this.editingEmployee.id];
          }
          DataStorage.saveEmployee(this.employeeList[foundIndex]);
        }
      })
    }
  }

  private removeCollegesDeps(): void {
    if (this.oldCollegues?.length) {
      const editingEmployee = this.editingEmployee;
      const colleguesToRemove = this.oldCollegues.filter(c => editingEmployee.collegues?.indexOf(c) === -1);
      colleguesToRemove.forEach(colId => {
        const foundIndex = this.employeeList.findIndex(p => p.id === colId);
        if (foundIndex !== -1) {
          if (this.employeeList[foundIndex].collegues) {
            this.employeeList[foundIndex].collegues = this.employeeList[foundIndex].collegues.filter(c => c !== this.editingEmployee.id);
            DataStorage.saveEmployee(this.employeeList[foundIndex]);
          }
        }
      })
    }
  }

  private isInvalidValidDate(dateVal: string | Date): boolean {
    if (typeof dateVal === 'string') {
      const date = new Date(dateVal);
      return isNaN(date.getDate());
    } else {
      return isNaN(dateVal.getDate());
    }
  }

  private validateEditingEmployee(): boolean {
    const emp = this.editingEmployee;
    if (!emp || !emp.fullName || !emp.position) {
			return false;
		}

    if (emp.birthDate && (isNaN(emp.birthDate.getDate()) || emp.birthDate > new Date())) {
      return false;
    }

    if (emp.additionalAttributes?.find(at => 
      at.type === "дата" 
      && at.value 
      && this.isInvalidValidDate(at.value as Date))) {
      return false;
    }

    return true;
  }

  saveEmployee(): void {
    const editingEmployee = { ...this.editingEmployee };

		if (!this.validateEditingEmployee()) {
			this.showErrors = true;
			return;
		}

    const foundIndex = this.employeeList.findIndex(p => p.id === editingEmployee.id);
    if (foundIndex === -1) {
      this.employeeList.push(editingEmployee);
    } else {
      this.employeeList[foundIndex] = editingEmployee;
    }
    DataStorage.saveEmployee(editingEmployee);

    this.addColluguesDeps();
    this.removeCollegesDeps();
    this.cancelEditing();
  }

  private deleteEmployee(): void {
    const editingEmployee = { ...this.editingEmployee };
    this.employeeList = this.employeeList.filter(p => p.id !== editingEmployee.id);
    DataStorage.deleteEmployee(editingEmployee);

    this.removeCollegesDeps();
    this.cancelEditing();
  }

  deleteEmployeeAction(): void {
    this.showModalIfNeeded(this.deleteEmployee.bind(this), this.deleteEmployeeText, true);
  }

  cancelEditingAction(): void {
    this.showModalIfNeeded(this.cancelEditing.bind(this));
  }

  cancelEditing(): void {
    this.oldCollegues = [];
    this.hasChages = false;
    this.editingEmployee = null;
    this.isNew = false;
    this.showErrors = false;
  }

  addNewAttribute(attr: AdditionalAttribute): void {
    this.hasChages = true;
    if (!this.editingEmployee.additionalAttributes) {
      this.editingEmployee.additionalAttributes = [attr]
    } else {
      this.editingEmployee.additionalAttributes.push(attr);
    }
  }

  deleteAttribute(id: number) {
    this.hasChages = true;
    this.editingEmployee.additionalAttributes = this.editingEmployee.additionalAttributes?.filter(a => a.id !== id);
  }

  setAttributeValue(val: AdditionalAttributeValueType, id: number): void {
    this.hasChages = true;
    const foundIndex = this.editingEmployee.additionalAttributes?.findIndex(a => a.id === id);
    this.editingEmployee.additionalAttributes[foundIndex].value = val;
  }
}

export default new MainStore();