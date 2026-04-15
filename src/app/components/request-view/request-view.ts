import { Component, input } from '@angular/core';
import { View as ViewType } from '../../models/view';
import { RequestsList } from "../requests-list/requests-list";
import { RequestForm } from "../request-form/request-form";
import { RequestsSummary } from "../requests-summary/requests-summary";
import { RequestsPending } from '../requests-pending/requests-pending';
import { RequestsArchive } from '../requests-archive/requests-archive';
import { RequestsAnalytics } from '../requests-analytics/requests-analytics';

@Component({
	selector: 'app-request-view',
	imports: [
		RequestsList,
		RequestForm,
		RequestsSummary,
		RequestsPending,
		RequestsArchive,
		RequestsAnalytics
	],
	templateUrl: './request-view.html',
	styleUrl: './request-view.scss',
})
export class RequestView {

	activeView = input<ViewType>();

}
