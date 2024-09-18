import { CategoryEvent } from 'src/models/enums/categories/category-event';

export interface EditCategoryAction {
  action: CategoryEvent;
  id?: string;
  name?: string;
}
