(function() {
  'use strict';

  /**
   * @name  brain
   * @description Factory
   */
  function brain () {

    return {
      emptyFunction: function(){
        return 'nothing in here';
      }
    };

  }
  angular.module('common.factories.brain', [])
  .factory('brain', brain );
})();
