import { Component, Input } from '@angular/core';
import { GetAllCategoriesResponse } from 'src/models/interfaces/categories/response/get-all-categories-response';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: [],
})
export class CategoriesTableComponent {
  @Input() public categories: GetAllCategoriesResponse[] = [];

  public selectedCategories: GetAllCategoriesResponse[] = [];

  public editCategoryEvent = 'asd';

  handleCategoryEvent(event: any, id: string): void {
    console.log(event);
  }

  handleDeleteCategory(categoryId: string, name: string): void {
    console.log(categoryId);
  }
}
