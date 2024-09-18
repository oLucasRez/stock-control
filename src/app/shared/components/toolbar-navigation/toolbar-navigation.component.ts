import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from 'src/app/modules/products/components/product-form/product-form.component';
import { ProductEvent } from 'src/models/enums/products/product-event';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: [],
})
export class ToolbarNavigationComponent {
  constructor(
    private cookie: CookieService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  handleLogout(): void {
    this.cookie.delete('token');
    void this.router.navigate(['/home']);
  }

  handleSaleProduct(): void {
    this.dialogService.open(ProductFormComponent, {
      header: ProductEvent.SALE_PRODUCT_EVENT,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: {
        event: { action: ProductEvent.SALE_PRODUCT_EVENT },
      },
    });
  }
}
