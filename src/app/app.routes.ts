import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
	{ path: '', component: Home, title: 'Login' },
	{
		path: 'dashboard',
		title: 'Dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
	},
	{ path: '**', redirectTo: '' }
];
