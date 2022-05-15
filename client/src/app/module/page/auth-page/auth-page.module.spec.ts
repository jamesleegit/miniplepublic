import { AuthPageModule } from './auth-page.module';

describe('AuthPageModule', () => {
  let authPageModule: AuthPageModule;

  beforeEach(() => {
    authPageModule = new AuthPageModule();
  });

  it('should create an instance', () => {
    expect(authPageModule).toBeTruthy();
  });
});
