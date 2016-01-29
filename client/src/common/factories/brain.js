(function() {
  'use strict';

  /**
   * @name  brain
   * @description Factory
   */
  function brain () {

    return {
      getDate: function(unixEpoch) {
        console.log(unixEpoch);
        var dater = new Date(unixEpoch);
        var iso = dater.toISOString();
        console.log(iso);
        return parseInt(iso.substring(0,10).replace(/-/g,''));
      }
    };
  }
  angular.module('common.factories.brain', [])
    .factory('brain', brain );
})();
