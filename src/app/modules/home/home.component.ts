import { CookieService } from 'ngx-cookie-service';
import { UserService } from './../../services/user/user.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthRequest } from 'src/models/interfaces/user/auth/auth-request';
import { SignUpUserRequest } from 'src/models/interfaces/user/sign-up-user-request';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  signUpForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) {}

  onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).subscribe({
        next: (response) => {
          if (response) {
            this.cookieService.set('token', response.token);

            this.loginForm.reset();
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService
        .signUpUser(this.signUpForm.value as SignUpUserRequest)
        .subscribe({
          next: (response) => {
            if (response) alert('Usuário cadastrado com sucesso!');
            this.signUpForm.reset();
            this.loginCard = true;
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }
}
