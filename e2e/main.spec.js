'use strict';

/*var AngularHomepage = function() {
  var nameInput = element(by.model('yourName'));
  var greeting = element(by.binding('yourName'));

  this.get = function() {
    browser.get('http://www.angularjs.org');
  };

  this.setName = function(name) {
    nameInput.sendKeys(name);
  };

  this.getGreeting = function() {
    return greeting.getText();
  };
};*/

describe('index.html', function() {

  beforeEach(function() {
    browser.get('http://localhost:3000/index.html');
  });

  it('get index html', function() {

    var a = element(by.model('a'));
    var b = element(by.model('b'));
    a.sendKeys(1);
    b.sendKeys(2);
    var result = element(by.id('result'));
    expect(result.getText()).toEqual('3');
  });
});


/*describe('The main view', function () {
  var page;

  beforeEach(function () {
    browser.get('/index.html');
    page = require('./main.po');
  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });

  it('should list more than 5 awesome things', function () {
    expect(page.thumbnailEls.count()).toBeGreaterThan(5);
  });

});*/
