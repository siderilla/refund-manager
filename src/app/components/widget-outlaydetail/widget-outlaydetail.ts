import { Component, input } from '@angular/core';

@Component({
	selector: 'app-widget-outlaydetail',
	imports: [],
	templateUrl: './widget-outlaydetail.html',
	styleUrl: './widget-outlaydetail.scss',
})
export class WidgetOutlaydetail {

	date = input<string | null>(null);

}
