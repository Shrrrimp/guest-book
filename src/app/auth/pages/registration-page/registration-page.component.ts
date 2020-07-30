import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {

  public form: FormGroup;
  public imageName = null;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required)
    });
  }

  submit() {
    if (this.form.valid) {
    //   this.authService.logIn(this.login.value, this.password.value).subscribe((data) => {
    //     this.router.navigate(['/home']);

    //   }, (err) => {
    //     this.isDataInvalid = true;
    //     this.isEmailInvalid = false;
    //     this.isPasswordInvalid = false;
    //   });
    // } else {
    //   this.login.errors ? this.isEmailInvalid = true : this.isEmailInvalid = false;
    //   this.password.errors ? this.isPasswordInvalid = true : this.isPasswordInvalid = false;
    // }
    }
  }

  onFileSelected($event) {
    
  }

}
