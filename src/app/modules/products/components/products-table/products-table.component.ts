import { Component, Input } from '@angular/core';
import { GetAllProductsResponse } from 'src/models/interfaces/products/response/get-all-products-response';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: [],
})
export class ProductsTableComponent {
  @Input() products: GetAllProductsResponse[] = [];

  public selectedProducts!: GetAllProductsResponse[];
}
