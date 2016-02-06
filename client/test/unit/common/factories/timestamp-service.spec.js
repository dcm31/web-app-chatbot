/* jshint undef:false*/
(function() {
  'use strict';
  describe('common.factories.timestampService module', function() {
    beforeEach(module('common.factories.timestampService'));

    describe('timestampService', function() {
      it('should exist', inject(function( timestampService ) {
        expect( timestampService ).toBeDefined();
      }));
    });
  });
})();