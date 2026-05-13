export interface OutlayOutputDto {

	id: string;

	categoryName: string;
	employeeFullName: string;

	amount: number;
	receipt: boolean;
	date: string;
	description?: string;

	status: string;
	refundedAmount?: number;
	monthlyBudget: number;
	
}
