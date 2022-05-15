import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageNationComponent } from './page-nation.component';

describe('PageNationComponent', () => {
  let component: PageNationComponent;
  let fixture: ComponentFixture<PageNationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageNationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
