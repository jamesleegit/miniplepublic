import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerYoutubeComponent } from './video-player-youtube.component';

describe('VideoPlayerYoutubeComponent', () => {
  let component: VideoPlayerYoutubeComponent;
  let fixture: ComponentFixture<VideoPlayerYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPlayerYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
