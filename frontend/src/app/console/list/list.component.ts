import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faExclamationTriangle, faFileAlt, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ConsoleService, SpinnerService } from 'src/app/services';
import { SocketService } from 'src/app/services/socket/socket.service';
import { Device } from "../../models/index";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  addDevice: FormGroup;
  EditDevice: FormGroup;
  message = '';
  valid = false;

  faAlert = faExclamationTriangle;
  faFile = faFileAlt;
  faDelete = faTrash;
  faPencil = faPen;
  devices: any = [];
  id = '';
  idModel = '';
  loadingIndicator = true;

  constructor(
    private router: Router,
    private consoleService: ConsoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private spinnerService: SpinnerService,
    private Socket: SocketService
  ) {

  }

  ngOnInit(): void {
    this.getdata();
    this.Socket.on(this.consoleService.account.id).subscribe(data => {
      console.log(data);

    });
  }

  getdata() {
    this.consoleService.getDevices()
      .pipe()
      .subscribe({
        next: next => {
          this.devices = next;
          console.log(this.devices);

        },
        error: error => {
          console.log(error);

        }
      });
  }

  openRegistro(value) {
    this.router.navigate([`console/record`, value]);
  }

  openModal(targetModal: any, idModel: string, id: string, data?: any) {
    this.idModel = idModel;
    this.id = id;
    if (targetModal._declarationTContainer.localNames[0] == "addDeviceModal") {
      this.addDevice = this.fb.group({
        idModel: ['', Validators.required]
      });
    }

    if (targetModal._declarationTContainer.localNames[0] == "contentEdit") {
      this.EditDevice = this.fb.group({
        idModel: [data.idModel, Validators.required],
        ubication: [data.Ubication || '', Validators.required],
        nameModule: [data.nameModule || '', Validators.required]
      });
    }



    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  deleteDevice(id: string) {
    this.consoleService.deleteDevice(id)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getdata();
          this.modalService.dismissAll();
        },
        error: error => {
          console.log(error);
        }
      });
  }

  onSubmitEdit() {
    this.consoleService.updateDevice(this.EditDevice.value)
    .pipe(first())
    .subscribe({
      next: next => {
        console.log(next);
        
      },
      error: error => {
        console.log(error);
        
      }
    })
  }

  onSubmit() {
    this.message = '';
    this.spinnerService.callSpinner();
    const idModel = this.addDevice.controls.idModel.value;
    const id = this.consoleService.account.id;

    this.consoleService.addDevice({ idModel, id })
      .pipe(first())
      .subscribe({
        next: () => {
          this.valid = true;
          this.message = 'Se ha asociado el dispositivo con exito!';
          this.getdata();
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
