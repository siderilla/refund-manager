import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OutlayOutputDto } from '../models/outlay-output';
import { Observable, ObservableLike } from 'rxjs';
import { OutlayInputDto } from '../models/outlay-input';
import { CategoryBudgetSummaryDto } from '../models/category-budget-summary';
import { CalendarCellDto } from '../models/calendar-cell';
import { DaySummaryDto } from '../models/day-summary';

@Injectable({
	providedIn: 'root',
})
export class OutlayService {

	private http = inject(HttpClient);
	private baseUrl = 'https://localhost:7258/api';

	getEmployeeOutlays(employeeId: string): Observable<OutlayOutputDto[]> {
		return this.http.get<OutlayOutputDto[]>(
			`${this.baseUrl}/Outlays/by-employeeId?employeeId=${employeeId}`
		)
	}

	getOutlaysByStatus(statuses: string[], hrEmployeeId: string): Observable<OutlayOutputDto[]> {
		return this.http.get<OutlayOutputDto[]>(`${this.baseUrl}/Outlays/by-status`, {
			params: { statuses, hrEmployeeId }
		});
	}

	getBudgetSummary(employeeId: string, month?: number, year?: number): Observable<CategoryBudgetSummaryDto[]> {
		let params: any = { employeeId };
		if (month) params.month = month;
		if (year) params.year = year;

		return this.http.get<CategoryBudgetSummaryDto[]>(`${this.baseUrl}/Outlays/budget-summary`, { params });
	}

	getCalendarSummary(month: number, year: number, employeeId?: string, department?: string): Observable<CalendarCellDto[]> {
		let params: any = { month, year };
		if (employeeId) params.employeeId = employeeId;
		if (department) params.department = department;

		return this.http.get<CalendarCellDto[]>(`${this.baseUrl}/Outlays/calendar-summary`, { params });
	}

	getDaySummary(date: string, employeeId?: string, department?: string) {
		let params: any = { date };
		if (employeeId) params.employeeId = employeeId;
		if (department) params.department = department;

		return this.http.get<DaySummaryDto[]>(`${this.baseUrl}/Outlays/day-summary`, { params });
	}

	createOutlay(employeeId: string, outlay: OutlayInputDto): Observable<any> {
		return this.http.post<OutlayInputDto>(`${this.baseUrl}/Outlays/from-employee?employeeId=${employeeId}`, outlay)
	}

	getOutlaysByDate(date: string, department?: string): Observable<OutlayOutputDto[]> {
		const params: any = { date };
		if (department) params.department = department;

		return this.http.get<OutlayOutputDto[]>(`${this.baseUrl}/Outlays/by-date`, { params });
	}

}
