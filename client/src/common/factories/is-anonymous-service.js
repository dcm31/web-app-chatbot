(function() {
  'use strict';

  /**
   * @name  isAnonymousService
   * @description Factory
   */
  function isAnonymousService () {
    console.log('we are inside the isanonymous services');
    var isAnon = true;
                
                
    return isAnon; 
  }
  angular.module('common.factories.isAnonymousService', [])
    .factory('isAnonymousService', isAnonymousService );
})();
