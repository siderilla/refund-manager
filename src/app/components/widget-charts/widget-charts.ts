import { Component, effect, inject, input, signal } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { DaySummaryDto } from '../../models/day-summary';
import { CategoryService } from '../../services/category';
import { CategoryOutputDto } from '../../models/category-output';

@Component({
	selector: 'app-widget-charts',
	imports: [],
	templateUrl: './widget-charts.html',
	styleUrl: './widget-charts.scss',
})
export class WidgetCharts {

	private OutlayService = inject(OutlayService);
	private categoryService = inject(CategoryService);

	date = input<string | null>(null);
	employee = input<EmployeeOutputDto>();

	daySummary = signal<DaySummaryDto[]>([]);

	maxOutlayAmount: number = 0;



	constructor() {

		effect(() => {
			const date = this.date();
			const employeeId = this.employee()?.id;
			if (!date || !employeeId) return;

			this.categoryService.getCategories().subscribe({
				next: (categories: CategoryOutputDto[]) => {
					this.OutlayService.getDaySummary(date, employeeId).subscribe({
						next: (data) => {
							const merged: DaySummaryDto[] = categories.map(cat => {
								const match = data.find(d => d.categoryName === cat.name);
								return {
									categoryName: cat.name,
									outlayAmount: match?.outlayAmount ?? 0,
									refundAmount: match?.refundAmount ?? 0,
								};
							});
							this.daySummary.set(merged);
							this.maxOutlayAmount = Math.max(...merged.map(d => d.outlayAmount));
						},
						error: () => console.error('errore day summary')
					});
				},
				error: () => console.error('errore categorie')
			});
		});
		
	}


	getColumnHeight(outlayAmount: number): string {
		if (!outlayAmount || this.maxOutlayAmount === 0) { return "0%"; }
		const value = (outlayAmount / this.maxOutlayAmount) * 100;
		return value.toString() + "%";
	}

}
