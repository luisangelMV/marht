import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { LayoutComponent } from './layout.component';


const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            {path: '', component: CreateComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeviceRoutingModule { }