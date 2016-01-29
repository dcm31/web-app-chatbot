/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.users module', function() {
    beforeEach(module('common.factories.users'));

    describe('users', function() {
      it('should exist', inject(function( users ) {
        expect( users ).toBeDefined();
      }));
    });
  });
})();