/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.responseService module', function() {
    beforeEach(module('common.factories.responseService'));

    describe('responseService', function() {
      it('should exist', inject(function( responseService ) {
        expect( responseService ).toBeDefined();
      }));
    });
  });
})();