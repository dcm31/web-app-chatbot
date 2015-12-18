(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.home', {
        url: '/',
        views: {
          '@': {
            templateUrl: 'src/app/home/home.tpl.html',
            controller: 'HomeCtrl as home',
            resolve: {
              data: function(DataService) {
                return DataService.get();
              }
            }
          }
        }
      });
var obj = {
        url: '/charlie',
        views: {
          '@': {
            templateUrl: 'src/app/charlie/charlie.tpl.html',
            controller: 'CharlieController as vm',
          }
        }
      };
      $stateProvider
      .state('root.charlie',obj );
  }

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function HomeCtrl(data) {
    var home = this;
    home.data = data.data;
  }
  /**
   * @name  CharlieController
   * @description Controller
   */
  function CharlieController() {
    var vm = this;
    vm.data = 'cat';
    console.log(vm);
  }

  angular.module('home', [])
    .config(config)
    .controller('HomeCtrl', HomeCtrl)
    .controller('CharlieController', CharlieController);
})();
