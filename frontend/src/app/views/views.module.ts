import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillsComponent } from './bills/bills.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SettingsComponent } from './settings/settings.component';
import { MaterialModule } from '../material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { AppCommonComponent } from './app-common/app-common.component';
import { AddBillComponent } from './dialogs/add-bill/add-bill.component';
import { AddTransactionComponent } from './dialogs/add-transaction/add-transaction.component';
import { UserAccountComponent } from './user-account/user-account.component';



@NgModule({
  declarations: [
    AppCommonComponent,
    BillsComponent,
    CurrenciesComponent,
    TransactionsComponent,
    SettingsComponent,
    AddBillComponent,
    AddTransactionComponent,
    UserAccountComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MaterialModule,
    BrowserModule, 
    FormsModule, 
    MatFormFieldModule,
    NgChartsModule,

    MatInputModule,
    MatFormFieldModule,
  ]
})
export class ViewsModule { }
