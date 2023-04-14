import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppCommonComponent } from './views/app-common/app-common.component';
import { BalancesComponent } from './views/balances/balances.component';
import { CurrenciesComponent } from './views/currencies/currencies.component';
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
    title: 'common',
    path: 'common/:id',
    component: AppCommonComponent,
  },
  {
    title: 'balances',
    path: 'balances',
    component: BalancesComponent,
  },
  {
    title: 'balances',
    path: 'balances/:id',
    component: BalancesComponent,
  },
  {
    title: 'currencies',
    path: 'currencies',
    component: CurrenciesComponent,
  },
  {
    title: 'currencies',
    path: 'currencies/:id',
    component: CurrenciesComponent,
  },
  {
    title: 'transactions',
    path: 'transactions',
    component: TransactionsComponent,
  },
  {
    title: 'transactions',
    path: 'transactions/:id',
    component: TransactionsComponent,
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
