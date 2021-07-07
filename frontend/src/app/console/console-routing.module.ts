import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DataRecordComponent } from "../shared/data-record/data-record.component";
import { AddDeviceComponent } from "./add-device/add-device.component";
import { ConsoleComponent } from "./console.component";

const routes: Routes = [
    { path: '', component: ConsoleComponent },
    { path: 'add-device', component: AddDeviceComponent },
    { path: 'record/:id', component: DataRecordComponent },
    { path: ''}

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsoleRoutingModule { }