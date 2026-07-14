import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-logout',
	imports: [],
	templateUrl: './logout.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './logout.scss',
})
export class Logout {
	private router = inject(Router);

	collapsed = input<boolean>(true);

	context = input<'dashboard' | 'sidebar'>('dashboard');

	onLogoutClick() {
		console.log('Sloggato');
		sessionStorage.clear();
		this.router.navigate(['']);
	}
}
