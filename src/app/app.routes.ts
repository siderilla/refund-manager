import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
	{ path: '', component: Home, title: 'Login' },
	{ path: 'dashboard', component: Dashboard, title: 'Dashboard', canActivate: [authGuard] },
	{ path: '**', redirectTo: '' }
];
