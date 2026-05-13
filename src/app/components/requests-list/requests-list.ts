import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { RequestCard } from "../request-card/request-card";
import { View as ViewType } from '../../models/view';
import { EmployeeOutputDto } from '../../models/employee-output';
import { OutlayService } from '../../services/outlay';
import { OutlayOutputDto } from '../../models/outlay-output';
import { AgGridAngular } from 'ag-grid-angular';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { ColDef } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
	selector: 'app-requests-list',
	imports: [
		AgGridAngular,
		// RequestCard,
	],
	templateUrl: './requests-list.html',
	styleUrl: './requests-list.scss',
})
export class RequestsList {

	outlayService = inject(OutlayService)

	activeView = input<ViewType>();
	employee = input<EmployeeOutputDto>();
	outlay = input<OutlayOutputDto>()
	isHR = input<boolean>();

	outlays = signal<OutlayOutputDto[]>([]);

	colDefs: ColDef[] = [];

	defaultColDef: ColDef = {
		flex: 1,
		sortable: true,
		filter: true,
		floatingFilter: true,
	}

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
			{ field: 'date', headerName: 'Data', valueFormatter: p => new Date(p.value).toLocaleDateString() },
			{ field: 'categoryName', headerName: 'Categoria' },
			{ field: 'amount', headerName: 'Importo Spesa', valueFormatter: p => p.value + ' €' },
			{
				field: 'refundedAmount',
				headerName: 'Importo Rimborso',
				valueFormatter: p => p.value != null ? `${p.value} €` : '---' //potrebbe essere utile un toFixed() perché nel mondo reale non esistono cifre tonde...
			},
			{
				field: 'description',
				headerName: 'Note',
				tooltipField: 'description', // mostra il testo completo se passa sopra col mouse
				minWidth: 200
			},
			{
				field: 'status',
				headerName: 'Stato',

				// ogni quadrato della tabella è una cella che genero tipo any:
				cellRenderer: (p: any) => {
					let className = '';

					// che parola c'è dentro questa cella? e ne assegno la classe CSS: 
					switch (p.value) {
						case 'In attesa':
							className = 'status-pending'; // usa la chip gialla nel CSS etc..
							break;

						case 'Approvata':
							className = 'status-approved';
							break;

						case 'Rifiutata':
							className = 'status-rejected';
							break;
					}

					// restituisco l'HTML generato con il className assegnato:
					return `<span class="status-chip ${className}">
					${p.value}
				</span>`;
				}
			}
		];

		// nelle aree HR aggiungi AL PRIMO della lista la colonna nome dipendente:
		if (view.includes('requests-pending') || view.includes('requests-archive')) {
			columns.unshift({ field: 'employeeFullName', headerName: 'Dipendente' });
		}

		this.colDefs = columns;
	}

	private loadData(view: string, employeeId: string) {
		if (view === 'my-requests-list') {
			this.outlayService.getEmployeeOutlays(employeeId).subscribe(data => this.outlays.set(data));
		} else if (view === 'requests-pending') {
			this.outlayService.getOutlaysByStatus(['In attesa'], employeeId).subscribe(data => this.outlays.set(data));
		} else if (view === 'requests-archive') {
			this.outlayService.getOutlaysByStatus(['Approvata', 'Rifiutata'], employeeId).subscribe(data => this.outlays.set(data));
		}
	}

	// constructor() {
	// 	effect(() => {

	// 		const view = this.activeView()?.type;
	// 		const employee = this.employee();
	// 		const values = ['Approvata', 'Rifiutata'];

	// 		if (!view || !employee) return;

	// 		console.log('view:', view);
	// 		console.log('employee:', employee);

	// 		if (view === 'my-requests-list') {
	// 			this.outlayService.getEmployeeOutlays(employee!.id).subscribe({
	// 				next: (data: any) => {
	// 					this.outlays.set(data);
	// 				},
	// 				error: () => {
	// 					console.error('Ops, qualcosa è andato storto :(')
	// 				}
	// 			})
	// 		} else if (view === 'requests-pending' && this.isHR()) { // nel dubbio doppio controllo che è HR
	// 			this.outlayService.getOutlaysByStatus(['In attesa'], employee!.id).subscribe({
	// 				next: (data: any) => {
	// 					this.outlays.set(data);
	// 				},
	// 				error: () => {
	// 					console.error('Ops, qualcosa è andato storto :(')
	// 				}
	// 			})
	// 		} else if (view === 'requests-archive' && this.isHR()) {
	// 			this.outlayService.getOutlaysByStatus(['Approvata', 'Rifiutata'], employee!.id).subscribe({ // o cambio l'endpoint o faccio due volte la chiamata
	// 				next: (data: any) => {
	// 					console.log("risposta con values:", data.$values); // ok loop object cycle risolto
	// 					console.log("risposta senza values:", data);
	// 					this.outlays.set(data);
	// 				},
	// 				error: () => {
	// 					console.error('Ops, qualcosa è andato storto :(')
	// 				}
	// 			})
	// 		}
	// 	})
	// }

}
