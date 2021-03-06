import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AssetCreateComponent } from './asset-create/asset-create.component';
import { AssetComponent } from './asset.component';
import { AssetEditComponent } from './asset-edit/asset-edit.component';

import { CustomDateRenderComponent } from './customDateRender.component';
import { CustomDateEditorComponent } from './customDateEditor.component';
import { AssetViewComponent } from './asset-view/asset-view.component';

const assetRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'assets',
		component: AssetComponent,
	},
	{
		path: 'assets/create',
		component: AssetCreateComponent,
	},
	{
		path: 'assets/:id',
		component: AssetViewComponent
	},
	{
		path: 'assets/edit/:id',
		component: AssetEditComponent
	}
]);

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
    	ReactiveFormsModule,
		assetRouting,
		Ng2SmartTableModule,
	],
	entryComponents: [
		CustomDateRenderComponent,
		CustomDateEditorComponent
	],
	declarations: [
		AssetComponent,
		AssetCreateComponent,
		AssetEditComponent,
		CustomDateRenderComponent,
		CustomDateEditorComponent,
		AssetViewComponent
	]
})

export class AssetsModule { }
