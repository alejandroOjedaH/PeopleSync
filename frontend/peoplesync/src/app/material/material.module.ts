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
import { MenuComponent } from '../pages/menu/menu.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileUploadModule } from 'primeng/fileupload';


const material = [
  ButtonModule,
  InputTextModule,
  FormsModule,
  PasswordModule,
  TabMenuModule,
  TableModule,
  DialogModule,
  ToastModule,
  SidebarModule,
  FloatLabelModule,
  InputSwitchModule,
  FileUploadModule
];

@NgModule({
  declarations: [MenuComponent],
  imports: [
    ...material,
  ],
  exports: [
    ...material,
    MenuComponent
  ],
})
export class MaterialModule { }


