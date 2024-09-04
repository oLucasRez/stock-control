import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthRequest } from 'src/models/interfaces/user/auth/auth-request';
import { AuthResponse } from 'src/models/interfaces/user/auth/auth-response';
import { SignUpUserRequest } from 'src/models/interfaces/user/sign-up-user-request';
import { SignUpUserResponse } from 'src/models/interfaces/user/sign-up-user-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  signUpUser(requestData: SignUpUserRequest): Observable<SignUpUserResponse> {
    return this.http.post<SignUpUserResponse>(
      `${this.API_URL}/user`,
      requestData
    );
  }

  authUser(requestData: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestData);
  }
}
