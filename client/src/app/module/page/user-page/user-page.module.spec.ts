import { UserPageModule } from './user-page.module';

describe('UserPageModule', () => {
  let userPageModule: UserPageModule;

  beforeEach(() => {
    userPageModule = new UserPageModule();
  });

  it('should create an instance', () => {
    expect(userPageModule).toBeTruthy();
  });
});
