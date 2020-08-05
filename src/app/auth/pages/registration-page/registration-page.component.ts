import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit {

  public form: FormGroup;
  public selectedFile: File = null;
  public imgUrl = 'assets/images/no_avatar.png';
  public errors = [];
  public isPasswordInvalid = false;
  public isEmailInvalid = false;
  public isNameInvalid = false;
  public isPasswordConfirmInvalid = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      login: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required)
    });

  }

  onFileSelected(event) {
    if (event.target.files) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.imgUrl = e.target.result;
      };
    }
  }

  deleteImg() {
    this.imgUrl = 'assets/images/no_avatar.png';
    this.selectedFile = null;
  }

  get login() { return this.form.get('login'); }

  get password() { return this.form.get('password'); }

  get name() { return this.form.get('name'); }

  get passwordConfirm() { return this.form.get('passwordConfirm'); }

  isPasswordConfirmed() {
    return this.password.value === this.passwordConfirm.value;
  }

  submit() {
    if (this.isPasswordConfirmed() && this.form.valid) {
      const fd = new FormData();
      fd.append('avatar', this.selectedFile, this.selectedFile.name);
      fd.append('email', this.login.value);
      fd.append('name', this.name.value);
      fd.append('password', this.password.value);
      fd.append('password_confirmation', this.passwordConfirm.value);

      this.authService.register(fd).subscribe((data) => {
        this.router.navigate(['/home']);
      }, (err) => {
        this.isEmailInvalid = false;
        this.isPasswordInvalid = false;
        this.isNameInvalid = false;
        this.isPasswordConfirmInvalid = false;
        this.errors = [];
        for (let key in err.error.errors) {
          this.errors.push(err.error.errors[key]);
        }
      });
    } else {
      this.login.errors ? this.isEmailInvalid = true : this.isEmailInvalid = false;
      this.password.errors ? this.isPasswordInvalid = true : this.isPasswordInvalid = false;
      this.name.errors ? this.isNameInvalid = true : this.isNameInvalid = false;
      this.isPasswordConfirmed() ? this.isPasswordConfirmInvalid = false : this.isPasswordConfirmInvalid = true;
    }

  }

}
