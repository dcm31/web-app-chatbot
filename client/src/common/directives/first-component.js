(function() {
  'use strict';

  function firstComponent () {
    return {
      restrict: 'E',
      templateUrl: 'src/common/partials/first-component.tpl.html',
      controller: 'FirstComponentDirectiveController',
      bindToController: true,
      scope: {
      },
    };
  }

  angular.module('common.directives.firstComponent', [])
    .directive('firstComponent', firstComponent);
})();
