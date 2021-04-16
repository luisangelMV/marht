import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddDeviceComponent } from "./add-device/add-device.component";
import { ConsoleComponent } from "./console.component";
import { RecordComponent } from "./record/record.component";

const routes: Routes = [
    { path: '', component: ConsoleComponent },
    { path: 'add-device', component: AddDeviceComponent },
    { path: 'record/:id', component: RecordComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConsoleRoutingModule { }