import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDetailPageComponent } from './board-detail-page.component';

describe('BoardDetailPageComponent', () => {
  let component: BoardDetailPageComponent;
  let fixture: ComponentFixture<BoardDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
