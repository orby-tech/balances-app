import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';
import { CurrenciesService } from './graphql/currencies.service';
import { OrganizationsService } from './graphql/organizations.service';
import { UserService } from './graphql/user.service';

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
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

  constructor(
    private userService: UserService,
    private currenciesService: CurrenciesService,
    private organizationsService: OrganizationsService
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
                url: ['/common?organization_id=organization.organization_id'],
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

  logout() {
    localStorage.removeItem('token');
  }

  hasChild = (_: number, node: MenuFlatNode) => node.expandable;

  getUrl = (node: MenuNode) => node.url;
}
