import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AccountService } from "../../services";
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.sass']
})
export class EmailVerifyComponent implements OnInit {
  mensajeConfirmacion: string
  textButton: string
  route: string
  token: any
  email: string

  constructor(
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(params => {
      this.token = params['token'] || null;
      this.email = params['email'] || null;
    });
    this.router.navigate([], { relativeTo: this.activatedRouter, replaceUrl: true });

    this.accountService.verifyEmail(this.token, this.email)
      .pipe(first())
      .subscribe({
        next: () => {
          this.mensajeConfirmacion = "se ha confirmado su correo, ya puede iniciar sesion";
          this.textButton = 'Iniciar sesión';
          this.route = 'login';
        },
        error: error => {
          if (error === 'verification failed') {
            this.mensajeConfirmacion = "se ha producido un error al confirmar el correo, \n\rpor favor pongase en contacto al correo marht.info@gmail.com";
            this.textButton = 'Regresar a página principal';
            this.route = 'index';
          }
          if (error === 'is verified') {
            this.mensajeConfirmacion = "se ha confirmado su correo, ya puede iniciar sesion";
            this.textButton = 'Iniciar sesión';
            this.route = 'login';
          }
        }

      });

  }
  onSubmit() {
    this.router.navigate([this.route]);
  }
}
