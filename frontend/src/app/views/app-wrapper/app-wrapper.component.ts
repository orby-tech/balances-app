import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';
import { Router } from '@angular/router';
import { CurrenciesService } from 'src/app/graphql/currencies.service';
import { OrganizationsService } from 'src/app/graphql/organizations.service';
import { UserService } from 'src/app/graphql/user.service';
import { LoginComponent } from '../dialogs/login/login.component';
import { interval } from 'rxjs';
import { Subscription } from 'apollo-angular';

function parseJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

interface MenuNode {
  name: string;
  url: string | any[];
  children?: MenuNode[];
}

const DEFAULT_TREE_DATA: MenuNode[] = [
  {
    name: 'User account',
    url: '/user-account',
    children: [
      {
        name: 'Common',
        url: '/common',
      },
      {
        name: 'Balances',
        url: '/balances',
      },
      {
        name: 'Currencies',
        url: '/currencies',
      },
      {
        name: 'Transactions',
        url: '/transactions',
      },
    ],
  },
];

interface MenuFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  url: string | any[];
}

@Component({
  selector: 'app-app-wrapper',
  templateUrl: './app-wrapper.component.html',
  styleUrls: ['./app-wrapper.component.scss'],
})
export class AppWrapperComponent implements OnDestroy {
  title = 'frontend';
  menuVisible = window.innerWidth > 600;

  user$ = this.userService.user$;
  userMainCurrency$ = this.userService.userMainCurrency$;

  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      url: node.url,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<MenuFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  loginIntervalSubscription = interval(1000).subscribe(() => {
    this.validateToken();
  });

  constructor(
    private userService: UserService,
    private currenciesService: CurrenciesService,
    private organizationsService: OrganizationsService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.userService.load();
    this.currenciesService.load();
    this.organizationsService.load();
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.menuVisible = entry.contentRect.width > 600;
      });
    });
    observer.observe(document.body);
    this.organizationsService.organizations$.subscribe((organizations) => {
      this.dataSource.data = [
        ...DEFAULT_TREE_DATA,
        ...organizations.map((organization) => {
          return {
            name: organization.name,
            url: '/organization-page/' + organization.organization_id,
            children: [
              {
                name: 'Common',
                url: `/common/${organization.organization_id}`,
              },
              {
                name: 'Balances',
                url: `/balances/${organization.organization_id}`,
              },
              {
                name: 'Currencies',
                url: '/currencies/' + organization.organization_id,
              },
              {
                name: 'Transactions',
                url: '/transactions/' + organization.organization_id,
              },
            ],
          };
        }),
      ];
    });
  }

  validateToken(): void {
    const token = localStorage.getItem('token');
    const exp = token ? parseJwt(token)?.exp || 0 : 0;
    const expSeconds = exp * 1000 - Date.now();

    if (expSeconds < 0) {
      localStorage.setItem('lastUrl', this.router.url);
      this.router.navigate(['/home']);
      const dialogRef = this.dialog.open(LoginComponent, {
        data: {},
      });

      dialogRef.afterClosed().subscribe((result) => {
        // this.validateToken();
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  hasChild = (_: number, node: MenuFlatNode) => node.expandable;

  getUrl = (node: MenuNode) => node.url;

  ngOnDestroy(): void {
    this.loginIntervalSubscription.unsubscribe();
  }
}
