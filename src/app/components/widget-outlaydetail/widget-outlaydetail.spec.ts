import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetOutlaydetail } from './widget-outlaydetail';

describe('WidgetOutlaydetail', () => {
	let component: WidgetOutlaydetail;
	let fixture: ComponentFixture<WidgetOutlaydetail>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WidgetOutlaydetail],
		}).compileComponents();

		fixture = TestBed.createComponent(WidgetOutlaydetail);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
