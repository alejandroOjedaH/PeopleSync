import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';


const material = [
  ButtonModule,
  InputTextModule,
  FormsModule,
  PasswordModule,
  TabMenuModule,
  TableModule,
  DialogModule,
  ToastModule,
  SidebarModule
];

@NgModule({
  declarations: [],
  imports: [
    ...material,
  ],
  exports: [
    ...material,
  ],
})
export class MaterialModule { }


