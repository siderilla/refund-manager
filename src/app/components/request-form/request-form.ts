import { Component, inject, input, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { OutlayService } from '../../services/outlay';
import { CategoryOutputDto } from '../../models/category-output';
import { CategoryService } from '../../services/category';
import { EmployeeOutputDto } from '../../models/employee-output';
import { OutlayInputDto } from '../../models/outlay-input';

@Component({
	selector: 'app-request-form',
	imports: [ReactiveFormsModule],
	templateUrl: './request-form.html',
	styleUrl: './request-form.scss',
})
export class RequestForm {

	private outlayService = inject(OutlayService); // per fare la post
	private categoryService = inject(CategoryService); // per chiamare le categorie
	private fb = inject(FormBuilder);

	categories = signal<CategoryOutputDto[]>([]);
	// outlay = signal<OutlayInputDto>();

	employee = input<EmployeeOutputDto>();

	outlayForm: FormGroup = this.fb.group({
		categoryId: new FormControl(null, [Validators.required]),
		amount: new FormControl('', [Validators.required, Validators.min(0.01)]),
		receipt: new FormControl(false, [Validators.required]),
		date: new FormControl('', [Validators.required]),
		description: new FormControl('')
	})

	ngOnInit() {
		this.categoryService.getCategories().subscribe({
			next: (data: any) => {
				const list = data;
				this.categories.set(list);
			},
			error: () => console.error('Errore nel caricamento categorie')
		});
	}

	onSubmit() {
		const newOutlay = this.outlayForm.value;
		const employee = this.employee();

		if (this.outlayForm.invalid || !employee) return;
		console.log("la form si riempie?", newOutlay);
		this.outlayService.createOutlay(employee!.id, newOutlay).subscribe({

			next: (data: any) => {
				console.log("Risposta dal server:", data);
				this.outlayForm.reset({ receipt: false });
			},

			error: () => {
				console.error("Qualcosa è andato storto");
			}
		})
	}

	onCancel() {
		this.outlayForm.reset();
	}

}
