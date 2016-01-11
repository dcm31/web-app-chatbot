(function() {
  'use strict';

  require('firebase');
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
        url: '/',
        views: {
          '@': {
            templateUrl: 'src/app/charlie/chat.tpl.html',
            controller: 'HomeCtrl as home',
            resolve: {
              data: function(DataService) {
                return DataService.get();
              },
              start: home.start()
            }
          }
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
  function HomeCtrl(data) {
    var home = this;
    home.start = function(){
      var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
      ref.authAnonymously(function(error, authData) {
          if (error) {
                console.log("Login Failed!", error);
                  
          } else {
                console.log("Authenticated successfully with payload:", authData);
                  
          }
          
      });
    }
    home.data = data.data;
    home.greeting = "Hello.";
    home.log = function(){
      console.log(home.greeting);
    }
  }
  /**
   * @name  CharlieController
   * @description Controller
   */
  function CharlieController($http) {
    var vm = this;
    vm.data = 'cat';
    console.log(vm);
    $http.defaults.headers.get = { 'Authorization' : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NTI3MDQ4ODksInNjb3BlcyI6InJudXQgcmFjdCIsInN1YiI6IjNZRlEzUyIsImF1ZCI6IjIyN0pDRiIsImlzcyI6IkZpdGJpdCIsInR5cCI6ImFjY2Vzc190b2tlbiIsImlhdCI6MTQ1MjEwNjM4OH0.aXVi9f30Dc55W6Dw43SUuGJnj-p-jC9p6tMyRHgdYgw' }
    $http.get('https://api.fitbit.com/1/user/3YFQ3S/activities/date/2015-12-29.json').then(function(response){
      console.log(response.data);
    });
  }

  function LoginController($scope) {

    $scope.login = function() {
      window.location.href = "https://www.fitbit.com/oauth2/authorize?response_type=token&client_id="+"227JCF"+"&scope=activity%20nutrition&expires_in=604800"
    }
  }

  function SecureController($scope) {

    $scope.accessToken = JSON.parse(window.localStorage.getItem("fitbit"));
  }
  angular.module('home', [])
    .config(config)
    .controller('HomeCtrl', HomeCtrl)
    .controller('CharlieController', CharlieController)
    .controller('SecureController', SecureController)
    .controller('LoginController', LoginController)
    .constant('FirebaseUrl', 'http://zee.firebaseio.com/');
})();
