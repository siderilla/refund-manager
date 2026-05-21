import { Component, inject, input, OnInit } from '@angular/core';
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

	cells: CalendarCellDto[] = [];
	summary: OutlaySummaryDto[] = [];

	today: Date = new Date;
	month: number = new Date().getMonth();
	year: number = new Date().getFullYear();

	dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	ngOnInit() {
		this.outlayService.getCalendarSummary(this.employee()!.id, this.month, this.year, undefined).subscribe({
			next: (data: any) => {
				this.cells = data;
			},
			error: () => console.error("errore nel caricamento delle celle")
		})
	}

	generateCalendar(month: number, year: number) {
		
		const firstDayOfMonth = new Date(year, month, 1);
		const nameFirstDay = firstDayOfMonth.getDay();
		const offset = (firstDayOfMonth.getDay() + 6) % 7;
		const currentMonthLength = new Date(year, month + 1, 0).getDate();
		const lastMonthLenght = new Date(year, month, 0).getDate();

		// blocco mese precedente
		for (let i = offset; i > 0; i--) {
			const day = lastMonthLenght - offset + i;
			const cellDate = new Date(year, month - 1, day);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0,
			}

			this.cells.push(cell);
		}

		// blocco mese corrente
		for (let i = 1; i <= currentMonthLength; i++) {
			const cellDate = new Date(year, month, 1);
			const today = new Date();
			const isToday = cellDate.getDate() == today.getDate() &&
							cellDate.getMonth() == today.getMonth() &&
							cellDate.getFullYear() == today.getFullYear();
			
			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: true,
				isToday: isToday,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0
			}

			this.cells.push(cell);
			
		}

		// blocco mese successivo
		const missingCells = 42 - this.cells.length;

		for (let i = 1; i <= missingCells; i++) {
			const cellDate = new Date(year, month + 1, i);

			
		}


		return this.dayNames[nameFirstDay];

	}

	changeMonth() {

	}

	calculateCells() {

	}

}
