import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class RefundService {

	private http = inject(HttpClient);
	private baseUrl = 'https://localhost:7258/api';

	processRefund(outlayId: string, isApproved: boolean): Observable<any> {
		return this.http.post(`${this.baseUrl}/Refunds/process`, null, {
			params: { outlayId, isApproved }
		})
	}

}
