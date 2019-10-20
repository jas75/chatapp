import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  declarations: [
  ],
  imports: [],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    RouterTestingModule
  ]
})
export class SharedModule { }
