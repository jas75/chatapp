import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  declarations: [
  ],
  imports: [],
  exports: [HttpClientModule, ReactiveFormsModule, RouterTestingModule],
})
export class SharedModule { }