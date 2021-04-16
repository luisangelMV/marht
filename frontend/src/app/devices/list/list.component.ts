import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { first } from 'rxjs/operators';
import { Account } from 'src/app/models';
import { AccountService, SpinnerService } from 'src/app/services';
import { DeviceService } from 'src/app/services/device/device.service';
import { RefreshService } from 'src/app/services/refresh/refresh.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  addDevice: FormGroup;
  faAlert = faExclamationTriangle;

  message = '';
  valid = false;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private spinnerService: SpinnerService,
    private refreshService: RefreshService
  ) {
  }

  ngOnInit() {
    this.addDevice = this.fb.group({
      idModel: ['', Validators.required]
    });
  }

  openModal(targetModal: string) {
    this.message = '';
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  onSubmit() {
    this.message = '';
    this.spinnerService.callSpinner();
    const idModel = this.addDevice.controls.idModel.value;
    const id = this.deviceService.account.id;

    this.deviceService.addDevice({ idModel, id })
      .pipe(first())
      .subscribe({
        next: () => {
          this.valid = true;
          this.message = 'Se ha asociado el dispositivo con exito!';
          this.refreshService.sendUpdate('refresh');
        },
        error: error => {
          this.valid = false;
          if (error === 'not found device') {
            this.message = 'Dispositivo no encontrado';
          }
          if (error === 'this device is already assosiate') {
            this.message = 'El dispositivo ya esta asociado a una cuenta';
          }
          if (error === 'this device is already associated to your account') {
            this.message = 'El dispositivo ya esta asociado a su cuenta';
          }
        }
      });
  }
}
