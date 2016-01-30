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
      },
      getYesterday: function(){
        return Date.now()-30*3600000;
      }
    };
  }
  angular.module('common.factories.brain', [])
    .factory('brain', brain );
})();
