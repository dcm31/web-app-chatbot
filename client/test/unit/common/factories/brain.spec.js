/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.brain module', function() {
    beforeEach(module('common.factories.brain'));

    describe('brain', function() {
      it('should exist', inject(function( brain ) {
        expect( brain ).toBeDefined();
      }));
    });
  });
})();