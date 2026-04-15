import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsArchive } from './requests-archive';

describe('RequestsArchive', () => {
	let component: RequestsArchive;
	let fixture: ComponentFixture<RequestsArchive>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RequestsArchive],
		}).compileComponents();

		fixture = TestBed.createComponent(RequestsArchive);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
