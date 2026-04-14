import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMenu } from './employee-menu';

describe('EmployeeMenu', () => {
	let component: EmployeeMenu;
	let fixture: ComponentFixture<EmployeeMenu>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EmployeeMenu],
		}).compileComponents();

		fixture = TestBed.createComponent(EmployeeMenu);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
