import { Component, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { DaySummaryDto } from '../../models/day-summary';
import { CategoryService } from '../../services/category';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-widget-charts',
	imports: [],
	templateUrl: './widget-charts.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './widget-charts.scss',
})
export class WidgetCharts {
	private outlayService = inject(OutlayService);
	private categoryService = inject(CategoryService);

	protected readonly Math = Math;

	date = input<string | null>(null);
	employee = input<EmployeeOutputDto>();
	daySummary = signal<DaySummaryDto[]>([]);

	maxAmount: number = 0;
	maxMonthlyBudget: number = 0;

	constructor() {
		effect(() => {
			const date = this.date();
			const employeeId = this.employee()?.id;
			if (!date || !employeeId) return;

			forkJoin({
				categories: this.categoryService.getCategories(),
				summary: this.outlayService.getDaySummary(date, employeeId),
			}).subscribe({
				next: ({ categories, summary }) => {
					const merged: DaySummaryDto[] = categories.map((cat) => {
						const match = summary.find((s) => s.categoryName === cat.name);
						return {
							categoryName: cat.name,
							outlayAmount: match?.outlayAmount ?? 0, // se c'è usalo, altrimenti == 0
							refundAmount: match?.refundAmount ?? 0,
							dailyBudget: cat.dailyBudget,
						};
					});
					this.daySummary.set(merged);

					const allAmounts = [
						...merged.map((m) => m.outlayAmount),
						...merged.map((m) => m.refundAmount),
					];
					this.maxAmount = Math.max(...allAmounts);

					this.maxMonthlyBudget = Math.max(...categories.map((mmb) => mmb.monthlyBudget));
				},
				error: () => console.error('errore caricamento dati'),
			});
		});
	}

	getColumnHeight(outlayAmount: number): string {
		// traduce gli importi in larghezze/altezze proporzionali per il CSS
		if (!outlayAmount || this.maxAmount === 0) {
			return '0%';
		}
		const value = (outlayAmount / this.maxAmount) * 100;
		return value.toString() + '%';
	}

	getBudgetRatio() {}
}
