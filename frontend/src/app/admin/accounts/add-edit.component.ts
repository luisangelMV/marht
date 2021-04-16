import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AdminService } from 'src/app/services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private adminService: AdminService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.initForm();

        if (!this.isAddMode) {
            this.adminService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createAccount();
        } else {
            this.updateAccount();
        }
    }

    private createAccount() {
        this.adminService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }

    private updateAccount() {
        this.adminService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.loading = false;
                }
            });
    }

    initForm() {
        this.form = this.formBuilder.group({
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
            updateOn: 'blur'
          });
      }
}