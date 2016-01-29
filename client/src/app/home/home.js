(function() {
  'use strict';

  require('angularfire');
  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'src/app/charlie/login.html',
        controller: 'LoginController'
      })
      .state('secure', {
        url: '/secure',
        templateUrl: 'src/app/charlie/secure.html',
        controller: 'SecureController'
              })
      .state('root.home', {
        url: '/home',
            templateUrl: 'src/app/charlie/chat.tpl.html',
            controller: 'HomeCtrl as home',
            resolve: {
              requireNoAuth: function(Auth){
                  console.log('about to check out auth');
                  return Auth.$requireAuth().then(function(auth){
                         console.log('not an anonymous user');
                         return auth;
                      }, function(){
                          console.log('tis an anonymous user');
                          return;
                      });
              },
              data: function(DataService) {
                console.log('resolving stupid dataservice');
                return DataService.get();
              }
              /*,
              authentication: function(isAnonymousService){
                console.log('we are in the service resolve');
                retur isAnonymousService;
              }*/
        }
      });
      $urlRouterProvider.otherwise('/login');
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
  function HomeCtrl() {
    
    console.log('inside new home controller');
    }

  /**
   * @name  CharlieController
   * @description Controller
   */
  function CharlieController($http) {
    var vm = this;
    console.log('inside charlie controller');
    vm.data = 'cat';
    console.log(vm);
    $http.defaults.headers.get = { 'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTI3MDQ4ODksInNjb3BlcyI6InJudXQgcmFjdCIsInN1YiI6IjNZRlEzUyIsImF1ZCI6IjIyN0pDRiIsImlzcyI6IkZpdGJpdCIsInR5cCI6ImFjY2Vzc190b2tlbiIsImlhdCI6MTQ1MjEwNjM4OH0.aXVi9f30Dc55W6Dw43SUuGJnj-p-jC9p6tMyRHgdYgw' };
    $http.get('https://api.fitbit.com/1/user/3YFQ3S/activities/date/2015-12-29.json').then(function(response){
      console.log(response.data);
    });
  }

  function LoginController($scope) {

    $scope.login = function() {
      window.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id='+'227JCF'+'&scope=activity%20nutrition&expires_in=604800';
    };
  }

  function SecureController($scope) {

    $scope.accessToken = JSON.parse(window.localStorage.getItem('fitbit'));
  }
  angular.module('home', [])
    .config(config)
    .controller('HomeCtrl', HomeCtrl)
    .controller('CharlieController', CharlieController)
    .controller('SecureController', SecureController)
    .controller('LoginController', LoginController)
    .constant('FirebaseUrl', 'http://zee.firebaseio.com/');
    
})();
