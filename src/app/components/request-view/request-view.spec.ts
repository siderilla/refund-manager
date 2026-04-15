import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestView } from './request-view';

describe('View', () => {
	let component: RequestView;
	let fixture: ComponentFixture<View>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RequestView],
		}).compileComponents();

		fixture = TestBed.createComponent(RequestView);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
