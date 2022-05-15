import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUploadPageComponent } from './video-upload-page.component';

describe('VideoUploadPageComponent', () => {
  let component: VideoUploadPageComponent;
  let fixture: ComponentFixture<VideoUploadPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoUploadPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
