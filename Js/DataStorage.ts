import { EmployeeInfo } from '../Models/model';

export class DataStorage {
	private static EmployeesKey: string = 'empList';
	private static readonly positions: string [] = [
		'Front-End Разработчик',
		'Менеджер проекта',
		'Руководитель проекта',
		'QA'
	]

	public static getItem(key: string): string {
		try {
			if (typeof localStorage !== 'undefined' && localStorage) {
				let value = localStorage.getItem(key);
				if (value) {
					return value;
				}
			}
		} catch { 
			return null;
		}
	}

	public static trySetItem(key: string, value: string): boolean {
		try {
			if (typeof localStorage !== 'undefined' && localStorage) {
				localStorage.setItem(key, value);
			}
			return true;
		} catch { 
			return false;
		}
	}

	public static getEmployeeList(): EmployeeInfo[] {
		const empString = DataStorage.getItem(DataStorage.EmployeesKey);
		if (!empString) {
			return [];
		}

		try {
			return JSON.parse(empString);
		} catch {
			return [];
		}
	}

	public static getPositions(): string[] {
		return this.positions;
	}

	public static setEmployeeList(emps: EmployeeInfo[]): void {
		const empsString = JSON.stringify(emps);
		if (!DataStorage.trySetItem(DataStorage.EmployeesKey, empsString)) {
			throw 'Employee list not saved';
		}
	}

	public static saveEmployee(emp: EmployeeInfo): void {
		const emloyeeList = this.getEmployeeList();
		const foundIndex = emloyeeList.findIndex(e => e.id === emp.id);
		if (foundIndex === -1) {
			emloyeeList.push(emp);
		} else {
			emloyeeList[foundIndex] = emp;
		}

		this.setEmployeeList(emloyeeList);
	}

	public static deleteEmployee(emp: EmployeeInfo): void {
		const emloyeeList = this.getEmployeeList();
		this.setEmployeeList(emloyeeList.filter(e => e.id !== emp.id));
	}
}