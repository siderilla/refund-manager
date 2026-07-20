import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class DateService {

	getWeekOffset(year: number, month: number): number {
		const firstDayOfMonth = new Date(year, month - 1, 1);
		return (firstDayOfMonth.getDay() + 6) % 7;
	};

	monthLength(year: number, month: number): number {
		return new Date(year, month, 0).getDate();
	};

	isToday(year: number, month: number, day: number): boolean {
		const dateObj = new Date(year, month - 1, day);
		const today = new Date();
		return dateObj.getDate() == today.getDate() &&
			dateObj.getMonth() == today.getMonth() &&
			dateObj.getFullYear() == today.getFullYear();

	}

	formatDate(year: number, month: number, day: number): string {

		const toStringYear = year.toString();
		const toStringMonth = month.toString();
		const toStringDay = day.toString();
		const stringDate = toStringYear + "-" + toStringMonth.padStart(2, "0") + "-" + toStringDay.padStart(2, "0")

		return stringDate;
	};

}
