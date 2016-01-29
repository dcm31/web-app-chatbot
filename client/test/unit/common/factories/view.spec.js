/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.view module', function() {
    beforeEach(module('common.factories.view'));

    describe('view', function() {
      it('should exist', inject(function( view ) {
        expect( view ).toBeDefined();
      }));
    });
  });
})();