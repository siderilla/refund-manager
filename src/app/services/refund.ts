import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class RefundService {

	private http = inject(HttpClient);
	private baseUrl = environment.apiUrl;

	processRefund(outlayId: string, isApproved: boolean): Observable<any> {
		return this.http.post(`${this.baseUrl}/Refunds/process`, null, {
			params: { outlayId, isApproved }
		})
	}

}
