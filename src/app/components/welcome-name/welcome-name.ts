import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-welcome-name',
	imports: [],
	templateUrl: './welcome-name.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './welcome-name.scss',
})
export class WelcomeName {
	userName = input<string>();
}
