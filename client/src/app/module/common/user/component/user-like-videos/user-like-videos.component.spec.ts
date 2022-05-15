import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLikeVideosComponent } from './user-like-videos.component';

describe('UserLikeVideosComponent', () => {
  let component: UserLikeVideosComponent;
  let fixture: ComponentFixture<UserLikeVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLikeVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLikeVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
