import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Login } from '../login/login';
import { AuthService } from '../../services/auth';
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
	authService = inject(AuthService);

	onLogin(auth: { name: string; surname: string; password: string }) {
		this.authService.login(auth.name, auth.surname, auth.password).subscribe({
			next: ({ token, employee }) => {
				console.log('Login successful!');
				sessionStorage.setItem('token', token);
				sessionStorage.setItem('employee', JSON.stringify(employee));
				this.router.navigate(['/dashboard']);
			},
			error: () => {
				console.error('Access denied');
			},
		});
	}
}
