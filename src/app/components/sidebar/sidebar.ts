import { Component, input, output } from '@angular/core';
import { EmployeeMenu } from "../employee-menu/employee-menu";
import { HrMenu } from "../hr-menu/hr-menu";
import { View } from '../../models/view';

@Component({
	selector: 'app-sidebar',
	imports: [
		EmployeeMenu,
		HrMenu
	],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.scss',
})
export class Sidebar {

	isHR = input<boolean>();
	viewSelected = output<View>();
	activeView = input<View>();

	onViewSelected(view: View) {
		this.viewSelected.emit(view)
	}

}
