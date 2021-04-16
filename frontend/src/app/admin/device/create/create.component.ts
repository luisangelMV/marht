import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { AdminService } from 'src/app/services';
import { ModalComponent } from 'src/app/shared/modal/modal.component';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})

export class CreateComponent implements OnInit {
  device: FormGroup;
  values: string;
  parrafoModal: string;

  @ViewChild('modal') private modalComponent: ModalComponent

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    config: NgbModalConfig
  ) { config.backdrop = 'static'; }

  ngOnInit(): void {

    this.initForm();
  }
  get f() { return this.device.controls; }
  get h() { return (this.device.controls['telemetry'] as FormGroup).controls; }
  get c() { return (this.device.controls['telemetry'] as FormGroup); }
  
  initForm() {
    this.device = this.fb.group({
      'microcontroller': ['', Validators.required],
      'versionSoftware': ['1.0', Validators.required],
      telemetry: this.fb.group({
        'method': [null, Validators.required]
      })
    });

  }
  change() {
    if (this.h.method.value === 'gprs') {
      this.c.addControl('gprsDevice', new FormControl('sim800', Validators.required));
      this.c.addControl('imei', new FormControl('', Validators.required));
    } else {
      this.c.removeControl('imei');
      this.c.removeControl('gprsDevice');
    }

  }
  onSubmit() {
    if (this.device.valid) {
      this.adminService.createDevice(this.device.value)
        .pipe(first())
        .subscribe(data => {
          this.parrafoModal = "Modelo de dispositivo:  " + data['idModel'];
          this.open();


        },
          error => {
            console.log(error);

          });
      this.values = this.device.value;
      console.log(this.values);
    }
    else {
      return this.mostrarErrores();
    }

  }

  mostrarErrores() {
    this.f.microcontroller.markAsDirty();
    this.f.versionSoftware.markAsDirty();
    this.h.method.markAsDirty();
    if (this.h.gprsDevice != undefined) {
      this.h.gprsDevice.markAsDirty();
    }
    if (this.h.imei != undefined) {
      this.h.imei.markAsDirty();
    }
  }

  async open() {
    await this.modalComponent.open()
  }
}
