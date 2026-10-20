import {
	Component,
	inject,
	input,
	output,
	signal,
	ChangeDetectionStrategy,
	effect,
} from '@angular/core';
import { CalendarCellDto } from '../../models/calendar-cell';
import { OutlaySummaryDto } from '../../models/outlay-summary';
import { OutlayService } from '../../services/outlay';
import { EmployeeOutputDto } from '../../models/employee-output';
import { DateService } from '../../services/date';

@Component({
	selector: 'app-widget-calendar',
	imports: [],
	templateUrl: './widget-calendar.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './widget-calendar.scss',
})
export class WidgetCalendar {
	outlayService = inject(OutlayService);
	dateService = inject(DateService);

	isHR = input<boolean>();

	employee = input<EmployeeOutputDto>(); // if the parent changed employee without destroying and recreating the component,
	// ngOnInit wouldn't rerun, so that wouldn't be enough - will need to think about an effect for this later

	cells = signal<CalendarCellDto[]>([]);
	summary: OutlaySummaryDto[] = [];

	cellIsClicked = output<string>();

	month: number = new Date().getMonth() + 1;
	year: number = new Date().getFullYear();

	// displayMonth = this.month + 1; // conversione di frontiera a quanto pare fragile e inutile

	maxOutlayAmount: number = 0;
	monthChanged = output<{ month: number; year: number }>();

	dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	monthName: string = this.monthNames[this.month - 1];

	constructor() {
		effect(() => {
			this.fetchData();
		});

	}

	fetchData() {
		this.outlayService
			.getCalendarSummary(this.month, this.year, this.employee()?.id, undefined)
			.subscribe({
				next: (data: OutlaySummaryDto[]) => {
					this.summary = data;
					this.generateCalendar(this.month, this.year);
				},
				error: () => console.error('error loading calendar cells'),
			});
	}

	generateCalendar(month: number, year: number) {
		const result: CalendarCellDto[] = [];

		const offset = this.dateService.getWeekOffset(year, month); // the first day of May becomes 4
		const currentMonthLength = this.dateService.monthLength(year, month);
		const prevMonthLength = this.dateService.monthLength(year, month - 1);

		// previous month block
		for (let i = 0; i < offset; i++) {
			const day = prevMonthLength - offset + i + 1;
			const cellDate = this.dateService.formatDate(year, this.month - 1, day);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0,
			};
			result.push(cell);
		}

		// current month block
		for (let i = 1; i <= currentMonthLength; i++) {
			const cellDate = this.dateService.formatDate(year, this.month, i);
			const isToday = this.dateService.isToday(year, month, i);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: true,
				isToday: isToday,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0,
			};
			result.push(cell);
		}

		// next month block
		const missingCells = 42 - result.length;

		for (let i = 1; i <= missingCells; i++) {
			const cellDate = this.dateService.formatDate(year, this.month + 1, i);

			const cell: CalendarCellDto = {
				date: cellDate,
				isCurrentMonth: false,
				isToday: false,
				isSelected: false,
				outlayAmount: 0,
				refundAmount: 0,
			};
			result.push(cell);
		}

		this.cells.set(result);
		this.mergeData(result);

		console.log('displayed month', this.month,
			'previous month length',
			this.dateService.monthLength(year, month - 1));
	}

	private mergeData(result: CalendarCellDto[]) {
		const currentCells = result.filter((c) => c.isCurrentMonth);

		currentCells.forEach((cell) => {
			const matchingData = this.summary.find((o) => o.date === cell.date);

			if (matchingData?.outlayAmount) {
				cell.outlayAmount = matchingData.outlayAmount;
			}
			if (matchingData?.refundAmount) {
				cell.refundAmount = matchingData.refundAmount;
			}
		});

		this.maxOutlayAmount = Math.max(...currentCells.map((c) => c.outlayAmount));
	}

	getCellColor(outlayAmount: number, isCurrentMonth: boolean) {
		// if the expense is 0, but we're looking at the current month's cells,
		// return the least intense color possible, on the chosen blue scale
		if (outlayAmount === 0 && isCurrentMonth) {
			return 'rgb(241, 249, 252)';
		}

		// if we have expenses and we're looking at the current month,
		// return a string built from values calculated based on the shade
		// of the chosen blue and the percentage obtained from the expense amount
		if (isCurrentMonth) {
			const value = (outlayAmount / this.maxOutlayAmount) * 100;
			const scaledValue = 10 + (value * 90) / 100;

			const r = 255 - (255 * scaledValue) / 100;
			const g = 255 - ((255 - 172) * scaledValue) / 100;
			const b = 255 - (0 * scaledValue) / 100;

			return 'rgb(' + r + ', ' + g + ', ' + b + ')';
		} else {
			return 'rgb(245, 245, 245)';
		} // inactive cells
	}

	onChangeMonth(direction: number) { // this method could go away if I switch to luxon
		this.month += direction;

		if (this.month === 13) {
			this.month = 1;
			this.year += 1;
		}

		if (this.month === 0) {
			this.month = 12;
			this.year -= 1;
		}

		this.monthName = this.monthNames[this.month - 1];
		this.monthChanged.emit({ month: this.month, year: this.year });
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
		const indexMonth = Number(result.date.substring(5, 7)); // result.date gives us the current month's date
		console.log("what is it?", indexMonth, result.date); // potential bug that temporarily returns wrong dates across the January/December boundary E.G.: 2025-13-01 which should instead be 2026-01-01


		if (this.month - indexMonth > 0) {
			this.onChangeMonth(-1);
		}
		if (this.month - indexMonth < 0) {
			this.onChangeMonth(1);
		}
	}
}
