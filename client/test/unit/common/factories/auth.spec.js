/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.auth module', function() {
    beforeEach(module('common.factories.auth'));

    describe('auth', function() {
      it('should exist', inject(function( auth ) {
        expect( auth ).toBeDefined();
      }));
    });
  });
})();