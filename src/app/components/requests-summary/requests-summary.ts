import { Component, inject, input, signal } from '@angular/core';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { CategoryBudgetSummaryDto } from '../../models/category-budget-summary';
import { WidgetBudgetstatus } from '../widget-budgetstatus/widget-budgetstatus';
import { WidgetCalendar } from '../widget-calendar/widget-calendar';
import { WidgetCharts } from '../widget-charts/widget-charts';
import { WidgetOutlaydetail } from '../widget-outlaydetail/widget-outlaydetail';

@Component({
	selector: 'app-requests-summary',
	imports: [
		WidgetBudgetstatus,
		WidgetCalendar,
		WidgetCharts,
		WidgetOutlaydetail
	],
	templateUrl: './requests-summary.html',
	styleUrl: './requests-summary.scss',
})
export class RequestsSummary {

	private outlayService = inject(OutlayService);

	employee = input<EmployeeOutputDto>();

	budgetSummary = signal<CategoryBudgetSummaryDto[]>([]);
	selectedDate = signal<string | null>(null)

	ngOnInit() {
		this.loadSummary();
	}

	loadSummary() {
		this.outlayService.getBudgetSummary(this.employee()!.id).subscribe({
			next: (data) => {
				this.budgetSummary.set(data);
			},
			error: () => console.error('Ops, qualcosa è andato storto :(')
		});
	}


}
