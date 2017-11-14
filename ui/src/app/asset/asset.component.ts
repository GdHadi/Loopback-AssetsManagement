import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { ServerDataSource } from 'ng2-smart-table';
import * as moment from 'moment';

// environment
import { environment } from '../../environments/environment';


// services
import { DataService } from '../services/data.services';

// module
import { Asset } from './asset';
import { CustomDateRenderComponent } from './customDateRender.component';
import { CustomDateEditorComponent } from './customDateEditor.component';

@Component({
	selector: 'app-asset',
	templateUrl: './asset.component.html',
	styleUrls: ['./asset.component.css'],
})

export class AssetComponent implements OnInit {

	settings = {
		add: {
			confirmCreate: true,
			addButtonContent: 'Add',
		},
		edit: {
			confirmSave: true,
		},
		delete: {
			confirmDelete: true,
		},
		columns: {
				model: {
					title: 'Model',
					editable: true,
					addable: true,
					filter: false,
				},
				serial: {
					title: 'Serial Nr.',
					filter: false,
				},
				batchNo: {
					title: 'Batch Nr.',
					filter: false,
				},
				createDate: {
					title: 'Date of Creation',
					editable: false,
					addable: false,
					type: 'custom',
					renderComponent: CustomDateRenderComponent,
					filter: false,
				},
				productionDate: {
					title: 'Date of Production',
					type: 'custom',
					renderComponent: CustomDateRenderComponent,
					editor: {
						type: 'custom',
						component: CustomDateEditorComponent,
					},
					filter: false,
				},
				description: {
					title: 'Description',
					filter: false,
				},
		},
	};


	title = 'Asset Management Application';
	source: ServerDataSource;
	assets: Asset[];
	errorMessage: any;

	selected = [];
	selectAll = false;

	constructor( http: Http, protected dataService: DataService ) {
		console.log('AssetComponent const called...');
		this.source = new ServerDataSource(http, { endPoint: `${environment.apiUrl}/assets/asset_paging`});
		this.source.setPaging(1, 10, true);
	}

	onCreateCall(event) {
		try {
			console.log('Create triggered.');
			this.dataService.createAsset(event.newData);
			event.confirm.resolve(event.newData);
		} catch (e) {
			console.log((<Error>e).message);
			event.confirm.reject();
		}
	}

	onEditCall(event) {
		try {
			console.log(`Edit triggered on: ${event.data.id}`);
			this.dataService.updateAsset(event.newData);
			event.confirm.resolve(event.newData);
		} catch (e) {
			console.log((<Error>e).message);
			event.confirm.reject();
		}
	}

	onPostCall(event) {
		try {
		console.log(`Post triggered on: ${event.data.id}`);
		event.confirm.resolve(event.newData);
		this.dataService.createAsset(event.newData);
		} catch (e) {
			console.log((<Error>e).message);
			event.confirm.reject();
		}
	}

	onDeleteCall(event) {
		try {
			console.log(`Delete triggered on: ${event.data.id}...`);
			this.dataService.deleteAsset(event.data);
			event.confirm.resolve(event.data);
		} catch (e) {
			console.log((<Error>e).message);
			event.confirm.reject();
		}
	}


	loadAssets() {
		this.dataService.getAssets('desc').subscribe(
			data => {
				console.log(data);
				this.assets = data;
			},
			err => {
				console.log('Error occured.');
			}
		);
	}

	dateFormat(dateString, type = 'date') {
		const date = new Date(dateString);
		const momentDate = moment(date, 'DD/MM/YYYY');
		if (type === 'datetime') {
			return momentDate.format('DD/MM/YYYY HH:mm:ss');
		} else {
			return momentDate.format('DD/MM/YYYY');
		}
	}

	deleteAsset(asset) {
		if (confirm('Are you sure want to delete ' + asset.model)) {
			this.dataService.deleteAsset(asset)
			.then( res => {
				console.log('deleted');
				this.loadAssets();
			})
			.catch( err => console.log(err));
		}
	}

	exist(asset){
		return this.selected.indexOf(asset) > -1;
	}

	toggleSelection(asset){
		
		var idx = this.selected.indexOf(asset);
		console.log(idx);
		if (idx > -1){
			this.selected.splice(idx,1);
		}else{
			this.selected.push(asset);
		}
		console.log(this.selected);
		console.log("total asset: " + this.assets.length);
		console.log("total selected: " + this.selected.length);

		if (this.selected.length >= this.assets.length){
			this.selectAll = true;
		}else{
			this.selectAll = false;
		}
	}

	checkAll(){
		console.log('select all assets...' + this.selectAll);
		if (this.selectAll){
			console.log("checkall checked");
			var tempSelected = [];
			
			for(var i = 0; i < this.assets.length; i++) {
				tempSelected.push(this.assets[i]);
			}

			this.selected = tempSelected;
		}else{
			this.selected = [];
		}

		console.log(this.selected);
	}

	deleteMultiple(){
		console.log("delete multiple");
		console.log("selected asset: " + this.selected.length);

		if (this.selected.length < 1){
			alert("Please select asset that you wan to delete");
		}else{
			if (confirm('Are you sure want to delete all selected assets? ')) {

				//======= Call the service method ==========
				this.dataService.deleteMultipleAssets(this.selected)
					.then( res => {
						console.log("total rows deleted: " + res.count);
						this.loadAssets();
					})	
			}
		}
	}

	ngOnInit() {
		console.log('ngOnInit called...');
		this.loadAssets();
	}
}
