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

			// this.categoryService.getCategories().subscribe({ // fetcho tutte le categorie
			// 	next: (categories: CategoryOutputDto[]) => {
			// 		this.outlayService.getDaySummary(date, employeeId).subscribe({ // fetcho la somma delle spese fatte quel giorno raggruppate per categoria
			// 			next: (data) => {
			// 				// per ogni categoria esistente cerca se c'è una spesa quel giorno
			// 				const merged: DaySummaryDto[] = categories.map(cat => {
			// 					const match = data.find(d => d.categoryName === cat.name);
			// 					return {
			// 						categoryName: cat.name,
			// 						outlayAmount: match?.outlayAmount ?? 0, // se c'è usalo, altrimenti == 0
			// 						refundAmount: match?.refundAmount ?? 0,
			// 						dailyBudget: cat.dailyBudget
			// 					};
			// 				});
			// 				this.daySummary.set(merged);
			// 				this.maxOutlayAmount = Math.max(...merged.map(d => d.outlayAmount)); // pesco il numero più grande per corrisponderlo al 100%
			// 			},
			// 			error: () => console.error('errore day summary')
			// 		});
			// 	},
			// 	error: () => console.error('errore categorie')
			// });
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
