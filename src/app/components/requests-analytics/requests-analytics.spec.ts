import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsAnalytics } from './requests-analytics';

describe('RequestsAnalytics', () => {
	let component: RequestsAnalytics;
	let fixture: ComponentFixture<RequestsAnalytics>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RequestsAnalytics],
		}).compileComponents();

		fixture = TestBed.createComponent(RequestsAnalytics);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
