import { VideoPageModule } from './video-page.module';

describe('VideoPageModule', () => {
  let videoPageModule: VideoPageModule;

  beforeEach(() => {
    videoPageModule = new VideoPageModule();
  });

  it('should create an instance', () => {
    expect(videoPageModule).toBeTruthy();
  });
});
