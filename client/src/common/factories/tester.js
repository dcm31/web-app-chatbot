(function() {
  'use strict';

  /**
   * @name  tester
   * @description Factory
   */
  function tester () {
    return {
      exampleMethod: function(param) {
        console.log(param);
      }
    };
  }
  angular.module('common.factories.tester', [])
    .factory('tester', tester );
})();