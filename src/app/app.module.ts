import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

import { AppComponent } from './app.component';
import { AsyncAwareButton } from './async-aware-button';
import {SearchService} from './search.service';


@NgModule({
  declarations: [
    AppComponent,
    AsyncAwareButton
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, 
    ReactiveFormsModule, 
    NgbModule.forRoot(),

  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
