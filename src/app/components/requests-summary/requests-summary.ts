import { Component, inject, input, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { CategoryBudgetSummaryDto } from '../../models/category-budget-summary';
import { WidgetBudgetstatus } from '../widget-budgetstatus/widget-budgetstatus';
import { WidgetCalendar } from '../widget-calendar/widget-calendar';
import { WidgetCharts } from '../widget-charts/widget-charts';
import { WidgetOutlaydetail } from '../widget-outlaydetail/widget-outlaydetail';

@Component({
	selector: 'app-requests-summary',
	imports: [WidgetBudgetstatus, WidgetCalendar, WidgetCharts, WidgetOutlaydetail],
	templateUrl: './requests-summary.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './requests-summary.scss',
})
export class RequestsSummary {
	private outlayService = inject(OutlayService);

	employee = input<EmployeeOutputDto>();
	isHR = input<boolean>();

	budgetSummary = signal<CategoryBudgetSummaryDto[]>([]);
	selectedDate = signal<string | null>(null);
	selectedEmployee = signal<EmployeeOutputDto | undefined>(undefined);

	employeeFilter = computed(() =>
		this.isHR() ? this.selectedEmployee() : this.employee()
	);

	currentCalendarMonth = signal<number>(new Date().getMonth() + 1);
	currentCalendarYear = signal<number>(new Date().getFullYear());

	ngOnInit() {
		this.loadSummary();
	}

	loadSummary() {
		this.outlayService.getBudgetSummary(this.employee()!.id).subscribe({
			next: (data) => {
				this.budgetSummary.set(data);
			},
			error: () => console.error('Oops, something went wrong :('),
		});
	}
}
