import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

// services
import { CategoryService } from '../../services/category.service';

// class
import { Category } from '../category';


@Component({
		selector: 'app-category-edit',
		templateUrl: '../category-form.component.html',
		styleUrls: ['../category-form.component.css']

})
export class CategoryEditComponent implements OnInit {

	category = new Category();
	categories: Category[];

	checklists = [
		{
			id: "monitor",
			name: "Monitor"
		},
		{
			id: "power_supply",
			name: "Power Supply"
		},
		{
			id: "pc",
			name: "Personal Computer"
		}
	]


	constructor(private route: ActivatedRoute, private router: Router, private categoryService: CategoryService) { }

	ngOnInit() {
		console.log(this.category);
		this.getCategory(this.route.snapshot.params['id']);
		this.getCategories();
	}

	onSubmit(form: NgForm) { 
		console.log("submit edit");

		let inputFields = form.value;
		let updateCategory = new Category();
		updateCategory = inputFields;
		
		this.categoryService.updateCategory(updateCategory)
			.then( category => {
				console.log(category);
				this.router.navigate(['/categories']);
			})
			.catch( e => {
				console.log(e);
			});
	}


	getCategory(id){
		this.categoryService.getCategory(id)
			.then( category => {
				console.log(category);
				this.category = category;
			})
			.catch( e => console.log(e));
	}

	getCategories() {
		this.categoryService.getCategories().subscribe(
			data => {
				console.log(data);
				this.categories = data;
			},
			err => {
				console.log('Error occured.');
			}
		);
	}
}
