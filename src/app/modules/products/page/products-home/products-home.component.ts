import { ProductsService } from 'src/app/services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/models/interfaces/products/response/get-all-products-response';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventAction } from 'src/models/interfaces/products/event/event-action';
import { DeleteProductionAction } from 'src/models/interfaces/products/event/delete-product-action';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: [],
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  public productsData: GetAllProductsResponse[] = [];

  constructor(
    private productsService: ProductsService,
    private productsDTService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getServiceProductsData();
  }

  getServiceProductsData() {
    const productsLoaded = this.productsDTService.getProductsData();

    if (productsLoaded.length) {
      this.productsData = productsLoaded;
    } else this.getAPIProductsData();
  }

  getAPIProductsData() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.length) return;

          this.productsData = response;
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleProductAction(event: EventAction): void {
    console.log('Product Action:', event);
  }

  handleDeleteProductAction(event: DeleteProductionAction): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o produto ${event.name}?`,
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.deleteProduct(event.id),
    });
  }

  deleteProduct(id: string): void {
    this.productsService
      .deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto excluído com sucesso',
            life: 2500,
          });

          this.getAPIProductsData();
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir produto',
            life: 2500,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
