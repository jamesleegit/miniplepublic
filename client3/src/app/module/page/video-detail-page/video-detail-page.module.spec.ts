import { VideoDetailPageModule } from './video-detail-page.module';

describe('VideoDetailPageModule', () => {
  let videoDetailPageModule: VideoDetailPageModule;

  beforeEach(() => {
    videoDetailPageModule = new VideoDetailPageModule();
  });

  it('should create an instance', () => {
    expect(videoDetailPageModule).toBeTruthy();
  });
});
