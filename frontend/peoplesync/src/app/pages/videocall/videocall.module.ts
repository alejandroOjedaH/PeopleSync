import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideocallRoutingModule } from './videocall-routing.module';
import { VideocallComponent } from './videocall.component';
import { MaterialModule } from '../../material/material.module';



@NgModule({
  declarations: [
    VideocallComponent
  ],
  imports: [
    CommonModule,
    VideocallRoutingModule,
    MaterialModule,
  ]
})
export class VideocallModule { }
