/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.tester module', function() {
    beforeEach(module('common.factories.tester'));

    describe('tester', function() {
      it('should exist', inject(function( tester ) {
        expect( tester ).toBeDefined();
      }));
    });
  });
})();