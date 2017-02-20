import { PorPage } from './app.po';

describe('por App', function() {
  let page: PorPage;

  beforeEach(() => {
    page = new PorPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
