import { Component, output } from '@angular/core';
import { View } from '../view/view';

@Component({
	selector: 'app-employee-menu',
	imports: [],
	templateUrl: './employee-menu.html',
	styleUrl: './employee-menu.scss',
})
export class EmployeeMenu {

	submitView = output<View>();

	onViewClick(view: View) {
		this.submitView.emit({ type: view })
	}


}
