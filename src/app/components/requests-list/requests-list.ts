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
				headerName: 'Data',
				valueFormatter: (p) => new Date(p.value).toLocaleDateString(),
			},
			{ field: 'categoryName', headerName: 'Categoria' },
			{ field: 'amount', headerName: 'Importo Spesa', valueFormatter: (p) => p.value + ' €' },
			{
				field: 'refundedAmount',
				headerName: 'Importo Rimborso',
				valueFormatter: (p) => (p.value != null ? `${p.value} €` : '---'), //potrebbe essere utile un toFixed() perché nel mondo reale non esistono cifre tonde...
			},
			{
				field: 'description',
				headerName: 'Note',
				tooltipField: 'description', // mostra il testo completo se passa sopra col mouse
				minWidth: 200,
			},
			{
				field: 'status',
				headerName: 'Stato',

				cellRenderer: (p: any) => {
					const className = this.STATUS_CSS_CLASS[p.value] ?? '';
					return `<span class="status-chip ${className}">
						${p.value}
					</span>`;
				},
			},
		];

		// nelle aree HR aggiungi AL PRIMO della lista la colonna nome dipendente:
		if (view.includes('requests-pending') || view.includes('requests-archive')) {
			columns.unshift({ field: 'employeeFullName', headerName: 'Dipendente' });
		}

		this.colDefs = columns;
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
