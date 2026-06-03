import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCharts } from './widget-charts';

describe('WidgetCharts', () => {
	let component: WidgetCharts;
	let fixture: ComponentFixture<WidgetCharts>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WidgetCharts],
		}).compileComponents();

		fixture = TestBed.createComponent(WidgetCharts);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
