export type SexType = 'male' | 'female';

export type AdditionalAttributeType = 'строка' | 'число' | 'дата' | 'чекбокс';

export type AdditionalAttributeValueType = string | number | boolean | Date

export interface AdditionalAttribute {
	id: number;
	name: string;
	type: AdditionalAttributeType;
	value?: AdditionalAttributeValueType;
}

export interface EmployeeInfo {
	id: number;
	fullName?: string;
	position?: string;
	birthDate?: Date;
	sex?: SexType;
	isFired?: boolean;
	collegues?: number[];
	additionalAttributes?: AdditionalAttribute[];
}