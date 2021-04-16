import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { AccountService } from "../../services";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})

export class LoginComponent implements OnInit {
  login: FormGroup;
  @ViewChild('modal') modalcomponent: ModalComponent

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    config: NgbModalConfig
  ) {
    config.centered = true
  }

  ngOnInit(): void {
    this.initForm();
  }
  get f() { return this.login.controls; }

  onSubmit() {
    if (this.login.valid) {
      this.accountService.login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/console';
            this.router.navigate([returnUrl])

          },
          error: error => {
            console.log(error);
            
            if (error === 'Email is incorrect') {
              this.f.email.setErrors({ noMatchEmail: true })
            }
            if (error === 'Password is incorrect') {
              this.f.password.setErrors({ passwordIncorrect: true })
            }
            if (error === 'no verified') {
              this.modalcomponent.open()
            }
          }
        })
    }
  }

  initForm() {
    this.login = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
    }, {
      updateOn: 'blur'
    });
  }
}
