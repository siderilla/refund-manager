import {
	Component,
	effect,
	inject,
	input,
	OnInit,
	signal,
	ChangeDetectionStrategy,
} from '@angular/core';
import { View as ViewType } from '../../models/view';
import { EmployeeOutputDto } from '../../models/employee-output';
import { OutlayService } from '../../services/outlay';
import { RefundService } from '../../services/refund';
import { OutlayOutputDto } from '../../models/outlay-output';
import { AgGridAngular } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';
import { OUTLAY_STATUS } from '../../constants/app-constants';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
	selector: 'app-requests-list',
	imports: [
		AgGridAngular,
	],
	templateUrl: './requests-list.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './requests-list.scss',
})
export class RequestsList {
	outlayService = inject(OutlayService);
	refundService = inject(RefundService);

	activeView = input<ViewType>();
	employee = input<EmployeeOutputDto>();
	outlay = input<OutlayOutputDto>();
	isHR = input<boolean>();

	outlays = signal<OutlayOutputDto[]>([]);

	colDefs: ColDef[] = [];

	defaultColDef: ColDef = {
		flex: 1,
		sortable: true,
		filter: true,
		floatingFilter: true,
	};

	private readonly STATUS_CSS_CLASS: Record<string, string> = {
		[OUTLAY_STATUS.PENDING]: 'status-pending',
		[OUTLAY_STATUS.APPROVED]: 'status-approved',
		[OUTLAY_STATUS.REJECTED]: 'status-rejected',
	};

	constructor() {
		effect(() => {
			const view = this.activeView()?.type;
			const employee = this.employee();
			if (!view || !employee) return;

			this.setupColumns(view);
			this.loadData(view, employee.id);
		});
	}

	private setupColumns(view: string) {
		const columns: ColDef[] = [
			{
				field: 'date',
				headerName: 'Date',
				valueFormatter: (p) => new Date(p.value).toLocaleDateString(),
			},
			{ field: 'categoryName', headerName: 'Category' },
			{ field: 'amount', headerName: 'Expense Amount', valueFormatter: (p) => p.value + ' €' },
			{
				field: 'refundedAmount',
				headerName: 'Refund Amount',
				valueFormatter: (p) => (p.value != null ? `${p.value} €` : '---'), // a toFixed() might be useful here, because in the real world amounts are rarely round numbers...
			},
			{
				field: 'description',
				headerName: 'Notes',
				tooltipField: 'description', // shows the full text on mouse hover
				minWidth: 200,
			},
			{
				field: 'status',
				headerName: 'Status',

				cellRenderer: (p: any) => {
					const className = this.STATUS_CSS_CLASS[p.value] ?? '';
					return `<span class="status-chip ${className}">
						${p.value}
					</span>`;
				},
			},
		];

		// in HR areas add the employee name column FIRST in the list:
		if (view.includes('requests-pending') || view.includes('requests-archive')) {
			columns.unshift({ field: 'employeeFullName', headerName: 'Employee' });
		}

		// only on pending requests, and only for HR: add the approve/reject buttons
		if (view === 'requests-pending' && this.isHR()) {
			columns.push({
				field: 'actions',
				headerName: 'Actions',
				sortable: false,
				filter: false,
				cellRenderer: (p: any) => `
					<button class="action-btn approve-btn" data-action="approve" data-id="${p.data.id}">Approve</button>
					<button class="action-btn reject-btn" data-action="reject" data-id="${p.data.id}">Reject</button>
				`,
			});
		}

		this.colDefs = columns;
	}

	onCellClicked(event: any) {
		const action = event.event.target?.dataset?.action;
		if (!action) return;

		const outlayId = event.event.target.dataset.id;
		const isApproved = action === 'approve';

		this.refundService.processRefund(outlayId, isApproved).subscribe(() => {
			this.loadData(this.activeView()!.type, this.employee()!.id);
		});
	}

	private loadData(view: string, employeeId: string) {
		if (view === 'my-requests-list') {
			this.outlayService
				.getEmployeeOutlays(employeeId)
				.subscribe((data) => this.outlays.set(data));
		} else if (view === 'requests-pending') {
			this.outlayService
				.getOutlaysByStatus([OUTLAY_STATUS.PENDING], employeeId)
				.subscribe((data) => this.outlays.set(data));
		} else if (view === 'requests-archive') {
			this.outlayService
				.getOutlaysByStatus([OUTLAY_STATUS.APPROVED, OUTLAY_STATUS.REJECTED], employeeId)
				.subscribe((data) => this.outlays.set(data));
		}
	}
}
