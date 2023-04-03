import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppCommonComponent } from './views/app-common/app-common.component';
import { BillsComponent } from './views/bills/bills.component';
import { CurrenciesComponent } from './views/currencies/currencies.component';
import { SettingsComponent } from './views/settings/settings.component';
import { TransactionsComponent } from './views/transactions/transactions.component';
import { UserAccountComponent } from './views/user-account/user-account.component';

const routes: Routes = [
  {
    title: 'user-account',
    path: 'user-account',
    component: UserAccountComponent,
  },
  {
    title: 'common',
    path: 'common',
    component: AppCommonComponent,
  },
  {
    title: 'bills',
    path: 'bills',
    component: BillsComponent,
  },
  {
    title: 'currencies',
    path: 'currencies',
    component: CurrenciesComponent,
  },
  {
    title: 'transactions',
    path: 'transactions',
    component: TransactionsComponent,
  },
  {
    title: 'settings',
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: '**',
    redirectTo: 'common',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
