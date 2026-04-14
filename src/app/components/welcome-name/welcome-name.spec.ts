import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeName } from './welcome-name';

describe('WelcomeName', () => {
	let component: WelcomeName;
	let fixture: ComponentFixture<WelcomeName>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WelcomeName],
		}).compileComponents();

		fixture = TestBed.createComponent(WelcomeName);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
