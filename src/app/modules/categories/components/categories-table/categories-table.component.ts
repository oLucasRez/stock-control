import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryEvent } from 'src/models/enums/categories/category-event';
import { DeleteCategoryAction } from 'src/models/interfaces/categories/event/delete-category-action';
import { EditCategoryAction } from 'src/models/interfaces/categories/event/edit-category-action';
import { GetAllCategoriesResponse } from 'src/models/interfaces/categories/response/get-all-categories-response';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: [],
})
export class CategoriesTableComponent {
  @Input() public categories: GetAllCategoriesResponse[] = [];
  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>();
  @Output() public deleteCategory = new EventEmitter<DeleteCategoryAction>();

  public selectedCategories: GetAllCategoriesResponse[] = [];

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_EVENT;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_EVENT;

  handleCategoryEvent(
    event: CategoryEvent,
    id?: string,
    categoryName?: string
  ): void {
    this.categoryEvent.emit({ action: event, id, name: categoryName });
  }

  handleDeleteCategory(categoryID: string, name: string): void {
    this.deleteCategory.emit({ categoryID, categoryName: name });
  }
}
