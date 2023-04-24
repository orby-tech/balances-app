import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RoleOrganisationType } from '@common/graphql';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { OrganizationsService } from 'src/app/graphql/organizations.service';
import { AddUserToOrganizationComponent } from '../dialogs/add-user-to-organization/add-user-to-organization.component';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss'],
})
export class OrganizationPageComponent {
  RoleOrganisationType = RoleOrganisationType
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
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.organizationsService.load();
    this.route.params.subscribe((data) => {
      this.organizationId$.next(data['id']);
    });
  }

  invite() {
    const dialogRef = this.dialog.open(AddUserToOrganizationComponent, {});
    const organizationId = this.organizationId$.getValue();
    if (!organizationId) {
      return;
    }
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.organizationsService.addUserToOrganization({
          name: result.userLogin,
          organizationId,
        });
      }
    });
  }

  kickOutUser(email: string | undefined) {
    if(!email) {
      return
    }

    const organizationId = this.organizationId$.getValue()
    if(! organizationId) {
      return
    }
    
    this.organizationsService.kickOutUserFromOrganization({
      username: email,
      organizationId
    })
  }

  leaveOrganization(){
    const organizationId = this.organizationId$.getValue()
    if(! organizationId) {
      return
    }

    this.organizationsService.leaveOrganization({
      organizationId: organizationId
    })

  }
}
