import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CategoryEvent } from 'src/models/enums/categories/category-event';
import { EditCategoryAction } from 'src/models/interfaces/categories/event/edit-category-action';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: [],
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_EVENT;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_EVENT;

  public categoryAction!: { event: EditCategoryAction };
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.categoryAction = this.ref.data;

    if (
      this.categoryAction.event.action === this.editCategoryAction &&
      this.categoryAction.event.name
    )
      this.setCategoryName(this.categoryAction.event.name);
  }

  handleSubmitCategoryAction() {
    if (this.categoryAction.event.action === this.addCategoryAction)
      this.handleSubmitAddCategory();
    if (this.categoryAction.event.action === this.editCategoryAction)
      this.handleSubmitEditCategory();
  }

  handleSubmitAddCategory(): void {
    if (!this.categoryForm.valid) return;

    this.categoriesService
      .createNewCategory(this.categoryForm.value.name!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Categoria criada com sucesso',
            life: 3000,
          });
        },
        error: (error) => {
          console.error(error);
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao criar categoria',
            life: 3000,
          });
        },
      });
  }

  handleSubmitEditCategory(): void {
    if (!this.categoryForm.valid) return;

    this.categoriesService
      .editCategoryName(
        this.categoryAction.event.id!,
        this.categoryForm.value.name!
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Categoria editada com sucesso',
            life: 3000,
          });
        },
        error: (error) => {
          console.error(error);
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Erro ao editar categoria',
            life: 3000,
          });
        },
      });
  }

  setCategoryName(categoryName: string) {
    this.categoryForm.setValue({ name: categoryName });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
