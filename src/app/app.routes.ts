import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
	{ path: '', component: Home, title: 'Accesso' },
	{ path: 'dashboard', component: Dashboard, title: 'Dashboard'},
	{ path: '**', redirectTo: '' }
];
