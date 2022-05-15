import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerGoogleDriveComponent } from './video-player-google-drive.component';

describe('VideoPlayerGoogleDriveComponent', () => {
  let component: VideoPlayerGoogleDriveComponent;
  let fixture: ComponentFixture<VideoPlayerGoogleDriveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPlayerGoogleDriveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerGoogleDriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
