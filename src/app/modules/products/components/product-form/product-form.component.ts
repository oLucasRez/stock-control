import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllCategoriesResponse } from 'src/models/interfaces/categories/response/get-all-categories-response';
import { CreateProductRequest } from 'src/models/interfaces/products/request/create-product-request';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  public categories: GetAllCategoriesResponse[] = [];
  public selectedCategory: { name: string; code: string }[] = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.length) return;

          this.categories = response;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
