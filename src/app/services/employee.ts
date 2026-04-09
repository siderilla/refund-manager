import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeOutputDto } from '../models/employee';

@Injectable({
	providedIn: 'root',
})
export class Employee {

	private http = inject(HttpClient);
	private baseUrl = 'https://localhost:7258/api';

	getAll(): Observable<EmployeeOutputDto[]> {
		return this.http.get<EmployeeOutputDto[]>(`${this.baseUrl}/Employees`)
	}

	getEmployeeByName(name: string, surname: string): Observable<EmployeeOutputDto> {
		return this.http.get<EmployeeOutputDto>(`${this.baseUrl}/Employees/by-name?name=${name}&surname=${surname}`)
	}

}
