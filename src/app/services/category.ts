import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryOutputDto } from '../models/category-output';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {

	private http = inject(HttpClient);
	private baseUrl = 'https://localhost:7258/api';

	getCategories(): Observable<CategoryOutputDto[]> {
		return this.http.get<CategoryOutputDto[]>(`${this.baseUrl}/Categories/with-budget`)
	}

}
