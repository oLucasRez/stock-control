import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetAllCategoriesResponse } from 'src/models/interfaces/categories/response/get-all-categories-response';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('token');
  private httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    },
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllCategories(): Observable<GetAllCategoriesResponse[]> {
    return this.http.get<GetAllCategoriesResponse[]>(
      `${this.API_URL}/categories`,
      this.httpOptions
    );
  }

  createNewCategory(
    categoryName: string
  ): Observable<GetAllCategoriesResponse[]> {
    return this.http.post<GetAllCategoriesResponse[]>(
      `${this.API_URL}/category`,
      { name: categoryName },
      this.httpOptions
    );
  }

  editCategoryName(categoryID: string, newName: string): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`,
      { name: newName },
      { ...this.httpOptions, params: { category_id: categoryID } }
    );
  }

  deleteCategory(categoryID: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/delete`, {
      ...this.httpOptions,
      params: { category_id: categoryID },
    });
  }
}
