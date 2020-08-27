import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public form: FormGroup;
  public isDataInvalid = false;
  public isEmailInvalid = false;
  public isPasswordInvalid = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  get login() { return this.form.get('login'); }

  get password() { return this.form.get('password'); }

  submit() {
    if (this.form.valid) {
      this.authService.logIn(this.login.value, this.password.value).subscribe((data) => {
        this.router.navigate(['/home']);

      }, (err) => {
        this.isDataInvalid = true;
        this.isEmailInvalid = false;
        this.isPasswordInvalid = false;
      });
    } else {
      this.isEmailInvalid = !!this.login.errors;
      this.isPasswordInvalid = !!this.password.errors;
    }
  }

}
