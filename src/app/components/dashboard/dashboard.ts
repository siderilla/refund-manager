import { Component, OnInit } from '@angular/core';
import { EmployeeOutputDto } from '../../models/employee-output';
import { Sidebar } from '../sidebar/sidebar';
import { WelcomeName } from "../welcome-name/welcome-name";
import { Logout } from "../logout/logout";
import { View as ViewType } from '../../models/view';
import { RequestView } from '../request-view/request-view';

@Component({
	selector: 'app-dashboard',
	imports: [
		Sidebar,
		RequestView,
		WelcomeName,
		Logout
	],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

	employee: EmployeeOutputDto | undefined = undefined;
	activeView: ViewType | undefined = undefined;

	get isHR(): boolean {
		return this.employee?.role === 'Investigatore privato';
	}

	ngOnInit() {
		const data = sessionStorage.getItem('employee'); 
		if (data) {
			this.employee = JSON.parse(data);
		}

		this.activeView = { type: 'my-requests-list'}; // la view attiva di default subito dopo il login 
	}

	onViewSelected(event: ViewType) {
		this.activeView = event;
	}

}
