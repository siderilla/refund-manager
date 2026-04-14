import { Component } from '@angular/core';
import { EmployeeMenu } from "../employee-menu/employee-menu";
import { HrMenu } from "../hr-menu/hr-menu";

@Component({
	selector: 'app-sidebar',
	imports: [EmployeeMenu, HrMenu],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.scss',
})
export class Sidebar {}
