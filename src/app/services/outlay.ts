import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OutlayDto } from '../models/outlay';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class Outlay {

	private http = inject(HttpClient);
	private baseUrl = 'https://localhost:7258/api';

	getOutlaysByStatus(outlay: OutlayDto): Observable<any> {
		return this.http.post(`${this.baseUrl}/Outlays/by-status`, outlay);
	}
}
