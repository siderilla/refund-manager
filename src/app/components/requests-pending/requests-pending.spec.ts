import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsPending } from './requests-pending';

describe('RequestsPending', () => {
	let component: RequestsPending;
	let fixture: ComponentFixture<RequestsPending>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RequestsPending],
		}).compileComponents();

		fixture = TestBed.createComponent(RequestsPending);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
