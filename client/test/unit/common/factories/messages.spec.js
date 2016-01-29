/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.messages module', function() {
    beforeEach(module('common.factories.messages'));

    describe('messages', function() {
      it('should exist', inject(function( messages ) {
        expect( messages ).toBeDefined();
      }));
    });
  });
})();