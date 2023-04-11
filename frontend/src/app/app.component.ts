import { Component } from '@angular/core';
import { CurrenciesService } from './graphql/currencies.service';
import { UserService } from './graphql/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  menuVisible = window.innerWidth > 600;

  user$ = this.userService.user$;
  userMainCurrency$ = this.userService.userMainCurrency$;

  constructor(
    private userService: UserService,
    private currenciesService: CurrenciesService
  ) {
    this.userService.load();
    this.currenciesService.load();

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.menuVisible = entry.contentRect.width > 600;
      });
    });
    observer.observe(document.body);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
