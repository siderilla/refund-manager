import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { View as ViewType } from '../../models/view';
import { RequestsList } from '../requests-list/requests-list';
import { RequestForm } from '../request-form/request-form';
import { RequestsSummary } from '../requests-summary/requests-summary';
import { EmployeeOutputDto } from '../../models/employee-output';

@Component({
	selector: 'app-request-view',
	imports: [RequestsList, RequestForm, RequestsSummary],
	templateUrl: './request-view.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './request-view.scss',
})
export class RequestView {
	activeView = input<ViewType>();
	employee = input<EmployeeOutputDto>();
	isHR = input<boolean | undefined>();
}
