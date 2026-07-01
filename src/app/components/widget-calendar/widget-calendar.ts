import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { CalendarCellDto } from '../../models/calendar-cell';
import { OutlaySummaryDto } from '../../models/outlay-summary';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { DateService } from '../../services/date';

@Component({
	selector: 'app-widget-calendar',
	imports: [],
	templateUrl: './widget-calendar.html',
	styleUrl: './widget-calendar.scss',
})
export class WidgetCalendar implements OnInit {

	outlayService = inject(OutlayService);
	dateService = inject(DateService);

	isHR = input<boolean>();


	employee = input<EmployeeOutputDto>();  // se il parent cambiasse dipendente senza distruggere e ricreare il componente, 
											// ngOnInit non verrebbe rieseguito, non basterebbe, dunque bisognerà poi pensare a un effect in futuro


	cells = signal<CalendarCellDto[]>([]);
	summary: OutlaySummaryDto[] = [];

	cellIsClicked = output<string>();

	month: number = new Date().getMonth();
	year: number = new Date().getFullYear();

	displayMonth = this.month + 1;
	maxOutlayAmount: number = 0;

	// dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	monthName: string = this.monthNames[this.month];


	ngOnInit() {

		this.fetchData();

	}

	fetchData() {

		this.outlayService.getCalendarSummary(this.employee()!.id,
			this.displayMonth,
			this.year,
			undefined).subscribe({
				next: (data: OutlaySummaryDto[]) => {
					this.summary = data;
					this.generateCalendar(this.month, this.year);
				},
				error: () => console.error("errore nel caricamento delle celle")
			})

	}

	generateCalendar(month: number, year: number) {
		const result: CalendarCellDto[] = [];

		const offset = this.dateService.getWeekOffset(year, month) // il primo giorno di maggio diventa 4
		const currentMonthLength = this.dateService.currentMonthLength(year, month);

		// blocco mese precedente
		for (let i = 0; i < offset; i++) {
			const day = currentMonthLength - offset + i;
			const cellDate = this.dateService.formatDate(year, this.displayMonth - 1, day + 1);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0,
			}

			result.push(cell)
		}

		// blocco mese corrente
		for (let i = 1; i <= currentMonthLength; i++) {
			const cellDate = this.dateService.formatDate(year, this.displayMonth, i);
			const isToday = this.dateService.isToday(year, month, i);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: true,
				isToday: isToday,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0
			}

			result.push(cell);

		}

		// blocco mese successivo
		const missingCells = 42 - result.length;

		for (let i = 1; i <= missingCells; i++) {
			const cellDate = this.dateService.formatDate(year, this.displayMonth + 1, i);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0
			}

			result.push(cell);
		}

		this.cells.set(result);
		this.mergeData(result);

	}

	private mergeData(result: CalendarCellDto[]) {

		const currentCells = result.filter(c => c.isCurrentMonth);

		currentCells.forEach(cell => {
			const matchingData = this.summary.find(o => o.date === cell.date);

			if (matchingData?.outlayAmount) {
				cell.outlayAmount = matchingData.outlayAmount
			}
			if (matchingData?.refundAmount) {
				cell.refundAmount = matchingData.refundAmount
			}
		});

		this.maxOutlayAmount = Math.max(...currentCells.map(c => c.outlayAmount));

	}

	getCellColor(outlayAmount: number, isCurrentMonth: boolean) {

		// se la spesa è 0, ma guardiamo le celle del mese corrente, 
		// restituisco il colore meno intenso possibile, nella scala del blu scelto
		if (outlayAmount === 0 && isCurrentMonth) { return "rgb(241, 249, 252)" }

		// se abbiamo delle spese e guardiamo il mese corrente, 
		// restituisco una stringa costruita con i valori calcolati in base alla sfumatura 
		// del blu scelto e la percentuale ottenuta dall'ammontare delle spese
		if (isCurrentMonth) {

			const value = outlayAmount / this.maxOutlayAmount * 100;
			const scaledValue = 10 + (value * 90 / 100);

			const r = 255 - (255 * scaledValue / 100);
			const g = 255 - ((255 - 172) * scaledValue / 100);
			const b = 255 - (0 * scaledValue / 100);

			return "rgb(" + r + ", " + g + ", " + b + ")";

		} else { return "rgb(245, 245, 245)"; } // le celle inattive
	}

	onChangeMonth(direction: number) {

		this.month += direction;
		this.displayMonth += direction;
		this.monthName = this.monthNames[this.month];

		if (this.month === 12) {

			this.month = 0;
			this.displayMonth = 1;
			this.monthName = this.monthNames[this.month];

		}

		if (this.month === -1) {

			this.month = 11;
			this.displayMonth = 12;
			this.monthName = this.monthNames[this.month];

		}

		this.fetchData();

	}

	onCellClick(cell: CalendarCellDto) {
		if (cell.isCurrentMonth) {
			this.cellIsClicked.emit(cell.date);
		} else {
			this.onInactiveCell(cell);
		}
	}

	onInactiveCell(result: CalendarCellDto) {

		const toNumberDate = Number(result.date.substring(5, 7));

		if (this.displayMonth - toNumberDate > 0) {
			this.onChangeMonth(-1);
		}
		if (this.displayMonth - toNumberDate < 0) {
			this.onChangeMonth(1);
		}

	}


}
