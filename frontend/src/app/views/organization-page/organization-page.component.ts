import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { OrganizationsService } from 'src/app/graphql/organizations.service';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss'],
})
export class OrganizationPageComponent {
  organizationId$ = new BehaviorSubject<string | null>(null);

  organizations$ = this.organizationsService.organizations$;

  organization$ = combineLatest([
    this.organizationId$,
    this.organizations$,
  ]).pipe(
    map(([organizationId, organizations]) => {
      return organizations.find((o) => o.organization_id === organizationId);
    })
  );

  constructor(
    private organizationsService: OrganizationsService,
    private route: ActivatedRoute
  ) {
    this.organizationsService.load();
    this.route.params.subscribe((data) => {
      this.organizationId$.next(data['id']);
    });
  }
}
