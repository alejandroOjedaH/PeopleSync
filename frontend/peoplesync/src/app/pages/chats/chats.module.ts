import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatsRoutingModule } from './chats-routing.module';
import { ChatsComponent } from './chats.component';
import { MaterialModule } from '../../material/material.module';
import { MenuComponent } from '../menu/menu.component';


@NgModule({
  declarations: [
    ChatsComponent,
    MenuComponent

  ],
  imports: [
    CommonModule,
    ChatsRoutingModule,
    MaterialModule,
  ]
})
export class ChatsModule { }
