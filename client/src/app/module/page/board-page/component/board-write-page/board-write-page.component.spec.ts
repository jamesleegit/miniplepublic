import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardWritePageComponent } from './board-write-page.component';

describe('BoardWritePageComponent', () => {
  let component: BoardWritePageComponent;
  let fixture: ComponentFixture<BoardWritePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardWritePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardWritePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
