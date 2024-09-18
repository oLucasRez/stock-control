import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateProductRequest } from 'src/models/interfaces/products/request/create-product-request';
import { EditProductRequest } from 'src/models/interfaces/products/request/edit-product-request';
import { SaleProductRequest } from 'src/models/interfaces/products/request/sale-product-request';
import { CreateProductResponse } from 'src/models/interfaces/products/response/create-product-response';
import { DeleteProductResponse } from 'src/models/interfaces/products/response/delete-product-response';
import { GetAllProductsResponse } from 'src/models/interfaces/products/response/get-all-products-response';
import { SaleProductResponse } from 'src/models/interfaces/products/response/sale-product-response';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('token');
  private httpOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    },
  };

  constructor(private http: HttpClient, private cookie: CookieService) {}

  getAllProducts(): Observable<GetAllProductsResponse[]> {
    return this.http
      .get<GetAllProductsResponse[]>(
        `${this.API_URL}/products`,
        this.httpOptions
      )
      .pipe(
        map((allProducts) =>
          allProducts.filter((product) => product.amount > 0)
        )
      );
  }

  createProduct(
    request: CreateProductRequest
  ): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/product`,
      request,
      this.httpOptions
    );
  }

  editProduct(request: EditProductRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/product/edit`,
      request,
      this.httpOptions
    );
  }

  saleProduct(request: SaleProductRequest): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(
      `${this.API_URL}/product/sale`,
      { amount: request.amount },
      { ...this.httpOptions, params: { product_id: request.productID } }
    );
  }

  deleteProduct(id: string): Observable<DeleteProductResponse> {
    return this.http.delete<DeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions,
        params: { product_id: id },
      }
    );
  }
}
