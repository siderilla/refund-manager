import { Component, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { CategoryService } from '../../services/category';
import { OutlayOutputDto } from '../../models/outlay-output';

@Component({
	selector: 'app-widget-outlaydetail',
	imports: [],
	templateUrl: './widget-outlaydetail.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './widget-outlaydetail.scss',
})
export class WidgetOutlaydetail {
	outlayService = inject(OutlayService);

	date = input<string | null>(null);
	employee = input<EmployeeOutputDto>();
	isHR = input<boolean>();

	result = signal<OutlayOutputDto[]>([]);

	constructor() {
		effect(() => {
			const date = this.date();
			const employeeId = this.employee()?.id;
			if (!date) return;

			const source$ = employeeId
				? this.outlayService.getEmployeeOutlays(employeeId)
				: this.outlayService.getOutlaysByDate(date);

			source$.subscribe({
				next: (data) => {
					const byDate = data.filter((d) => d.date === date);
					this.result.set(byDate);
				},
				error: () => console.error('error loading result'),
			});
		});
	}
}
