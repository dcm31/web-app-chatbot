/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.controllers.FirstComponentDirectiveController module', function() {
    var controller;
    beforeEach(module('common.controllers.FirstComponentDirectiveController'));
    beforeEach(inject(function($controller) {
      controller = $controller('FirstComponentDirectiveController', {});
    }));

    describe('FirstComponentDirectiveController', function () {
      it('should exist', function () {
        expect(controller).toBeDefined();
      });
    });
  });
})();
