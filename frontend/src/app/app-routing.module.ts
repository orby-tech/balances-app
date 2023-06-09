import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppCommonComponent } from './views/app-common/app-common.component';
import { BalancesComponent } from './views/balances/balances.component';
import { CurrenciesComponent } from './views/currencies/currencies.component';
import { OrganizationPageComponent } from './views/organization-page/organization-page.component';
import { TransactionsComponent } from './views/transactions/transactions.component';
import { UserAccountComponent } from './views/user-account/user-account.component';
import { HomeComponent } from './views/home/home.component';

const routes: Routes = [
  {
    title: 'home',
    path: 'home',
    component: HomeComponent,
  },
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
    title: 'organization-page',
    path: 'organization-page/:id',
    component: OrganizationPageComponent,
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
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
