import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/models/interfaces/products/response/get-all-products-response';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public productsList: GetAllProductsResponse[] = [];

  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private productsDTService: ProductsDataTransferService
  ) {}

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length === 0) return;

          this.productsList = response;
          this.productsDTService.setProductsData(this.productsList);
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos!',
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
