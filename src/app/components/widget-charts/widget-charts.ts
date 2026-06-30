import { Component, input } from '@angular/core';

@Component({
	selector: 'app-widget-charts',
	imports: [],
	templateUrl: './widget-charts.html',
	styleUrl: './widget-charts.scss',
})
export class WidgetCharts {

	date = input<string | null>(null);

}
