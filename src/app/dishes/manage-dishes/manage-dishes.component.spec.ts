import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDishesComponent } from './manage-dishes.component';

describe('ManageListsComponent', () => {
  let component: ManageDishesComponent;
  let fixture: ComponentFixture<ManageDishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDishesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
