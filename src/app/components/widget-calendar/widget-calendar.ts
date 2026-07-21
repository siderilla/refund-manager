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

	employee = input<EmployeeOutputDto>(); // se il parent cambiasse dipendente senza distruggere e ricreare il componente,
	// ngOnInit non verrebbe rieseguito, non basterebbe, dunque bisognerà poi pensare a un effect in futuro

	cells = signal<CalendarCellDto[]>([]);
	summary: OutlaySummaryDto[] = [];

	cellIsClicked = output<string>();

	month: number = new Date().getMonth() + 1;
	year: number = new Date().getFullYear();

	// displayMonth = this.month + 1; // conversione di frontiera a quanto pare fragile e inutile

	maxOutlayAmount: number = 0;
	monthChanged = output<{ month: number; year: number }>();

	dayNames = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
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
				error: () => console.error('errore nel caricamento delle celle'),
			});
	}

	generateCalendar(month: number, year: number) {
		const result: CalendarCellDto[] = [];

		const offset = this.dateService.getWeekOffset(year, month); // il primo giorno di maggio diventa 4
		const currentMonthLength = this.dateService.monthLength(year, month);
		const prevMonthLength = this.dateService.monthLength(year, month - 1);

		// blocco mese precedente
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

		// blocco mese corrente
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

		// blocco mese successivo
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

		console.log('mese visualizzato', this.month,
			'lunghezza mese precedente',
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
		// se la spesa è 0, ma guardiamo le celle del mese corrente,
		// restituisco il colore meno intenso possibile, nella scala del blu scelto
		if (outlayAmount === 0 && isCurrentMonth) {
			return 'rgb(241, 249, 252)';
		}

		// se abbiamo delle spese e guardiamo il mese corrente,
		// restituisco una stringa costruita con i valori calcolati in base alla sfumatura
		// del blu scelto e la percentuale ottenuta dall'ammontare delle spese
		if (isCurrentMonth) {
			const value = (outlayAmount / this.maxOutlayAmount) * 100;
			const scaledValue = 10 + (value * 90) / 100;

			const r = 255 - (255 * scaledValue) / 100;
			const g = 255 - ((255 - 172) * scaledValue) / 100;
			const b = 255 - (0 * scaledValue) / 100;

			return 'rgb(' + r + ', ' + g + ', ' + b + ')';
		} else {
			return 'rgb(245, 245, 245)';
		} // le celle inattive
	}

	onChangeMonth(direction: number) { // questo metodo può sparire se passo a luxon
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
		const indexMonth = Number(result.date.substring(5, 7)); // result.date ci da la data del mese corrente
		console.log("cos'è?", indexMonth, result.date); // potenziale bug che restituisce temporaneamente date sbagliate a cavallo tra gennaio e dicembre ES: 2025-13-01 che dovrebbe essere invece 2026-01-01


		if (this.month - indexMonth > 0) {
			this.onChangeMonth(-1);
		}
		if (this.month - indexMonth < 0) {
			this.onChangeMonth(1);
		}
	}
}
