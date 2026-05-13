import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBudgetstatus } from './widget-budgetstatus';

describe('WidgetBudgetstatus', () => {
	let component: WidgetBudgetstatus;
	let fixture: ComponentFixture<WidgetBudgetstatus>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WidgetBudgetstatus],
		}).compileComponents();

		fixture = TestBed.createComponent(WidgetBudgetstatus);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
