import { Component, effect, inject, input, signal } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { CategoryService } from '../../services/category';
import { OutlayOutputDto } from '../../models/outlay-output';

@Component({
	selector: 'app-widget-outlaydetail',
	imports: [],
	templateUrl: './widget-outlaydetail.html',
	styleUrl: './widget-outlaydetail.scss',
})
export class WidgetOutlaydetail {

	outlayService = inject(OutlayService);

	date = input<string | null>(null);
	employee = input<EmployeeOutputDto>();

	result = signal<OutlayOutputDto[]>([]);
	
	constructor() {

		effect(() => {
			const date = this.date();
			const employeeId = this.employee()?.id;
			if (!date || !employeeId) return;

			this.outlayService.getEmployeeOutlays(employeeId).subscribe({
				next: (data) => {
					const byDate = data.filter(d => d.date === date);
					this.result.set(byDate);
				},
				error: () => console.error('errore in result')
			});
		})

	}

}
