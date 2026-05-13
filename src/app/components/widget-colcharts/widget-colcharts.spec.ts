import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetColcharts } from './widget-colcharts';

describe('WidgetColcharts', () => {
	let component: WidgetColcharts;
	let fixture: ComponentFixture<WidgetColcharts>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WidgetColcharts],
		}).compileComponents();

		fixture = TestBed.createComponent(WidgetColcharts);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
