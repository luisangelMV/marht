import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFileAlt, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DeviceService } from 'src/app/services';
import { RefreshService } from 'src/app/services/refresh/refresh.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.sass']
})
export class RecordComponent implements OnInit {

  devices: any = [];
  columns = [
    { name: 'Modelo', prop: 'idModel' },
    { name: 'Telemetria', prop: 'telemetry.method' },
    { name: 'Fecha de registro', prop: "creationDate" }
  ];

  private subscription: Subscription;
  loadingIndicator = true;
  empty = true;
  ColumnMode = ColumnMode;
  faDelete = faTrash;
  faPencil = faPen;
  faFile = faFileAlt;
  temp = [];
  rows = [];
  id = '';
  idModel = '';
  my_messages = {emptyMessage: 'no se han encontrado dispositivos asosiados', totalMessage: 'total'}


  constructor(
    private deviceService: DeviceService,
    private refreshService: RefreshService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.subscription = this.refreshService.getUpdate()
      .subscribe(
        message => {
          if (message.text === 'refresh') {
            this.getdevices();
          }
        }
      )
  }

  ngOnInit(): void {
    this.getdevices();
  }
  getdevices() {
    this.deviceService.getDevice()
      .pipe(first())
      .subscribe({
        next: next => {
          this.loadingIndicator = false;
          this.devices = next;
          if (this.devices === 0) {
            this.empty = true;
          }
          else {
            this.empty = false;
          }
        },
        error: () => {

        }
      });
  }

  openModal(targetModal: string, idModel: string, id: string){
    this.idModel = idModel;
    this.id = id;
    this.modalService.open(targetModal, {
      centered: true,
      size: 'sm',
      backdrop: 'static'
    });
  }
  onSubmit(){
    
  }


  deleteDevice(id: string){
    this.deviceService.deleteDevice(id)
    .pipe(first())
    .subscribe({
      next: () => {
        this.getdevices();
        this.modalService.dismissAll();
      },
      error: error => {
        console.log(error);
      }
    }); 
  }

  openRegistro(value){
    this.router.navigate([`console/record/${value}`]);
    
    
  }
}
