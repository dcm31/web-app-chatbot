(function() {
  'use strict';

  /**
   * @name  dates
   * @description Factory
   */
  function dates () {
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
  angular.module('common.factories.dates', [])
    .factory('dates', dates );
})();
