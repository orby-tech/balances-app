import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalancesComponent } from './balances/balances.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { MaterialModule } from '../material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartsModule } from 'ng2-charts';
import { AppCommonComponent } from './app-common/app-common.component';
import { AddBalanceComponent } from './dialogs/add-balance/add-balance.component';
import { AddTransactionComponent } from './dialogs/add-transaction/add-transaction.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { LoginComponent } from './dialogs/login/login.component';
import { ComponentsModule } from './user-account/components/components.module';
import { SignUpComponent } from './dialogs/sign-up/sign-up.component';
import { MatTreeModule } from '@angular/material/tree';
import { OrganizationPageComponent } from './organization-page/organization-page.component';
import { AddOrganizationComponent } from './dialogs/add-organization/add-organization.component';

@NgModule({
  declarations: [
    AppCommonComponent,
    BalancesComponent,
    CurrenciesComponent,
    TransactionsComponent,
    AddBalanceComponent,
    AddTransactionComponent,
    UserAccountComponent,
    LoginComponent,
    SignUpComponent,
    OrganizationPageComponent,
    AddOrganizationComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    MaterialModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    NgChartsModule,
    MatTreeModule,

    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class ViewsModule {}
