import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCalendar } from './widget-calendar';

describe('WidgetCalendar', () => {
	let component: WidgetCalendar;
	let fixture: ComponentFixture<WidgetCalendar>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WidgetCalendar],
		}).compileComponents();

		fixture = TestBed.createComponent(WidgetCalendar);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
