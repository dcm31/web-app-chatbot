/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.dates module', function() {
    beforeEach(module('common.factories.dates'));

    describe('dates', function() {
      it('should exist', inject(function( dates ) {
        expect( dates ).toBeDefined();
      }));
    });
  });
})();