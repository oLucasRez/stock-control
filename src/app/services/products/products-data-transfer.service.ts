import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/models/interfaces/products/response/get-all-products-response';

@Injectable({
  providedIn: 'root',
})
export class ProductsDataTransferService {
  public productsDataEmitter$ = new BehaviorSubject<GetAllProductsResponse[]>(
    []
  );
  public productsData: GetAllProductsResponse[] = [];

  constructor() {}

  setProductsData(productsData: GetAllProductsResponse[]): void {
    this.productsDataEmitter$.next(productsData);
    this.getProductsData();
  }

  getProductsData() {
    this.productsDataEmitter$
      .pipe(
        take(1),
        map((data) => data.filter((product) => product.amount > 0))
      )
      .subscribe({
        next: (response) => {
          this.productsData = response;
        },
      });

    return this.productsData;
  }
}
