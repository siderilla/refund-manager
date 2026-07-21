import {
	Component,
	computed,
	input,
	signal,
	OnInit,
	inject,
	effect,
	ChangeDetectionStrategy,
} from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { CategoryBudgetSummaryDto } from '../../models/category-budget-summary';

@Component({
	selector: 'app-widget-budgetstatus',
	standalone: true,
	imports: [],
	templateUrl: './widget-budgetstatus.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './widget-budgetstatus.scss',
})
export class WidgetBudgetstatus {
	componentId = Math.random().toString(36).substring(2, 7);

	spentAmount = signal(0);
	totalBudget = signal(0);

	// spentAmount = input<number>(750);
	// totalBudget = input<number>(1000);

	budgetSummary: CategoryBudgetSummaryDto[] = [];

	// month: number = new Date().getMonth();
	// year: number = new Date().getFullYear();
	// displayMonth = this.month + 1;

	private outlayService = inject(OutlayService);

	employee = input<EmployeeOutputDto>();
	isHR = input<boolean>();

	displayMonth = input.required<number>();
	year = input.required<number>();

	percentage = computed(() => {
		const calc = Math.round((this.spentAmount() / this.totalBudget()) * 100);
		return Math.min(100, Math.max(0, calc)); // cap tra 0 e 100
	});

	displayPercentage = signal(0);
	monthNames = [
		'Gennaio',
		'Febbraio',
		'Marzo',
		'Aprile',
		'Maggio',
		'Giugno',
		'Luglio',
		'Agosto',
		'Settembre',
		'Ottobre',
		'Novembre',
		'Dicembre',
	];
	monthName = computed(() => this.monthNames[this.displayMonth() - 1]);

	constructor() {
		effect(() => {
			const empId = this.employee()?.id;
			const m = this.displayMonth();
			const y = this.year();

			if (empId && m && y) {
				this.displayPercentage.set(0);

				this.outlayService.getBudgetSummary(empId, m, y).subscribe({
					next: (data) => {
						this.spentAmount.set(data.reduce((acc, cat) => acc + cat.spentMonth, 0));
						this.totalBudget.set(data.reduce((acc, cat) => acc + cat.monthlyBudget, 0));

						setTimeout(() => {
							this.displayPercentage.set(this.percentage());
						}, 50);
					},
					error: () => console.error('Errore budget'),
				});
			}
		});
	}
}
