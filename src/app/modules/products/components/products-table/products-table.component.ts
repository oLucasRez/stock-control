import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductEvent } from 'src/models/enums/products/product-event';
import { DeleteProductionAction } from 'src/models/interfaces/products/event/delete-product-action';
import { EventAction } from 'src/models/interfaces/products/event/event-action';
import { GetAllProductsResponse } from 'src/models/interfaces/products/response/get-all-products-response';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: [],
})
export class ProductsTableComponent {
  @Input() products: GetAllProductsResponse[] = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() onDeleteProductButtonClick =
    new EventEmitter<DeleteProductionAction>();

  public selectedProducts!: GetAllProductsResponse[];
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  handleProductEvent(action: ProductEvent, id?: string): void {
    const productEventData = id ? { action, id } : { action };

    this.productEvent.emit(productEventData);
  }

  handleDeleteProduct(id: string, name: string): void {
    this.onDeleteProductButtonClick.emit({ id, name });
  }
}
