import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { EmployeeOutputDto } from '../../models/employee-output';
import { Sidebar } from '../sidebar/sidebar';
import { WelcomeName } from '../welcome-name/welcome-name';
import { Logout } from '../logout/logout';
import { View as ViewType } from '../../models/view';
import { RequestView } from '../request-view/request-view';
import { HR_ROLE } from '../../constants/app-constants';

@Component({
	selector: 'app-dashboard',
	imports: [Sidebar, RequestView, WelcomeName, Logout],
	templateUrl: './dashboard.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
	employee: EmployeeOutputDto | undefined = undefined;
	activeView: ViewType | undefined = undefined;

	isMobileMenuOpen = signal(false);

	get isHR(): boolean {
		return this.employee?.role === HR_ROLE;
	}

	ngOnInit() {
		const data = sessionStorage.getItem('employee');
		if (data) {
			this.employee = JSON.parse(data);
		}

		this.activeView = { type: 'my-requests-list' }; // the default active view right after login
	}

	onViewSelected(event: ViewType) {
		this.activeView = event;
		this.isMobileMenuOpen.set(false); // closes the sidebar on mobile after the click
	}
}
