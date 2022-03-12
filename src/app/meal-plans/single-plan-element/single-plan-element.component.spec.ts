import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {SinglePlanElementComponent} from "./single-list-element.component";



describe('ManageListsComponent', () => {
  let component: SinglePlanElementComponent;
  let fixture: ComponentFixture<SinglePlanElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinglePlanElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePlanElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
