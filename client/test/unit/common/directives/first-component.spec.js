/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.directives.firstComponent  module', function() {
    var element, scope;
    beforeEach(module('common.directives.firstComponent', function ($controllerProvider) {
      var mockController = function () {};
      $controllerProvider.register('FirstComponentDirectiveController', mockController);
    }));
    beforeEach(module('templates'));
    beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = '<first-component></first-component>';
      element = $compile(element)(scope);
      scope.$digest();
    }));

    describe('first-component directive', function() {
      it('should have an isolate scope', function() {
        var isolateScope = element.isolateScope();
        expect(isolateScope).toBeDefined();
      });
    });
  });
})();
