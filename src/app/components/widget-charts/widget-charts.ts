import { Component, effect, inject, input, signal } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { DaySummaryDto } from '../../models/day-summary';
import { CategoryService } from '../../services/category';
import { CategoryOutputDto } from '../../models/category-output';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-widget-charts',
	imports: [],
	templateUrl: './widget-charts.html',
	styleUrl: './widget-charts.scss',
})
export class WidgetCharts {

	private outlayService = inject(OutlayService);
	private categoryService = inject(CategoryService);

	date = input<string | null>(null);
	employee = input<EmployeeOutputDto>();
	daySummary = signal<DaySummaryDto[]>([]);
	
	maxOutlayAmount: number = 0;
	maxMonthlyBudget: number = 0;

	constructor() {

		effect(() => {
			const date = this.date();
			const employeeId = this.employee()?.id;
			if (!date || !employeeId) return;

			forkJoin({
				categories: this.categoryService.getCategories(),
				summary: this.outlayService.getDaySummary(date, employeeId)
			}).subscribe({
				next: ({ categories, summary }) => {
					const merged: DaySummaryDto[] = categories.map(cat => {
						const match = summary.find(s => s.categoryName === cat.name);
						return {
							categoryName: cat.name,
							outlayAmount: match?.outlayAmount ?? 0, // se c'è usalo, altrimenti == 0
							refundAmount: match?.refundAmount ?? 0,
							dailyBudget: cat.dailyBudget
						};
					});
					this.daySummary.set(merged);
					this.maxOutlayAmount = Math.max(...merged.map(mo => mo.outlayAmount));
					this.maxMonthlyBudget = Math.max(...categories.map(mmb => mmb.monthlyBudget));
				},
				error: () => console.error('errore caricamento dati')
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

	// questo metodo verrà rinominato in getPolylinePercent o qualcosa del genere e verrà usato solo per la polyline
	getBarLength(outlayAmount: number): string { // trasformo tutti gli importi in percentuali
		if (!outlayAmount || this.maxOutlayAmount === 0) { return "0%"; }
		const value = (outlayAmount / this.maxOutlayAmount) * 100;
		return value.toString() + "%";
	}

	getGraphHeight(): number {
		return this.maxMonthlyBudget;
	}

}
