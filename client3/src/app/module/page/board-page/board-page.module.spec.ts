import { BoardPageModule } from './board-page.module';

describe('BoardPageModule', () => {
  let boardPageModule: BoardPageModule;

  beforeEach(() => {
    boardPageModule = new BoardPageModule();
  });

  it('should create an instance', () => {
    expect(boardPageModule).toBeTruthy();
  });
});
