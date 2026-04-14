import { Component, OnInit } from '@angular/core';
import { Employee } from '../../services/employee';
import { EmployeeOutputDto } from '../../models/employee';
import { Sidebar } from '../sidebar/sidebar';
import { View } from "../view/view";
import { WelcomeName } from "../welcome-name/welcome-name";
import { Logout } from "../logout/logout";

@Component({
	selector: 'app-dashboard',
	imports: [
		Sidebar,
		View,
		WelcomeName,
		Logout
	],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

	employee: EmployeeOutputDto | null = null;

	get isHR(): boolean {
		return this.employee?.role === 'Investigatore privato';
	}

	ngOnInit() {
		const data = localStorage.getItem('employee');
		if (data) {
			this.employee = JSON.parse(data);
		}

	}

}
