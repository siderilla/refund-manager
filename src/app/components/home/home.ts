import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Login } from '../login/login';
import { EmployeeService } from '../../services/employee';
import { Router } from '@angular/router';

@Component({
	selector: 'app-home',
	imports: [Login],
	templateUrl: './home.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './home.scss',
})
export class Home {
	private router = inject(Router);
	employeeService = inject(EmployeeService);

	onLogin(auth: { name: string; surname: string }) {
		this.employeeService.getEmployeeByName(auth.name, auth.surname).subscribe({
			next: (employee) => {
				console.log('Login successful!');
				sessionStorage.setItem('employee', JSON.stringify(employee));
				this.router.navigate(['/dashboard']);
			},
			error: () => {
				console.error('Access denied');
			},
		});
	}
}
