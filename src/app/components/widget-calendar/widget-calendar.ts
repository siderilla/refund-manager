import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CalendarCellDto } from '../../models/calendar-cell';
import { OutlaySummaryDto } from '../../models/outlay-summary';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';

@Component({
	selector: 'app-widget-calendar',
	imports: [],
	templateUrl: './widget-calendar.html',
	styleUrl: './widget-calendar.scss',
})
export class WidgetCalendar implements OnInit {

	outlayService = inject(OutlayService);

	isHR = input<boolean>();
	employee = input<EmployeeOutputDto>();

	cells = signal<CalendarCellDto[]>([]);
	summary: OutlaySummaryDto[] = [];

	today: Date = new Date;
	month: number = new Date().getMonth();
	year: number = new Date().getFullYear();

	displayMonth = this.month + 1;
	maxOutlayAmount: number = 0;

	// dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	monthName: string = this.monthNames[this.month]; // non si aggiorna, devo usare onChangeMonth per aggiornarlo


	ngOnInit() {

		this.getData();

	}

	getData() {

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

		const firstDayOfMonth = new Date(year, month, 1); // getDay() of the week = 5 se è maggio
		const offset = (firstDayOfMonth.getDay() + 6) % 7; // il primo giorno di maggio diventa 4
		const currentMonthLength = new Date(year, month + 1, 0).getDate();

		// blocco mese precedente
		for (let i = 0; i < offset; i++) {
			const day = currentMonthLength - offset + i;
			const cellDate = this.formatDate(year, this.displayMonth - 1, day + 1);

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
			const dateObj = new Date(year, month, i);

			const cellDate = this.formatDate(year, this.displayMonth, i);

			const today = new Date();
			const isToday = dateObj.getDate() == today.getDate() &&
				dateObj.getMonth() == today.getMonth() &&
				dateObj.getFullYear() == today.getFullYear();
			console.log("la data: ", dateObj);

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
			const cellDate = this.formatDate(year, this.displayMonth + 1, i);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0
			}

			result.push(cell);

			console.log(this.cells);
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

	formatDate(year: number, month: number, day: number) {

		const toStringYear = year.toString();
		const toStringMonth = month.toString();
		const toStringDay = day.toString();
		const stringDate = toStringYear + "-" + toStringMonth.padStart(2, "0") + "-" + toStringDay.padStart(2, "0")

		return stringDate;
	}

	getCellColor(outlayAmount: number, isCurrentMonth: boolean) {

		// se la spesa è 0, ma guardiamo le celle del mese corrente, 
		// restituisco il colore meno intenso possibile, nella scala del blu scelto
		if (outlayAmount === 0 && isCurrentMonth) { return "rgb(220, 238, 255)" }

		// se abbiamo delle spese e guardiamo il mese corrente, 
		// restituisco una stringa costruita con i valori calcolati in base alla sfumatura 
		// del blu scelto e la percentuale ottenuta dall'ammontare delle spese
		if (isCurrentMonth) {

			const value = outlayAmount / this.maxOutlayAmount * 100;

			const r = 255 - (255 * value / 100);
			const g = 255 - ((255 - 172) * value / 100);
			const b = 255 - (0 * value / 100);

			return "rgb(" + r + ", " + g + ", " + b + ")";

		} else { return "rgb(245, 245, 245)"; }
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

		this.getData();

	}

	onChangeMonthForward() {

		if (this.month === 11) {
			this.month = 0;
			this.displayMonth = 1;
			this.monthName = this.monthNames[this.month];

			this.getData();

			return;
		}

		this.month++;
		this.displayMonth++;
		this.monthName = this.monthNames[this.month];

		this.getData();

	}

	onChangeMonthBack() {

		if (this.month === 0) {
			this.month = 11;
			this.displayMonth = 12;
			this.monthName = this.monthNames[this.month];

			this.getData();

			return;
		}

		this.month--;
		this.displayMonth--;
		this.monthName = this.monthNames[this.month]

		this.getData();

	}
}
