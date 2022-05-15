import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoardCommentComponent } from './board-comment.component';

describe('BoardCommentComponent', () => {
  let component: BoardCommentComponent;
  let fixture: ComponentFixture<BoardCommentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
