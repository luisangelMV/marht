import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from "../../services";
import { NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MustMatch } from "../../validators";
import { first } from 'rxjs/operators';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {
  resetPassword: FormGroup
  @ViewChild('modal') private modalComponent: ModalComponent

  token: any
  data1: any
  text: string
  title: string
  activateButton: boolean = false

  constructor(
    private formbuild: FormBuilder,
    private userService: AccountService,
    config: NgbModalConfig,
    private router: Router,
    private route: ActivatedRoute
  ) {
    config.centered = true
    config.backdrop = 'static'
    config.size = 'md'

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      this.data1 = params['email'] || null;
    })
    this.initForm()
  }
  get f() { return this.resetPassword.controls; }

  initForm() {
    this.resetPassword = this.formbuild.group({
      'password': ['', [Validators.required, Validators.minLength(6)]],
      'confirmPassword': ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: MustMatch('password', 'confirmPassword'),
      updateOn: 'blur'
    })
  }

  onSubmit() {
    this.activateButton = true

    this.userService.resetPassword(this.token, this.f.password.value, this.f.confirmPassword.value, this.data1)
      .pipe(first())
      .subscribe({
        next: () => {
          this.openModal1('se ha actualisado tu contraseña, por favor inicie sesión')
        },
        error: error => {
          if (error['message'] === 'invalid Token') {
            this.openModal('ha fallado el cambio de contraseña, por favor vuelva a la opcion de recuperar contraseña')
          }
          if (error['message'] === 'time Expired') {
            this.openModal('el tiempo de cambio de contraseña a expirado, por favor vuelva a la opcion de recuperar contraseña')

          }

          if (error['message'] === 'password Reset') {
            this.openModal1('se ha actualisado tu contraseña, por favor inicie sesión')
          }
        }
      })
  }

  async openModal(string) {
    this.text = string
    this.title = 'A ocurrido un problema'
    await this.modalComponent.open()
    if (this.modalComponent.close) {
      this.router.navigate(['/recover']);
    }
  }
  async openModal1(string) {
    this.text = string
    this.title = 'Contraseña actualizada con éxito!'
    await this.modalComponent.open()
    if (this.modalComponent.close) {
      this.router.navigate(['/login']);
    }
  }
}
