import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryOutputDto } from '../models/category-output';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {

	private http = inject(HttpClient);
	private baseUrl = environment.apiUrl;

	getCategories(): Observable<CategoryOutputDto[]> {
		return this.http.get<CategoryOutputDto[]>(`${this.baseUrl}/Categories/with-budget`)
	}

}
