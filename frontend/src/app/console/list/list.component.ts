import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { pipe } from 'rxjs';
import { first } from 'rxjs/operators';
import { Account } from 'src/app/models';
import { AccountService, ConsoleService } from 'src/app/services';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  createGroupForm: FormGroup;
  devices: any;

  constructor(
    private router: Router,
    private consoleService: ConsoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private Socket: SocketService
  ) {
  }

  ngOnInit(): void {
    this.getdata();
    this.Socket.on(this.consoleService.account.id).subscribe(data => {
      console.log(data);
      
    });
  }

  get f() { return this.createGroupForm.controls; }

  openModal(targetModal: string) {
    this.initForm();
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static'
    });
  }

  initForm() {
    this.createGroupForm = this.fb.group({
      nameModule: ['', Validators.required],
      ubication: ['', Validators.required],
      numberModule: ['', Validators.required],
      numberofDevice: [1, [Validators.required, Validators.min(1)]],
      nameWifi: ['', [Validators.required]],
      passwordWifi: ['', [Validators.required]]
    }, {
      updateOn: 'blur'
    });
  }

  onSubmit() {
    if (this.createGroupForm.valid) {
      this.consoleService.createGroup({ id: this.consoleService.account.id, groups: this.createGroupForm.value })
        .pipe(first())
        .subscribe({
          next: next => {
            this.modalService.dismissAll();

          },
          error: error => {
            console.log(error);

          }
        });
    }
  }

  getdata() {
    this.consoleService.getAll()
      .pipe()
      .subscribe({
        next: next => {
          console.log(next)
        },
        error: error => {
          console.log(error);

        }
      })
  }
}
