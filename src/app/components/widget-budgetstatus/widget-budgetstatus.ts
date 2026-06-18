import { Component, computed, input, signal, OnInit, inject } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { CategoryBudgetSummaryDto } from '../../models/category-budget-summary';

@Component({
	selector: 'app-widget-budgetstatus',
	standalone: true,
	imports: [],
	templateUrl: './widget-budgetstatus.html',
	styleUrl: './widget-budgetstatus.scss',
})
export class WidgetBudgetstatus implements OnInit {

	spentAmount = signal(0);
	totalBudget = signal(0);

	budgetSummary: CategoryBudgetSummaryDto[] = [];

	month: number = new Date().getMonth();
	year: number = new Date().getFullYear();

	displayMonth = this.month + 1;

	private outlayService = inject(OutlayService);



	employee = input<EmployeeOutputDto>();

	percentage = computed(() => {
		const calc = Math.round((this.spentAmount() / this.totalBudget()) * 100);
		return Math.min(100, Math.max(0, calc)); // Cap tra 0 e 100
	});

	displayPercentage = signal(0);

	ngOnInit() {

		this.fetchData();

		setTimeout(() => {
			this.displayPercentage.set(this.percentage());
		}, 200);

	}

	fetchData() {

		this.outlayService.getBudgetSummary(this.employee()!.id,
			this.displayMonth,
			this.year).subscribe({
				next: (data: CategoryBudgetSummaryDto[]) => {
					this.budgetSummary = data;
					this.spentAmount.set(data.reduce((acc, cat) => acc + cat.spentMonth, 0));
    				this.totalBudget.set(data.reduce((acc, cat) => acc + cat.monthlyBudget, 0));
					// piccolo delay permette al browser di registrare lo stato a 0%
					// e poi far partire l'animazione fluida verso l'alto fino alla percentuale reale
					setTimeout(() => {
						this.displayPercentage.set(this.percentage());
					}, 200);
				},
				error: () => console.error("errore nel caricamento delle celle")
			})

	}
}