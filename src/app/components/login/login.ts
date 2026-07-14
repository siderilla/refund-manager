import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	imports: [ReactiveFormsModule],
	templateUrl: './login.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './login.scss',
})
export class Login {
	submitData = output<{ name: string; surname: string }>();

	loginForm = new FormGroup({
		name: new FormControl('', [Validators.required]),
		surname: new FormControl('', [Validators.required]),
	});

	onSubmitAuth() {
		if (this.loginForm.invalid) return;

		const name = this.loginForm.value.name!;
		const surname = this.loginForm.value.surname!;

		this.submitData.emit({ name, surname });
	}
}
