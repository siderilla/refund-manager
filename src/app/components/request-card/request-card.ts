import { Component, input } from '@angular/core';
import { OutlayOutputDto } from '../../models/outlay-output';
import { View as ViewType } from '../../models/view';

@Component({
	selector: 'app-request-card',
	imports: [],
	templateUrl: './request-card.html',
	styleUrl: './request-card.scss',
})
export class RequestCard {

	outlay = input<OutlayOutputDto>();
	activeView = input<ViewType>();

	getStatusClass(): string {
		const status = this.outlay()?.status;
		if (!status) return '';

		switch (status) {
            case 'Approved': return 'status-approved';
            case 'Pending': return 'status-pending';
            case 'Rejected': return 'status-rejected';
            default: return '';
        }
	}
}
