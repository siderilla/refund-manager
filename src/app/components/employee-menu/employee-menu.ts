import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { View } from '../../models/view';

@Component({
	selector: 'app-employee-menu',
	imports: [],
	templateUrl: './employee-menu.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './employee-menu.scss',
})
export class EmployeeMenu {
	viewSelected = output<View>();
	currentActive = input<string>();

	collapsed = input<boolean>(true);

	onMenuClick(view: View['type']) {
		this.viewSelected.emit({ type: view });
	}
}
