import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsDataTransferService } from 'src/app/services/products/products-data-transfer.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductEvent } from 'src/models/enums/products/product-event';
import { GetAllCategoriesResponse } from 'src/models/interfaces/categories/response/get-all-categories-response';
import { EventAction } from 'src/models/interfaces/products/event/event-action';
import { CreateProductRequest } from 'src/models/interfaces/products/request/create-product-request';
import { EditProductRequest } from 'src/models/interfaces/products/request/edit-product-request';
import { SaleProductRequest } from 'src/models/interfaces/products/request/sale-product-request';
import { GetAllProductsResponse } from 'src/models/interfaces/products/response/get-all-products-response';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  public categories: GetAllCategoriesResponse[] = [];
  public selectedCategory: { name: string; code: string }[] = [];

  public productAction!: {
    event: EventAction;
    productsData: GetAllProductsResponse[];
  };
  public productSelectedData!: GetAllProductsResponse;
  public productsData: GetAllProductsResponse[] = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });
  public saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  });
  public saleSelectedProduct!: GetAllProductsResponse;
  public renderDropdown = false;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private productDTService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.productAction = this.ref.data;

    if (this.productAction.event.action === this.saleProductAction)
      this.getProductsData();

    this.getAllCategories();
    this.renderDropdown = true;
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.length) return;

          this.categories = response;

          if (
            this.productAction.event.action === this.editProductAction &&
            this.productAction.productsData.length
          )
            this.getProductSelectedData(this.productAction.event.id!);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
  }

  handleSubmitAddProduct() {
    if (!this.addProductForm.valid) return;

    const request: CreateProductRequest = {
      name: this.addProductForm.value.name!,
      price: this.addProductForm.value.price!,
      description: this.addProductForm.value.description!,
      category_id: this.addProductForm.value.category_id!,
      amount: this.addProductForm.value.amount!,
    };

    this.productsService
      .createProduct(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Produto criado com sucesso!',
            life: 2500,
          });
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao criar produto!',
            life: 2500,
          });
        },
      });

    this.addProductForm.reset();
  }

  handleSubmitEditProduct() {
    if (!this.editProductForm.valid || !this.productAction.event.id) return;

    const request: EditProductRequest = {
      product_id: this.productAction.event.id,
      name: this.editProductForm.value.name!,
      price: this.editProductForm.value.price!,
      description: this.editProductForm.value.description!,
      amount: this.editProductForm.value.amount!,
      category_id: this.editProductForm.value.category_id!,
    };

    this.productsService
      .editProduct(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Produto editado com sucesso!',
            life: 2500,
          });
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao editar produto!',
            life: 2500,
          });
        },
      });
    this.editProductForm.reset();
  }

  handleSubmitSaleProduct() {
    if (!this.saleProductForm.valid) return;

    const request: SaleProductRequest = {
      productID: this.saleProductForm.value.product_id!,
      amount: this.saleProductForm.value.amount!,
    };

    this.productsService
      .saleProduct(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Produto vendido com sucesso!',
            life: 3000,
          });
          this.saleProductForm.reset();
          this.getProductsData();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error(error);
          this.saleProductForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao vender produto!',
            life: 3000,
          });
        },
      });

    this.saleProductForm.reset();
  }

  getProductSelectedData(productID: string) {
    const allProducts = this.productAction.productsData;

    if (!allProducts.length) return;

    const productFiltered = allProducts.filter(
      (product) => product.id === productID
    );

    if (!productFiltered.length) return;

    this.productSelectedData = productFiltered[0];

    this.editProductForm.setValue({
      name: this.productSelectedData.name,
      price: this.productSelectedData.price,
      amount: this.productSelectedData.amount,
      description: this.productSelectedData.description,
      category_id: this.productSelectedData.category.id,
    });
  }

  getProductsData() {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.length) return;

          this.productsData = response;
          this.productDTService.setProductsData(this.productsData);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
