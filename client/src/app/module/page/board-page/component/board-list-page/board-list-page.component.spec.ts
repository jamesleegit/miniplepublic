import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardListPageComponent } from './board-list-page.component';

describe('BoardListPageComponent', () => {
  let component: BoardListPageComponent;
  let fixture: ComponentFixture<BoardListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
