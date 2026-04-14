import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrMenu } from './hr-menu';

describe('HrMenu', () => {
	let component: HrMenu;
	let fixture: ComponentFixture<HrMenu>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HrMenu],
		}).compileComponents();

		fixture = TestBed.createComponent(HrMenu);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
