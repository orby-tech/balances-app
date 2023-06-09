import { Injectable } from '@angular/core';
import { AddOrganizationInput, AddUserToOrganizationInput, KickOutUserFromOrganizationInput, LeaveOrganizationInput, Organization } from '@common/graphql';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  organizations$ = new BehaviorSubject<Organization[]>([]);

  constructor(private apollo: Apollo) {}
  load() {
    this.apollo
      .query({
        query: gql`
          {
            organizations {
              organization_id
              name
              role
              users {
                email
                role
              }
            }
          }
        `,
      })
      .pipe(first())
      .subscribe((result: any) => {
        this.organizations$.next(result?.data?.organizations || []);
      });
  }

  addOrganization(organization: AddOrganizationInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addOrganization($addOrganizationInput: AddOrganizationInput!) {
            addOrganization(addOrganizationInput: $addOrganizationInput) 
          }
        `,
        variables: {
          addOrganizationInput: organization,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }

  addUserToOrganization(organization: AddUserToOrganizationInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation addUserToOrganization($addUserToOrganizationInput: AddUserToOrganizationInput!) {
            addUserToOrganization(addUserToOrganizationInput: $addUserToOrganizationInput) 
          }
        `,
        variables: {
          addUserToOrganizationInput: organization,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }

  leaveOrganization(organization: LeaveOrganizationInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation leaveOrganization($leaveOrganizationInput: LeaveOrganizationInput!) {
            leaveOrganization(leaveOrganizationInput: $leaveOrganizationInput) 
          }
        `,
        variables: {
          leaveOrganizationInput: organization,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }

  kickOutUserFromOrganization(organization: KickOutUserFromOrganizationInput) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation kickOutUserFromOrganization($kickOutUserFromOrganizationInput: KickOutUserFromOrganizationInput!) {
            kickOutUserFromOrganization(kickOutUserFromOrganizationInput: $kickOutUserFromOrganizationInput) 
          }
        `,
        variables: {
          kickOutUserFromOrganizationInput: organization,
        },
      })
      .subscribe((x) => {
        this.load();
      });
  }
}
