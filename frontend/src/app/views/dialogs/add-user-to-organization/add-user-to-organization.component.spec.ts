import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToOrganizationComponent } from './add-user-to-organization.component';

describe('AddUserToOrganizationComponent', () => {
  let component: AddUserToOrganizationComponent;
  let fixture: ComponentFixture<AddUserToOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserToOrganizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserToOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
