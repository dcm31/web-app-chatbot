(function() {
  'use strict';

  /**
   * @name  brain
   * @description Factory
   */
  function brain () {

    return {
      getDate: function(unixEpoch) {
        var dater = new Date(unixEpoch);
        var iso = dater.toISOString();
        return parseInt(iso.substring(0,10).replace(/-/g,''));
      }
    };
  }
  angular.module('common.factories.brain', [])
    .factory('brain', brain );
})();
