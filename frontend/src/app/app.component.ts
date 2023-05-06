import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  menuVisible = window.innerWidth > 600;

  constructor() {
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
