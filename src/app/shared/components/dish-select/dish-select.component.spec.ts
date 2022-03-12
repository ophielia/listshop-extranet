import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DishSelectComponent} from './dish-select.component';

describe('DishSelectComponent', () => {
  let component: DishSelectComponent;
  let fixture: ComponentFixture<DishSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DishSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
