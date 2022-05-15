import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUploadVideosComponent } from './user-upload-videos.component';

describe('UserUploadVideosComponent', () => {
  let component: UserUploadVideosComponent;
  let fixture: ComponentFixture<UserUploadVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUploadVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUploadVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
