import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ViewsModule } from './views/views.module';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { AppService } from './app.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    GraphQLModule,
    HttpClientModule,
    NgChartsModule,
    ViewsModule
  ],
  providers: [MaterialModule],
  bootstrap: [AppComponent, AppService],
})
export class AppModule {
  constructor(private appService: AppService) {}
}
