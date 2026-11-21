import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmployeeOutputDto } from '../models/employee-output';

export interface LoginOutputDto {
	token: string;
	employee: EmployeeOutputDto;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {

	private http = inject(HttpClient);
	private baseUrl = environment.apiUrl;

	login(name: string, surname: string, password: string): Observable<LoginOutputDto> {
		return this.http.post<LoginOutputDto>(`${this.baseUrl}/Auth/login`, { name, surname, password });
	}

}
