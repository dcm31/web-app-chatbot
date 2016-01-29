/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.isAnonymousService module', function() {
    beforeEach(module('common.factories.isAnonymousService'));

    describe('isAnonymousService', function() {
      it('should exist', inject(function( isAnonymousService ) {
        expect( isAnonymousService ).toBeDefined();
      }));
    });
  });
})();