import { Component, input, output } from '@angular/core';
import { View } from '../../models/view';

@Component({
	selector: 'app-hr-menu',
	imports: [],
	templateUrl: './hr-menu.html',
	styleUrl: './hr-menu.scss',
})
export class HrMenu {

	viewSelected = output<View>();
	currentActive = input<string>();

	collapsed = input<boolean>(true);

	onMenuHrClick(view: View['type']) {
		this.viewSelected.emit({ type: view });
	}

}
