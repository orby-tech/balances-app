import { Injectable } from '@angular/core';
import { AddOrganizationInput, Organization } from '@common/graphql';
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
}
