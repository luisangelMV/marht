import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MustMatch } from '../../validators';
import { first } from 'rxjs/operators';
import { NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {  Router } from '@angular/router';
import { AccountService } from 'src/app/services';
import { ModalComponent } from 'src/app/shared/modal/modal.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  providers: [AccountService],
})

export class RegisterComponent implements OnInit {

  register: FormGroup;
  siteKey: string;
  emailComp: string;
  tituloModal: string;
  parrafoModal: string;

  @ViewChild('modal') private modalComponent: ModalComponent

  constructor(
    private formBuilder: FormBuilder,
    private usersService: AccountService,
    private router: Router,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';

    this.siteKey = '6Ld5FVAaAAAAAM9POYFJTkzPeb56fvDltr8p--a-';
    this.emailComp = '';
    this.parrafoModal = 'revise su email para verificar su cuenta';
    this.tituloModal = 'Se ha registrado con éxito!';
  }

  ngOnInit() {
    this.initForm();
  }
  get f() { return this.register.controls; }

  onSubmit() {
    if (this.register.valid) {
      this.usersService.register(this.register.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.open();
          },
          error: error => {
            console.log(error);
            
            if (error === 'Email in use') {
              this.emailComp = this.f.email.value
              this.f.email.setErrors({ nounique: true })
              console.log(this.f.email.valid);
              
              return
            }
          }
        });
      return;
    }
    this.mostrarErrores();
  }

  initForm() {
    this.register = this.formBuilder.group({
      'name': ['', Validators.required],
      'lastName': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'company': ['', Validators.required],
      'state': [null, Validators.required],
      'phone': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'confirmPassword': ['', [Validators.required, Validators.minLength(6)]],
      'recaptcha': ['', Validators.required],
    },
      {
        validators: MustMatch('password', 'confirmPassword'),
        updateOn: 'blur'
      });
  }

  mostrarErrores() {
    this.register.controls.password.markAsDirty();
    this.register.controls.confirmPassword.markAsDirty();
    this.register.controls.name.markAsDirty();
    this.register.controls.lastName.markAsDirty();
    this.register.controls.email.markAsDirty();
    this.register.controls.state.markAsDirty();
    this.register.controls.phone.markAsDirty();
    this.register.controls.lastName.markAsDirty();
    this.register.controls.company.markAsDirty();
    this.register.controls.recaptcha.markAsDirty();
  }

  async open() {
    await this.modalComponent.open()
    if (this.modalComponent.close) {
      this.router.navigate(['accounts/login']);
    }
  }
}
