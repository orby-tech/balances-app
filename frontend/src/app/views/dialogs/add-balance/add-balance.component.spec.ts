import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBalanceComponent } from './add-balance.component';

describe('AddBalanceComponent', () => {
  let component: AddBalanceComponent;
  let fixture: ComponentFixture<AddBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
