import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeOutputDto } from '../models/employee-output';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class EmployeeService {

	private http = inject(HttpClient);
	private baseUrl = environment.apiUrl;

	getAll(): Observable<EmployeeOutputDto[]> {
		return this.http.get<EmployeeOutputDto[]>(`${this.baseUrl}/Employees`)
	}

}
