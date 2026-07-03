import { Component, input, output, signal } from '@angular/core';
import { EmployeeMenu } from "../employee-menu/employee-menu";
import { HrMenu } from "../hr-menu/hr-menu";
import { View } from '../../models/view';
import { Logout } from "../logout/logout";

@Component({
	selector: 'app-sidebar',
	imports: [
		EmployeeMenu,
		HrMenu,
		Logout
	],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.scss',
})
export class Sidebar {

	isHR = input<boolean>();
	viewSelected = output<View>();
	activeView = input<View>();

	isCollapsed = signal(window.innerWidth < 992 ? false : true);

	onViewSelected(view: View) {
		this.viewSelected.emit(view)
	}

	onMouseEnter() {
		if (window.innerWidth >= 992) {
			this.isCollapsed.set(false);
		}
	}

	onMouseLeave() {
		if (window.innerWidth >= 992) {
			this.isCollapsed.set(true);
		}
	}

}
