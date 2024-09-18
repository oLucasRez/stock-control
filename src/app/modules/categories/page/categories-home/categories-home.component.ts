import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { DeleteCategoryAction } from 'src/models/interfaces/categories/event/delete-category-action';
import { GetAllCategoriesResponse } from 'src/models/interfaces/categories/response/get-all-categories-response';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: [],
})
export class CategoriesHomeComponent {
  private readonly destroy$ = new Subject<void>();

  public categoriesData: GetAllCategoriesResponse[] = [];

  public selectedCategories!: GetAllCategoriesResponse[];

  constructor(
    private categoriesService: CategoriesService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!response.length) return;

          this.categoriesData = response;
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao buscar categorias',
            life: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
      });
  }

  handleDeleteCategoryAction(event: DeleteCategoryAction) {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir a categoria ${event.categoryName}?`,
      header: 'Confirmação de exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.deleteCategory(event.categoryID);
      },
    });
  }

  deleteCategory(categoryID: string): void {
    this.categoriesService
      .deleteCategory(categoryID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getAllCategories();

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Categoria excluída com sucesso',
            life: 3000,
          });
        },
        error: (error) => {
          console.error(error);
          this.getAllCategories();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao excluir categoria',
            life: 3000,
          });
        },
      });

    this.getAllCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
