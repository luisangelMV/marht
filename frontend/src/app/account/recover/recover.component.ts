import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AccountService } from "../../services";

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.sass']
})
export class RecoverComponent implements OnInit {
  recover: FormGroup
  @ViewChild('modal') private modalComponent: ModalComponent
  activateButton: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private usersService: AccountService,
    config: NgbModalConfig,
    private router: Router
  ) {
    config.centered = true
    config.backdrop = 'static'
    config.size = 'md'
  }



  ngOnInit(): void {
    this.initForm()
  }

  get f() { return this.recover.controls; }

  async openModal() {
    await this.modalComponent.open()
  }

  initForm() {
    this.recover = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]]
    }, {
      updateOn: 'blur'
    })
  }

  redirect() {
    this.router.navigate(['/account/login']);
  }

  async onSubmit() {
    this.activateButton = true
    this.usersService.forgotPassword(this.f.email.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.openModal()

        },
        error: error => {
          if (error['message'] === 'not email found') {
            this.f.email.setErrors({ noMatchEmail: true })
          }
        }
      });
  }
}
