import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

	const router = inject(Router);
	const user = sessionStorage.getItem('employee');

	if (user) {
		return true;
	} else {
		return router.parseUrl('/');
	}
};
