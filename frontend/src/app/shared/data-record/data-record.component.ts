import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConsoleService } from 'src/app/services';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-data-record',
  templateUrl: './data-record.component.html',
  styleUrls: ['./data-record.component.sass']
})
export class DataRecordComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;

  dtOptions: any = {};
  devices: any = [];

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  today = this.calendar.getToday();
  model: NgbDateStruct;

  EditDevice: FormGroup;
  id = '';
  idModel = '';
  faCalendar = faCalendarAlt;
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private consoleService: ConsoleService,
    private Socket: SocketService,
    private route: ActivatedRoute,
    private calendar: NgbCalendar,
    private fb: FormBuilder,
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter
  ) {
    this.toDate = calendar.getToday();
  }

  onDateSelection(date: NgbDate) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });

    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  ngOnInit(): void {
    this.getdata();
    this.Socket.on(this.consoleService.account.id).subscribe(data => {
      console.log(data);
    });

    $.fn['dataTable'].ext.search.push((settings, data, dataIndex) => {
      const min = new Date(this.toModel(this.fromDate));
      const max = new Date(this.toModel(this.toDate));
      const date = new Date(data[2]);
      if (
        (min === null && max === null) ||
        (min === null && date <= max) ||
        (min <= date && max === null) ||
        (min <= date && date <= max)
      ) {
        return true;
      }
      return false;
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 25],
      processing: true,
      dom: 'Brtlip',
      "language": {
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "search": "Buscar:",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast": "Último",
          "sNext": "Siguiente",
          "sPrevious": "Anterior"
        },
        "sProcessing": "Procesando...",
      },
      buttons: [
        {
          extend: 'excel',
          text: '<img src="./assets/excel.svg" style="width:1.5em;">',
          titleAttr: 'Exportar a Excel',
          className: 'btn btn-success btn-sm'
        },
        {
          extend: 'print',
          text: `<img src="./assets/printer.svg" style="width:1.5em;">`,
          titleAttr: 'Imprimir',
          className: 'btn btn-info btn-sm'
        }
      ]
    };
  }

  getdata() {
    const val = this.route.snapshot.paramMap.get('id');
    this.consoleService.getDeviceInfo(val)
      .pipe(first())
      .subscribe({
        next: next => {
          this.devices = next;
          this.dtTrigger.next();
          console.log(this.devices);

        },
        error: () => {

        }
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    // $.fn['dataTable'].ext.search.pop();
  }

  openModal(targetModal: any, idModel: string, id: string, data?: any) {
    this.idModel = idModel;
    this.id = id;

    if (targetModal._declarationTContainer.localNames[0] == "contentEdit") {
      this.EditDevice = this.fb.group({
        idModel: [data.idModel, Validators.required],
        ubication: [data.Ubication || '', Validators.required],
        nameModule: [data.nameModule || '', Validators.required],
        telemetry: this.fb.group({
          userWifi: [data.telemetry.userWifi, Validators.required],
          passwordWifi: [data.telemetry.passwordWifi, Validators.required]
        })
      });
    }



    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  public toModel(date: NgbDateStruct): string | null {
    if (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) {
      return new Date(Date.UTC(date.year, date.month - 1, date.day)).toISOString();
    }

    return null;
  }
}

function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
