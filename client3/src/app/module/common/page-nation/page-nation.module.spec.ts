import { PageNationModule } from './page-nation.module';

describe('PageNationModule', () => {
  let pageNationModule: PageNationModule;

  beforeEach(() => {
    pageNationModule = new PageNationModule();
  });

  it('should create an instance', () => {
    expect(pageNationModule).toBeTruthy();
  });
});
